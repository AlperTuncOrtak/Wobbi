import SocialButton from "@/components/SocialButton";
import VerificationModal from "@/components/VerificationModal";
import { useOAuth, useSignUp, useSSO } from "@clerk/expo";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { type Href, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { posthog } from "@/lib/posthog";
import { posthogLogger } from "@/lib/posthog-logger";
import { useThemeStore } from "@/store/themeStore";
import { Colors } from "@/constants/theme";
import { Button } from "@/components/ui/Button";

WebBrowser.maybeCompleteAuthSession();

type SSOStrategy = "oauth_google" | "oauth_facebook" | "oauth_apple";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const { theme } = useThemeStore();
  const colors = Colors[theme] || Colors.day;

  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [authError, setAuthError] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleSignUp = async () => {
    setAuthError("");
    const { error } = await signUp.create({ emailAddress: email });
    if (error) {
      setAuthError((error as any).errors?.[0]?.message || error.message || "Kayıt başlatılamadı.");
      return;
    }
    const { error: prepareError } = await signUp.prepareEmailAddressVerification();
    if (prepareError) {
      setAuthError((prepareError as any).errors?.[0]?.message || prepareError.message || "Doğrulama e-postası gönderilemedi.");
      return;
    }
    setShowVerification(true);
  };

  const handleVerify = async (code: string) => {
    const { error } = await signUp.attemptEmailAddressVerification({ code });
    if (error) {
      return;
    }
    if (signUp.status === "complete") {
      await signUp.setActive({ session: signUp.createdSessionId });
      posthog?.capture("sign_up_completed", { sign_up_method: "email_code" });
      posthogLogger.authenticationCompleted("sign_up", "email_code");
      router.replace("/");
    }
  };

  const handleResend = async () => {
    await signUp.prepareEmailAddressVerification();
  };

  const handleSSO = async (strategy: SSOStrategy) => {
    setAuthError("");
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/"),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        posthog?.capture("sign_up_completed", { sign_up_method: strategy });
        posthogLogger.authenticationCompleted("sign_up", strategy);
        router.replace("/");
      }
    } catch (err: any) {
      console.error("SSO Error:", err);
      setAuthError(err?.errors?.[0]?.longMessage || err?.message || JSON.stringify(err) || "SSO Hatası");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Header */}
          <Text style={[styles.headerTitle, { color: colors.text }]}>Maceraya Katıl!</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Sonsuz masal dünyasına adım atmak için hesap oluştur ✨
          </Text>

          {/* Mascot */}
          <View style={styles.mascotContainer}>
            <Image
              source={{ uri: "https://cdn3d.iconscout.com/3d/premium/thumb/rocket-4993673-4160416.png" }}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
          </View>

          {/* Email */}
          <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.cardBg }]}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>E-posta</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="sihirbaz@wobbi.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { color: colors.text }]}
            />
          </View>
          
          {errors?.fields?.emailAddress ? (
            <Text style={styles.errorText}>
              {errors.fields.emailAddress.message}
            </Text>
          ) : null}
          
          {errors?.global?.[0] ? (
            <Text style={styles.errorText}>
              {errors.global[0].message}
            </Text>
          ) : null}
          
          {authError ? (
            <Text style={styles.errorText}>{authError}</Text>
          ) : null}

          {/* Sign Up button */}
          <View style={{ marginTop: 8 }}>
            <Button
              title={isLoading ? "Hesap açılıyor..." : "Kayıt Ol"}
              onPress={handleSignUp}
              disabled={!email || isLoading}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              veya şununla devam et
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social */}
          <SocialButton
            icon={<AntDesign name="google" size={20} color="#DB4437" />}
            label="Google ile Kayıt Ol"
            onPress={() => handleSSO("oauth_google")}
          />
          <SocialButton
            icon={<FontAwesome name="facebook" size={20} color="#1877F2" />}
            label="Facebook ile Kayıt Ol"
            onPress={() => handleSSO("oauth_facebook")}
          />
          <SocialButton
            icon={<AntDesign name="apple" size={20} color={theme === 'night' ? '#FFF' : '#000'} />}
            label="Apple ile Kayıt Ol"
            onPress={() => handleSSO("oauth_apple")}
          />

          {/* Sign In link */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Zaten hesabın var mı?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Giriş Yap
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={showVerification}
        email={email}
        onClose={() => setShowVerification(false)}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { marginTop: 16, width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontFamily: 'Poppins_700Bold', fontSize: 28, marginTop: 8 },
  headerSub: { fontFamily: 'Poppins_400Regular', fontSize: 15, marginTop: 4 },
  mascotContainer: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    marginBottom: 12,
  },
  inputLabel: { fontFamily: 'Poppins_400Regular', fontSize: 11, marginBottom: 2 },
  input: { fontFamily: 'Poppins_400Regular', fontSize: 14, padding: 0 },
  errorText: { fontFamily: 'Poppins_400Regular', fontSize: 13, color: "#ff4d4f", marginBottom: 8 },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontFamily: "Poppins_400Regular", fontSize: 13 },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 16, marginBottom: 32 },
  footerText: { fontFamily: "Poppins_400Regular", fontSize: 14 },
  footerLink: { fontFamily: "Poppins_600SemiBold", fontSize: 14 },
});
