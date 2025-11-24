import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { palette, radius, shadow, spacing, typography } from '../theme/tokens';

/*
  GradientCard
  - Props:
    - title: string
    - subtitle?: string
    - colors: [string, string]
    - start?: {x:number,y:number}
    - end?: {x:number,y:number}
    - ctaLabel?: string
    - chevron?: boolean // renders a trailing arrow circle (for small tiles)
    - onPress?: () => void
    - height?: number
    - icon?: string // optional emoji/icon glyph rendered in a soft square
    - stacked?: boolean // when true, stacks text and centers CTA below
*/
export default function GradientCard({
  title,
  subtitle,
  colors = ['#3B82F6', '#06B6D4'],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  ctaLabel,
  chevron = false,
  onPress,
  height = 120,
  // New props for layout tweaks
  centerCTA = false, // centers CTA button and hides trailing chevron
  hideTexts = false, // hides title/subtitle block
  icon,
  stacked = false,
}) {
  const content = (
    <LinearGradient colors={colors} start={start} end={end} style={[styles.gradient, { minHeight: height }]}> 
      {!stacked ? (
        <View style={[styles.row, centerCTA && styles.rowCenter]}>
          {!hideTexts && (
            <View style={styles.texts}>
              {icon ? (
                <View style={styles.iconBox}><Text style={styles.iconText}>{icon}</Text></View>
              ) : null}
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          )}
          {ctaLabel ? (
            <View style={[styles.ctaWrap, centerCTA && styles.ctaCentered]}>
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </View>
          ) : (!centerCTA && chevron) ? (
            <View style={styles.trailingCircle}>
              <Text style={styles.trailingArrow}>›</Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.stackedWrap}>
          {!hideTexts && (
            <View style={[styles.texts, { alignItems: 'center' }]}>
              {icon ? (
                <View style={[styles.iconBox, { marginBottom: 10 }]}><Text style={styles.iconText}>{icon}</Text></View>
              ) : null}
              <Text style={[styles.title, { textAlign: 'center' }]}>{title}</Text>
              {subtitle ? <Text style={[styles.subtitle, { textAlign: 'center' }]}>{subtitle}</Text> : null}
            </View>
          )}
          {ctaLabel ? (
            <View style={[styles.ctaWrap, styles.ctaCentered, { marginTop: 14 }]}>
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </View>
          ) : null}
        </View>
      )}
    </LinearGradient>
  );

  return (
    <View style={styles.wrapper}>
      {onPress ? (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ borderRadius: radius.lg }}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    ...shadow.soft,
  },
  gradient: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowCenter: { justifyContent: 'center' },
  stackedWrap: { alignItems: 'center' },
  texts: {
    gap: 6,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18, color: '#fff' },
  title: {
    ...typography.title,
    color: '#FFFFFF',
    fontSize: 18,
  },
  subtitle: {
    ...typography.subtitle,
    color: '#F3F4F6',
  },
  ctaWrap: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  ctaCentered: {
    alignSelf: 'center',
  },
  ctaText: {
    ...typography.button,
    color: palette.textPrimary || '#0A0A0A',
  },
  trailingCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailingArrow: { color: '#fff', fontSize: 24, lineHeight: 24, marginTop: -2 },
});
