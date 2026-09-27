import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";
import { Colors } from "@/constants/theme";

interface Props {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  error?: string;
}

export default function VerificationModal({
  visible,
  email,
  onClose,
  onVerify,
  onResend,
  error,
}: Props) {
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setCode("");
      setIsSubmitting(false);
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    if (error) {
      setCode("");
      setIsSubmitting(false);
    }
  }, [error]);

  const handleCodeChange = async (text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(digits);
    if (digits.length === 6 && !isSubmitting) {
      setIsSubmitting(true);
      await onVerify(digits);
    }
  };

  const handleResend = async () => {
    setCode("");
    await onResend();
    inputRef.current?.focus();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={[styles.modalContent, { backgroundColor: colors.background }]}
            >
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.title, { color: colors.text }]}>E-postanı Doğrula</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                {email} adresine gönderdiğimiz 6 haneli kodu gir.
              </Text>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
                style={styles.codeContainer}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const hasValue = !!code[i];
                  const isCurrent = i === code.length;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.codeBox,
                        {
                          borderColor: hasValue || isCurrent ? colors.primary : colors.border,
                          backgroundColor: hasValue ? colors.primary + '15' : colors.cardBg,
                        }
                      ]}
                    >
                      <Text style={[styles.codeText, { color: colors.text }]}>
                        {code[i] ?? ""}
                      </Text>
                    </View>
                  );
                })}
              </TouchableOpacity>

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={6}
                style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
                editable={!isSubmitting}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
                <Text style={[styles.resendText, { color: colors.textMuted }]}>
                  Kod gelmedi mi?{" "}
                  <Text style={[styles.resendLink, { color: colors.primary }]}>Yeniden Gönder</Text>
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingBottom: 48, paddingTop: 16 },
  header: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 12 },
  closeButton: { padding: 4 },
  title: { fontFamily: "Poppins_700Bold", fontSize: 24, textAlign: "center", marginBottom: 8 },
  subtitle: { fontFamily: "Poppins_400Regular", fontSize: 14, textAlign: "center", marginBottom: 32, paddingHorizontal: 16 },
  codeContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, paddingHorizontal: 16 },
  codeBox: { width: 44, height: 52, borderRadius: 12, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  codeText: { fontFamily: "Poppins_600SemiBold", fontSize: 20 },
  errorText: { fontFamily: "Poppins_400Regular", fontSize: 13, color: "#ff4d4f", textAlign: "center", marginBottom: 8 },
  resendButton: { paddingVertical: 4, marginTop: 8 },
  resendText: { fontFamily: "Poppins_400Regular", fontSize: 13, textAlign: "center" },
  resendLink: { fontFamily: "Poppins_500Medium" },
});
