import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors, tabular } from '../theme';
import { describeNumber } from '../math';
import { promptFor } from '../prompts';
import FactorChips, { MAX_SELECTED } from './FactorChips';

const NUMBERS = Array.from({ length: 100 }, (_, i) => i + 1);

export default function MultiplesScreen({ s }) {
  const [selected, setSelected] = useState([5]);
  const [tapped, setTapped] = useState(null);

  const toggle = useCallback((n) => {
    setTapped(null);
    setSelected((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= MAX_SELECTED) return prev;
      return [...prev, n];
    });
    Haptics.selectionAsync().catch(() => {});
  }, []);

  const tapCell = useCallback((n) => {
    setTapped((prev) => (prev === n ? null : n));
    Haptics.selectionAsync().catch(() => {});
  }, []);

  return (
    <View style={[styles.wrap, { gap: s(10) }]}>
      <FactorChips selected={selected} onToggle={toggle} s={s} />

      <View style={styles.chartBox}>
        <View style={[styles.chart, { borderRadius: s(10) }]}>
          {Array.from({ length: 10 }, (_, row) => (
            <View key={row} style={styles.row}>
              {NUMBERS.slice(row * 10, row * 10 + 10).map((n) => {
                const hits = selected.filter((f) => n % f === 0);
                let bg = colors.cell;
                let fg = colors.inkSoft;

                if (hits.length === 1) {
                  const i = selected.indexOf(hits[0]);
                  bg = colors.factorSoft[i];
                  fg = colors.factor[i];
                } else if (hits.length > 1) {
                  bg = colors.sharedSoft;
                  fg = colors.shared;
                }

                const isTapped = tapped === n;

                return (
                  <Pressable
                    key={n}
                    onPress={() => tapCell(n)}
                    style={[
                      styles.cell,
                      { backgroundColor: bg },
                      isTapped && { borderColor: colors.ink, borderWidth: s(2) },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={String(n)}
                  >
                    <Text
                      style={[
                        styles.num,
                        tabular,
                        {
                          fontSize: s(14),
                          color: fg,
                          fontWeight: hits.length ? '800' : '500',
                        },
                      ]}
                    >
                      {n}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.promptBox, { minHeight: s(46), borderRadius: s(10), padding: s(10) }]}>
        <Text
          style={[
            styles.prompt,
            tabular,
            { fontSize: s(15), lineHeight: s(21) },
            tapped != null && { color: colors.ink, fontWeight: '700' },
          ]}
        >
          {tapped != null ? describeNumber(tapped) : promptFor(selected)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  // Tablo kare kalsın: kısa kenar neyse ona göre daralır.
  chartBox: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 0 },
  chart: {
    aspectRatio: 1,
    maxWidth: '100%',
    maxHeight: '100%',
    borderWidth: 2,
    borderColor: colors.line,
    overflow: 'hidden',
    backgroundColor: colors.line,
  },
  row: { flex: 1, flexDirection: 'row' },
  cell: {
    flex: 1,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  num: { includeFontPadding: false },
  promptBox: {
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
  },
  prompt: { textAlign: 'center', color: colors.inkSoft, fontWeight: '600' },
});
