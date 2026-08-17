import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, tabular } from '../theme';

export const FACTORS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const MAX_SELECTED = 3;

/**
 * Çarpan seçicileri. Aynı anda en fazla üç tane seçilebilir; daha fazlası
 * tabloyu okunmaz hale getiriyor.
 */
export default function FactorChips({ selected, onToggle, s }) {
  return (
    <View style={[styles.row, { gap: s(7) }]}>
      {FACTORS.map((n) => {
        const idx = selected.indexOf(n);
        const on = idx >= 0;
        const full = selected.length >= MAX_SELECTED && !on;

        return (
          <Pressable
            key={n}
            onPress={() => onToggle(n)}
            style={({ pressed }) => [
              styles.chip,
              {
                width: s(40),
                height: s(40),
                borderRadius: s(20),
                borderColor: on ? colors.factor[idx] : colors.line,
                backgroundColor: on ? colors.factor[idx] : colors.card,
              },
              full && styles.chipFull,
              pressed && { transform: [{ scale: 0.93 }] },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${n} çarpanı`}
          >
            <Text
              style={[
                styles.label,
                tabular,
                { fontSize: s(18), color: on ? '#FFFFFF' : colors.ink },
              ]}
            >
              {n}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  chip: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  chipFull: { opacity: 0.35 },
  label: { fontWeight: '800' },
});
