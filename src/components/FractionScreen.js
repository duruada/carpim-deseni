import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { colors, tabular } from '../theme';

const SLICE_COUNTS = [2, 3, 4, 6, 8, 12];
const R = 46;
const C = 50;

const WORDS = {
  2: 'yarım', 3: 'üçte', 4: 'dörtte', 6: 'altıda', 8: 'sekizde', 12: 'on ikide',
};

/** Bir dilimin yay yolu. */
function slicePath(index, total) {
  const a0 = (index / total) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((index + 1) / total) * Math.PI * 2 - Math.PI / 2;
  const x0 = C + R * Math.cos(a0);
  const y0 = C + R * Math.sin(a0);
  const x1 = C + R * Math.cos(a1);
  const y1 = C + R * Math.sin(a1);
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${C} ${C} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${big} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

function Pizza({ total, filled, onToggle, color, s }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 100 100">
      <G>
        {Array.from({ length: total }, (_, i) => (
          <Path
            key={i}
            d={slicePath(i, total)}
            fill={filled.includes(i) ? color : colors.card}
            stroke={colors.ink}
            strokeWidth={1.2}
            onPress={() => onToggle(i)}
          />
        ))}
        <Circle cx={C} cy={C} r={R} fill="none" stroke={colors.ink} strokeWidth={2} />
      </G>
    </Svg>
  );
}

function Half({ side, state, setState, color, s }) {
  const { total, filled } = state;

  const setTotal = (n) => {
    setState({ total: n, filled: [] });
    Haptics.selectionAsync().catch(() => {});
  };

  const toggle = (i) => {
    setState((st) => ({
      ...st,
      filled: st.filled.includes(i) ? st.filled.filter((x) => x !== i) : [...st.filled, i],
    }));
    Haptics.selectionAsync().catch(() => {});
  };

  return (
    <View style={[styles.half, { gap: s(7) }]}>
      <View style={[styles.chips, { gap: s(5) }]}>
        {SLICE_COUNTS.map((n) => {
          const on = n === total;
          return (
            <Pressable
              key={n}
              onPress={() => setTotal(n)}
              style={({ pressed }) => [
                styles.chip,
                {
                  width: s(28),
                  height: s(28),
                  borderRadius: s(14),
                  backgroundColor: on ? color : colors.card,
                  borderColor: on ? color : colors.line,
                },
                pressed && { transform: [{ scale: 0.9 }] },
              ]}
              accessibilityLabel={`${side} pizza ${n} dilim`}
            >
              <Text style={[styles.chipText, tabular, { fontSize: s(13), color: on ? '#fff' : colors.ink }]}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.pie}>
        <Pizza total={total} filled={filled} onToggle={toggle} color={color} s={s} />
      </View>

      <Text style={[styles.frac, tabular, { fontSize: s(24), color }]}>
        {filled.length}/{total}
      </Text>
      <Text style={[styles.fracWord, { fontSize: s(12) }]}>
        {filled.length === 0
          ? 'hiç dilim yok'
          : total === 2 && filled.length === 1
            ? 'yarım'
            : `${WORDS[total]} ${filled.length}`}
      </Text>
    </View>
  );
}

/**
 * İki pizza yan yana.
 *
 * Kesirlerde çocukların en çok takıldığı yer denklik: 2/4 ile 1/2'nin aynı
 * şey olduğu. Anlatarak öğretmek zor, yan yana görünce kendiliğinden
 * anlaşılıyor. O yüzden burada soru sorulmuyor, iki pizza veriliyor.
 */
export default function FractionScreen({ s }) {
  const [left, setLeft] = useState({ total: 2, filled: [0] });
  const [right, setRight] = useState({ total: 4, filled: [] });

  const setL = useCallback((v) => setLeft((p) => (typeof v === 'function' ? v(p) : v)), []);
  const setR = useCallback((v) => setRight((p) => (typeof v === 'function' ? v(p) : v)), []);

  const lv = left.filled.length / left.total;
  const rv = right.filled.length / right.total;
  const equal = left.filled.length > 0 && Math.abs(lv - rv) < 1e-9;

  const simple = (f, t) => {
    if (f === 0) return '0';
    const g = gcd(f, t);
    return `${f / g}/${t / g}`;
  };

  let verdict;
  if (equal) {
    verdict = `Eşit! ${left.filled.length}/${left.total} = ${right.filled.length}/${right.total}`;
    if (left.total !== right.total) verdict += `  (ikisi de ${simple(left.filled.length, left.total)})`;
  } else if (left.filled.length === 0 && right.filled.length === 0) {
    verdict = 'Dilimlere dokun, doldur.';
  } else {
    verdict = lv > rv ? 'Soldaki daha çok.' : 'Sağdaki daha çok.';
  }

  return (
    <View style={[styles.wrap, { gap: s(10) }]}>
      <View style={[styles.row, { gap: s(10) }]}>
        <Half side="sol" state={left} setState={setL} color="#B0562F" s={s} />
        <Half side="sağ" state={right} setState={setR} color="#2C5F8A" s={s} />
      </View>

      <View
        style={[
          styles.verdictBox,
          { borderRadius: s(10), padding: s(11) },
          equal && styles.verdictEqual,
        ]}
      >
        <Text
          style={[
            styles.verdict,
            tabular,
            { fontSize: s(16) },
            equal && { color: colors.factor[2] },
          ]}
        >
          {verdict}
        </Text>
        <Text style={[styles.hint, { fontSize: s(12), lineHeight: s(18) }]}>
          Dilim sayıları farklıyken de eşit olabilirler mi? Dene bakalım.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  row: { flex: 1, flexDirection: 'row', minHeight: 0 },
  half: { flex: 1, alignItems: 'center', minWidth: 0 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  chip: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  chipText: { fontWeight: '800' },
  pie: { flex: 1, width: '100%', minHeight: 0 },
  frac: { fontWeight: '800' },
  fracWord: { color: colors.inkSoft, fontWeight: '600' },
  verdictBox: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
  },
  verdictEqual: { borderColor: colors.factor[2], backgroundColor: colors.factorSoft[2] },
  verdict: { fontWeight: '800', color: colors.ink, textAlign: 'center' },
  hint: { color: colors.inkSoft, textAlign: 'center' },
});
