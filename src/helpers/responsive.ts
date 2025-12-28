import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const isSmallScreen = SCREEN_WIDTH < 375;
export const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeScreen = SCREEN_WIDTH >= 414;

export function getResponsiveSize(
  baseSize: number,
  smallSize?: number,
  largeSize?: number
): number {
  if (isSmallScreen && smallSize !== undefined) {
    return smallSize;
  }
  if (isLargeScreen && largeSize !== undefined) {
    return largeSize;
  }
  return baseSize;
}

export function getResponsivePadding(
  basePadding: number,
  smallPadding?: number
): number {
  if (isSmallScreen && smallPadding !== undefined) {
    return smallPadding;
  }
  return basePadding;
}

export function getResponsiveFontSize(
  baseFontSize: number,
  smallFontSize?: number
): number {
  if (isSmallScreen && smallFontSize !== undefined) {
    return smallFontSize;
  }
  return baseFontSize;
}

export const BREAKPOINTS = {
  small: 375,
  medium: 414,
  large: 428,
};

export const RESPONSIVE_SIZES = {
  padding: {
    horizontal: getResponsiveSize(20, 16),
    vertical: getResponsiveSize(24, 20),
  },
  header: {
    height: 56,
    paddingTop: isSmallScreen ? 50 : 70,
  },
  button: {
    minHeight: 50,
  },
};

export const RESPONSIVE_FONT_SIZES = {
  title: getResponsiveFontSize(32, 28),
  subtitle: getResponsiveFontSize(17.5, 16),
  body: getResponsiveFontSize(17, 15),
  small: getResponsiveFontSize(15, 14),
};
