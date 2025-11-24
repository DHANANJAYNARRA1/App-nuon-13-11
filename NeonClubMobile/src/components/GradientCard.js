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
    - ctaColor?: string // custom color for button text
    - chevron?: boolean // renders a trailing arrow circle (for small tiles)
    - onPress?: () => void
    - height?: number
    - icon?: string // optional emoji/icon glyph rendered in a soft square
*/
export default function GradientCard({
  title,
  subtitle,
  colors = ['#3B82F6', '#06B6D4'],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  ctaLabel,
  ctaColor,
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
      <View style={styles.row}>
        {!hideTexts && (
          <>
            {icon ? (
              <View style={styles.iconBox}><Text style={styles.iconText}>{icon}</Text></View>
            ) : null}
            <View style={styles.texts}>
              <Text style={styles.title} numberOfLines={1}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text> : null}
              {ctaLabel ? (
                <View style={styles.ctaWrap}>
                  <Text style={[styles.ctaText, ctaColor && { color: ctaColor }]} numberOfLines={1}>{ctaLabel}</Text>
                </View>
              ) : null}
            </View>
          </>
        )}
        {!ctaLabel && chevron ? (
          <View style={styles.trailingCircle}>
            <Text style={styles.trailingArrow}>›</Text>
          </View>
        ) : null}
      </View>
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
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  gradient: {
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 16,
  },
  texts: {
    flex: 1,
    gap: 4,
    paddingRight: 4,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: { 
    fontSize: 32,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.90)',
    lineHeight: 18,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  ctaWrap: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A0A0A',
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
