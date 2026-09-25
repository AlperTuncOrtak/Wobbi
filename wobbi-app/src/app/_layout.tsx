
import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from '@clerk/expo';
import { PostHogProvider } from 'posthog-react-native';
import { tokenCache } from '../lib/clerk';
import { useLanguageStore } from '../store/languageStore';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { posthog } from '../lib/posthog';

SplashScreen.preventAutoHideAsync();

// Temporarily hardcoded to remove the invalid trailing characters that break Clerk Web
const publishableKey = "pk_test_YnVzeS12aXBlci04MDE2LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!publishableKey) {
  throw new Error("Missing Publishable Key");
}

function PostHogIdentity() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { selectedLanguage } = useLanguageStore();
  const identifiedUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      if (identifiedUserId.current !== null) {
        posthog?.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    const personProperties: Record<string, any> = {};
    const email = user.primaryEmailAddress?.emailAddress;

    if (email) personProperties.email = email;
    if (user.firstName) personProperties.first_name = user.firstName;
    if (user.lastName) personProperties.last_name = user.lastName;
    
    if (selectedLanguage) {
      personProperties.preferred_language = selectedLanguage;
    }

    const setOnceProperties: Record<string, any> = {};
    if (user.createdAt) {
      setOnceProperties.signup_date = new Date(user.createdAt).toISOString();
    }

    posthog?.identify(user.id, {
      ...personProperties,
      $set_once: setOnceProperties,
    });
    
    identifiedUserId.current = user.id;
  }, [isLoaded, isSignedIn, user, selectedLanguage]);

  return null;
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  const { selectedLanguage } = useLanguageStore();
  const [languageHydrated, setLanguageHydrated] = useState(useLanguageStore.persist.hasHydrated());

  useEffect(() => {
    if (languageHydrated) return;
    return useLanguageStore.persist.onFinishHydration(() => setLanguageHydrated(true));
  }, [languageHydrated]);

  useEffect(() => {
    if (!isLoaded || !languageHydrated || !fontsLoaded) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (isSignedIn) {
      if (!selectedLanguage) {
        // Auth but no language -> go to language select
        if (segments[0] !== 'language-select') {
          router.replace('/language-select');
        }
      } else {
        // Auth and language selected -> go to tabs
        if (!inTabsGroup) {
          router.replace('/(tabs)');
        }
      }
    } else if (!isSignedIn) {
      // Not signed in -> go to onboarding or auth
      if ((segments as string[])[0] !== '' && segments[0] !== '(auth)') {
        router.replace('/');
      }
    }
  }, [isSignedIn, isLoaded, segments, selectedLanguage, languageHydrated]);

  if (!isLoaded || !languageHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6c4ef5" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <ClerkProvider 
      tokenCache={tokenCache} 
      publishableKey={publishableKey}
    >
      <ClerkLoaded>
        <StatusBar style="dark" />
        {posthog ? (
          <PostHogProvider client={posthog}>
            <PostHogIdentity />
            <InitialLayout />
          </PostHogProvider>
        ) : (
          <InitialLayout />
        )}
      </ClerkLoaded>
    </ClerkProvider>
  );
}



