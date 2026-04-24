import { TextStyle } from 'react-native';

export const typography = {
  // Headline font (Manrope)
  headlineLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,
  headlineMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: 0,
  } as TextStyle,
  headlineSmall: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: 0,
  } as TextStyle,
  
  // Body font (Inter)
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  } as TextStyle,
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  } as TextStyle,
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  } as TextStyle,
  
  // Label font (Inter)
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,
  labelSmall: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0.5,
  } as TextStyle,
  
  // Display sizes
  displayLarge: {
    fontSize: 57,
    fontWeight: '400' as const,
    lineHeight: 64,
    letterSpacing: -0.25,
  } as TextStyle,
  displayMedium: {
    fontSize: 45,
    fontWeight: '400' as const,
    lineHeight: 52,
    letterSpacing: 0,
  } as TextStyle,
  displaySmall: {
    fontSize: 36,
    fontWeight: '400' as const,
    lineHeight: 44,
    letterSpacing: 0,
  } as TextStyle,
  
  // Title sizes
  titleLarge: {
    fontSize: 22,
    fontWeight: '500' as const,
    lineHeight: 28,
    letterSpacing: 0,
  } as TextStyle,
  titleMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  } as TextStyle,
  titleSmall: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
} as const;
