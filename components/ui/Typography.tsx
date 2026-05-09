import React from 'react';
import { Text, TextStyle, useColorScheme } from 'react-native';
import { Colors, Typography as T } from '../../constants/theme';

type Variant = keyof typeof T;

interface TypographyProps {
  variant?: Variant;
  color?: string;
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
}

export function Txt({ variant = 'bodyMedium', color, style, children, numberOfLines }: TypographyProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  return (
    <Text
      style={[T[variant], { color: color ?? C.text }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}
