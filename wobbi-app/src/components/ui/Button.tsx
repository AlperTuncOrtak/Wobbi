import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps, 
  ViewStyle 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '@/store/themeStore';

// Direkt burada tanımlıyoruz, theme.ts'e bağımlılık yok
const THEME_COLORS = {
  day: {
    background: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#1E293B',
    textMuted: '#64748B',
    primary: '#6C4EF5',
    border: 'rgba(0,0,0,0.08)',
  },
  night: {
    background: '#0F1020',
    cardBg: '#1A1C3A',
    text: '#FFFFFF',
    textMuted: '#94A3B8',
    primary: '#7D67FF',
    border: 'rgba(255,255,255,0.08)',
  },
};

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  leftIcon, 
  rightIcon, 
  style, 
  disabled, 
  ...props 
}: ButtonProps) {
  
  const { theme } = useThemeStore();
  const isDay = theme === 'day';
  const colors = isDay ? THEME_COLORS.day : THEME_COLORS.night;

  const sizeStyles = {
    sm: { paddingHorizontal: 16, fontSize: 13, height: 36 },
    md: { paddingHorizontal: 24, fontSize: 15, height: 52 },
    lg: { paddingHorizontal: 32, fontSize: 17, height: 60 },
  };

  const currentSize = sizeStyles[size];

  let bgColor: string = colors.primary;
  let textColor: string = '#FFFFFF';
  let borderColor: string = 'transparent';

  switch (variant) {
    case 'primary':
      bgColor = colors.primary;
      textColor = '#FFFFFF';
      break;
    case 'secondary':
      bgColor = colors.cardBg;
      textColor = colors.text;
      borderColor = colors.border;
      break;
    case 'ghost':
      bgColor = 'transparent';
      textColor = '#FFFFFF';
      break;
    case 'glass':
      bgColor = 'transparent';
      textColor = colors.text;
      borderColor = colors.border;
      break;
  }

  const opacity = disabled || isLoading ? 0.6 : 1;

  const content = (
    <>
      {isLoading ? (
        <ActivityIndicator color={textColor} style={styles.iconLeft} />
      ) : (
        leftIcon && <React.Fragment>{leftIcon}</React.Fragment>
      )}
      <Text style={[styles.text, { color: textColor, fontSize: currentSize.fontSize }]}>
        {title}
      </Text>
      {rightIcon && <React.Fragment>{rightIcon}</React.Fragment>}
    </>
  );

  if (variant === 'glass') {
    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        disabled={disabled || isLoading} 
        style={[{ opacity, height: currentSize.height }, style]} 
        {...props}
      >
        <BlurView 
          intensity={isDay ? 40 : 20} 
          tint={isDay ? "light" : "dark"} 
          style={[
            styles.baseButton, 
            { paddingHorizontal: currentSize.paddingHorizontal, borderColor: colors.border, borderWidth: 1 }
          ]}
        >
          {content}
        </BlurView>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        styles.baseButton,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: variant === 'secondary' ? 1 : 0,
          paddingHorizontal: currentSize.paddingHorizontal,
          height: currentSize.height,
          opacity
        },
        style as ViewStyle
      ]}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  text: {
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  }
});
