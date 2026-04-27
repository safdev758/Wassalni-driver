export const colors = {
  // Surface colors
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#393939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1b1b1b',
  surfaceContainer: '#1f1f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353535',
  
  // Primary colors
  primary: '#b7c4ff',
  onPrimary: '#002584',
  primaryContainer: '#000000',
  onPrimaryContainer: '#3b67ff',
  primaryFixed: '#dde1ff',
  onPrimaryFixed: '#001453',
  primaryFixedDim: '#b7c4ff',
  onPrimaryFixedVariant: '#0037b8',
  
  // Secondary colors
  secondary: '#c6c6c7',
  onSecondary: '#2f3131',
  secondaryContainer: '#454747',
  onSecondaryContainer: '#b4b5b5',
  secondaryFixed: '#e2e2e2',
  onSecondaryFixed: '#1a1c1c',
  secondaryFixedDim: '#c6c6c7',
  onSecondaryFixedVariant: '#454747',
  
  // Tertiary colors
  tertiary: '#c6c6c6',
  onTertiary: '#303030',
  tertiaryContainer: '#000000',
  onTertiaryContainer: '#757575',
  tertiaryFixed: '#e2e2e2',
  onTertiaryFixed: '#1b1b1b',
  tertiaryFixedDim: '#c6c6c6',
  onTertiaryFixedVariant: '#474747',
  
  // Error colors
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  
  // Surface variants
  surfaceVariant: '#353535',
  onSurfaceVariant: '#cfc4c5',
  outline: '#988e90',
  outlineVariant: '#4c4546',
  
  // Inverse colors
  inverseSurface: '#e2e2e2',
  inverseOnSurface: '#303030',
  inversePrimary: '#004bf0',
  
  // Background and surface
  background: '#131313',
  onBackground: '#e2e2e2',
  onSurface: '#e2e2e2',
  surfaceTint: '#b7c4ff',
  
  // Shadow
  shadow: '#000000',
} as const;

export type Colors = typeof colors;
