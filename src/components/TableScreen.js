import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors, tabular } from '../theme';
import { areaPrompt } from '../prompts';

const N = 10;
const AXIS = Array.from({ length: N }, (_, i) => i + 1);

/**
 * Çarpım tablosu, alan modeliyle.
 *
 * Bir hücreye dokununca (1,1)'den o hücreye kadarki dikdörtgen boyanıyor.
 * Boyalı hücre sayısı zaten çarpımın kendisi: çocuk "6×7=42" ezberlemek
 * yerine 42 kutu sayabiliyor. Ayna hücre (7×6) de işaretleniyor, çarpmanın
 * yer değiştirme özelliği kendiliğinden görünür oluyor.
 */
export default function TableScreen({ s }) {
  const [sel, setSel] = useState({ a: 6, b: 7 });

  const tap = useCallback((a, b) => {
    setSel((prev) => (prev && prev.a === a && prev.b === b ? null : { a, b }));
    Haptics.selectionAsync().catch(() => {});
  }, []);

  const head = (text, on, key) => (
    <View key={key} style={[styles.cell, styles.header, on && styles.headerOn]}>
      <Text
        style={[
          styles.headText,
          tabular,
          { fontSize: s(13), color: on ? '#FFFFFF' : colors.inkSoft },
        ]}
      >
        {text}
      </Text>
    </View>
  );

  return (
    <View style={[styles.wrap, { gap: s(10) }]}>
      <View style={styles.tableBox}>
        <View style={[styles.table, { borderRadius: s(10) }]}>
          <View style={styles.row}>
            {head('×', false, 'corner')}
            {AXIS.map((c) => head(c, sel?.b === c, `c${c}`))}
          </View>

          {AXIS.map((r) => (
            <View key={r} style={styles.row}>
              {head(r, sel?.a === r, `r${r}`)}
              {AXIS.map((c) => {
                const inRect = sel && r <= sel.a && c <= sel.b;
                const isSel = sel && r === sel.a && c === sel.b;
                const isMirror = sel && r === sel.b && c === sel.a && !isSel;

                return (
                  <Pressable
                    key={c}
                    onPress={() => tap(r, c)}
                    style={[
                      styles.cell,
                      { backgroundColor: inRect ? colors.factorSoft[0] : colors.cell },
                      isMirror && {
                        backgroundColor: colors.sharedSoft,
                        borderColor: colors.shared,
                        borderWidth: s(2),
                      },
                      isSel && { backgroundColor: colors.factor[0] },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`${r} çarpı ${c} eşittir ${r * c}`}
                  >
                    <Text
                      style={[
                        styles.num,
                        tabular,
                        {
                          fontSize: s(13),
                          color: isSel
                            ? '#FFFFFF'
                            : isMirror
                              ? colors.shared
                              : inRect
                                ? colors.factor[0]
                                : colors.inkSoft,
                          fontWeight: inRect || isMirror ? '800' : '500',
                        },
                      ]}
                    >
                      {r * c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.promptBox, { minHeight: s(64), borderRadius: s(10), padding: s(10) }]}>
        {sel ? (
          <>
            <Text style={[styles.eq, tabular, { fontSize: s(22) }]}>
              {sel.a} × {sel.b} = {sel.a * sel.b}
            </Text>
            <Text style={[styles.hint, { fontSize: s(14), lineHeight: s(20) }]}>
              {areaPrompt(sel.a, sel.b)}
            </Text>
          </>
        ) : (
          <Text style={[styles.hint, { fontSize: s(15), lineHeight: s(21) }]}>
            Bir kutuya dokun, dikdörtgeni boyayayım.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  tableBox: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 0 },
  table: {
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
  header: { backgroundColor: colors.paper },
  headerOn: { backgroundColor: colors.ink },
  headText: { fontWeight: '800', includeFontPadding: false },
  num: { includeFontPadding: false },
  promptBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
  },
  eq: { fontWeight: '800', color: colors.ink },
  hint: { textAlign: 'center', color: colors.inkSoft, fontWeight: '600' },
});
