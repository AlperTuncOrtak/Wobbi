import SocialButton from "@/components/SocialButton";
import VerificationModal from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { useSignIn, useSSO } from "@clerk/expo";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { posthog } from "@/lib/posthog";
import { posthogLogger } from "@/lib/posthog-logger";

WebBrowser.maybeCompleteAuthSession();

type SSOStrategy = "oauth_google" | "oauth_facebook" | "oauth_apple";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [authError, setAuthError] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleSignIn = async () => {
    setAuthError("");
    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
    if (error) {
      setAuthError((error as any).errors?.[0]?.message || error.message || "We couldn't start sign in. Please try again.");
      return;
    }
    setShowVerification(true);
  };

  const handleVerify = async (code: string) => {
    const { error } = await signIn.emailCode.verifyCode({ code });
    if (error) {
      return;
    }
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          router.replace(decorateUrl("/") as Href);
        },
      });
      posthog?.capture("sign_in_completed", { sign_in_method: "email_code" });
      posthogLogger.authenticationCompleted("sign_in", "email_code");
    }
  };

  const handleResend = async () => {
    await signIn.emailCode.sendCode({ emailAddress: email });
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
        posthog?.capture("sign_in_completed", { sign_in_method: strategy });
        posthogLogger.authenticationCompleted("sign_in", strategy);
        router.replace("/");
      }
    } catch (err: any) {
      console.error("SSO Error:", err);
      setAuthError(err?.errors?.[0]?.longMessage || err?.message || JSON.stringify(err) || "SSO Error");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6">
            {/* Back */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-4 w-10 h-10 justify-center"
            >
              <Ionicons name="chevron-back" size={24} color="#001328" />
            </TouchableOpacity>

            {/* Header */}
            <Text className="font-poppins-bold text-[28px] text-text-primary mt-2">Welcome back!</Text>
            <Text className="font-poppins-regular text-base text-text-secondary mt-1">
              Continue your language journey ✨
            </Text>

            {/* Mascot */}
            <View className="items-center mt-6 mb-6">
              <Image
                source={images.mascotAuth}
                style={{ width: 160, height: 160 }}
                resizeMode="contain"
              />
            </View>

            {/* Email */}
            <View className="border border-border rounded-2xl px-4 pt-2.5 pb-3 mb-3">
              <Text className="font-poppins-regular text-[11px] text-text-secondary mb-0.5">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="alex@gmail.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ padding: 0 }}
                className="font-poppins-regular text-[14px] text-text-primary"
              />
            </View>
            
            {errors?.fields?.identifier ? (
              <Text className="font-poppins-regular text-[13px] text-semantic-error -mt-1 mb-2">
                {errors.fields.identifier.message}
              </Text>
            ) : null}
            
            {errors?.global?.[0] ? (
              <Text className="font-poppins-regular text-[13px] text-semantic-error mb-2">
                {errors.global[0].message}
              </Text>
            ) : null}
            
            {authError ? (
              <Text className="font-poppins-regular text-[13px] text-semantic-error mb-2">{authError}</Text>
            ) : null}

            {/* Sign In button */}
            <TouchableOpacity
              className="bg-lingua-purple rounded-2xl py-4 items-center mt-2"
              activeOpacity={0.85}
              onPress={handleSignIn}
              disabled={!email || isLoading}
              style={{ opacity: !email || isLoading ? 0.6 : 1 }}
            >
              <Text className="font-poppins-semibold text-base text-white">
                {isLoading ? "Signing in..." : "Log in"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6 gap-3">
              <View className="flex-1 h-px bg-border" />
              <Text className="font-poppins-regular text-[13px] text-text-secondary">
                or continue with
              </Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Social */}
            <SocialButton
              icon={<AntDesign name="google" size={20} color="#DB4437" />}
              label="Continue with Google"
              onPress={() => handleSSO("oauth_google")}
            />
            <SocialButton
              icon={<FontAwesome name="facebook" size={20} color="#1877F2" />}
              label="Continue with Facebook"
              onPress={() => handleSSO("oauth_facebook")}
            />
            <SocialButton
              icon={<AntDesign name="apple" size={20} color="#000" />}
              label="Continue with Apple"
              onPress={() => handleSSO("oauth_apple")}
            />

            {/* Sign Up link */}
            <View className="flex-row justify-center mt-4 mb-8">
              <Text className="font-poppins-regular text-[14px] text-text-secondary">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-up")}
              >
                <Text className="font-poppins-semibold text-[14px] text-lingua-purple">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Required for Clerk bot-protection */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={showVerification}
        email={email}
        onClose={() => setShowVerification(false)}
        onVerify={handleVerify}
        onResend={handleResend}
        error={errors?.fields?.code?.message || errors?.global?.[0]?.message || ""}
      />
    </SafeAreaView>
  );
}
