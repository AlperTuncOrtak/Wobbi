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
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={{ flex: 1, justifyContent: "flex-end" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} className="bg-black/45" />
        </TouchableWithoutFeedback>

        <View className="bg-white rounded-t-[28px] px-6 pt-7 pb-10 items-center">
          <TouchableOpacity onPress={onClose} className="absolute top-4 right-5 p-1">
            <Ionicons name="close" size={22} color="#6b7280" />
          </TouchableOpacity>

          <Text className="font-poppins-semibold text-[22px] text-text-primary mb-2 text-center">
            Check your email
          </Text>
          <Text className="font-poppins-regular textsm text-text-secondary text-center leading-[22px] mb-8">
            We sent a 6-digit code to{"\n"}
            <Text className="font-poppins-medium text-text-primary">{email || "your email"}</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            className="flex-row gap-2.5 mb-4"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                className={`w-12 h-14 border-[1.5px] rounded-2xl items-center justify-center ${
                  code[i]
                    ? "border-lingua-purple bg-lingua-purple/10"
                    : i === code.length
                      ? "border-lingua-purple bg-white"
                      : "border-border bg-white"
                }`}
              >
                <Text className="font-poppins-semibold text-[20px] text-text-primary">
                  {code[i] ?? ""}
                </Text>
              </View>
            ))}
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

          {error ? <Text className="font-poppins-regular text-[13px] text-semantic-error text-center mb-2">{error}</Text> : null}

          <TouchableOpacity className="py-1 mt-2" onPress={handleResend}>
            <Text className="font-poppins-regular text-[13px] text-text-secondary">
              Didn't receive it?{" "}
              <Text className="font-poppins-medium text-lingua-purple">Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
