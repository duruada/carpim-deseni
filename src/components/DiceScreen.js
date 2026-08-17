import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { colors, tabular } from '../theme';

const SUMS = Array.from({ length: 11 }, (_, i) => i + 2); // 2..12
const ACCENT = '#6B6F2F';

/** Zar yüzündeki noktaların yerleşimi. */
const PIPS = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]],
  5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]],
};

function Die({ value, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Rect x={1.5} y={1.5} width={27} height={27} rx={5} fill={colors.card} stroke={colors.ink} strokeWidth={2} />
      {(PIPS[value] ?? []).map(([cx, cy], i) => (
        <Circle key={i} cx={7.5 + cx * 7.5} cy={7.5 + cy * 7.5} r={2.6} fill={colors.ink} />
      ))}
    </Svg>
  );
}

const roll = () => 1 + Math.floor(Math.random() * 6);

/**
 * İki zar, çok atış, biriken histogram.
 *
 * Çocuk önce bir toplam seçiyor, sonra atışlar biriktikçe çan eğrisi
 * kendiliğinden çıkıyor. 7'nin neden kazandığı anlatılmıyor — 7'yi veren
 * altı farklı zar çifti var, 2'yi veren bir tane; bu, sütunlara bakarak
 * fark edilecek bir şey.
 */
export default function DiceScreen({ s }) {
  const [counts, setCounts] = useState(() => Object.fromEntries(SUMS.map((n) => [n, 0])));
  const [dice, setDice] = useState([1, 1]);
  const [bet, setBet] = useState(null);
  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);
  const busy = useRef(false);

  const throwMany = useCallback((n) => {
    if (busy.current) return;
    busy.current = true;
    setCounts((c) => {
      const next = { ...c };
      let last = [1, 1];
      for (let i = 0; i < n; i += 1) {
        last = [roll(), roll()];
        next[last[0] + last[1]] += 1;
      }
      setDice(last);
      return next;
    });
    Haptics.selectionAsync().catch(() => {});
    busy.current = false;
  }, []);

  const reset = useCallback(() => {
    setCounts(Object.fromEntries(SUMS.map((n) => [n, 0])));
    setBet(null);
    setDice([1, 1]);
  }, []);

  const max = Math.max(1, ...SUMS.map((n) => counts[n]));
  const leader = total > 0 ? SUMS.reduce((a, b) => (counts[b] > counts[a] ? b : a), 2) : null;

  return (
    <View style={[styles.wrap, { gap: s(10) }]}>
      <View style={[styles.top, { gap: s(12), padding: s(10), borderRadius: s(10) }]}>
        <Die value={dice[0]} size={s(44)} />
        <Die value={dice[1]} size={s(44)} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.sum, tabular, { fontSize: s(20) }]}>
            {total > 0 ? `toplam ${dice[0] + dice[1]}` : 'zar at'}
          </Text>
          <Text style={[styles.hint, { fontSize: s(12) }]}>
            {total > 0 ? `${total} atış yapıldı` : 'önce bir toplam seç'}
          </Text>
        </View>
      </View>

      {/* histogram */}
      <View style={styles.chartBox}>
        <View style={[styles.chart, { gap: s(3) }]}>
          {SUMS.map((n) => {
            const c = counts[n];
            const h = (c / max) * 100;
            const mine = bet === n;
            const top = total > 0 && n === leader;
            return (
              <Pressable
                key={n}
                onPress={() => {
                  setBet(n);
                  Haptics.selectionAsync().catch(() => {});
                }}
                style={styles.col}
                accessibilityLabel={`toplam ${n}`}
              >
                <Text style={[styles.count, tabular, { fontSize: s(10) }]}>{c || ''}</Text>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${h}%`,
                        backgroundColor: mine ? ACCENT : top ? colors.factor[0] : colors.line,
                        borderRadius: s(3),
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.axis,
                    tabular,
                    { fontSize: s(12) },
                    mine && { color: ACCENT, fontWeight: '800' },
                  ]}
                >
                  {n}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.note, { borderRadius: s(10), padding: s(10) }]}>
        <Text style={[styles.noteText, { fontSize: s(13), lineHeight: s(19) }]}>
          {bet === null
            ? 'Sence hangi toplam en çok çıkar? Bir sütuna dokunup seç.'
            : total < 30
              ? `${bet} dedin. Şimdi at bakalım — az atışta belli olmaz.`
              : bet === leader
                ? `${bet} önde gidiyor. Neden acaba? Kaç farklı zar çifti ${bet} yapar?`
                : `Önde giden ${leader}, senin seçtiğin ${bet}. Kaç farklı zar çifti ${leader} yapar, kaç tanesi ${bet}?`}
        </Text>
      </View>

      <View style={[styles.actions, { gap: s(8) }]}>
        {[1, 10, 100].map((n) => (
          <Pressable
            key={n}
            onPress={() => throwMany(n)}
            style={({ pressed }) => [
              styles.btn,
              styles.btnMain,
              { borderRadius: s(22), paddingVertical: s(12) },
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={[styles.btnText, { fontSize: s(15) }]}>{n === 1 ? 'At' : `${n} at`}</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={reset}
          disabled={total === 0}
          style={({ pressed }) => [
            styles.btn,
            styles.btnGhost,
            { borderRadius: s(22), paddingVertical: s(12) },
            total === 0 && { opacity: 0.4 },
            pressed && { backgroundColor: colors.line },
          ]}
        >
          <Text style={[styles.btnText, { fontSize: s(15), color: colors.inkSoft }]}>Sıfırla</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
  },
  sum: { fontWeight: '800', color: colors.ink },
  hint: { color: colors.inkSoft },
  chartBox: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 8,
  },
  chart: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  col: { flex: 1, alignItems: 'center' },
  count: { color: colors.inkSoft, fontWeight: '700', height: 14 },
  track: { flex: 1, width: '70%', justifyContent: 'flex-end' },
  bar: { width: '100%' },
  axis: { color: colors.inkSoft, fontWeight: '700', marginTop: 3 },
  note: { backgroundColor: colors.card, borderWidth: 2, borderColor: colors.line },
  noteText: { color: colors.inkSoft, textAlign: 'center', fontWeight: '600' },
  actions: { flexDirection: 'row' },
  btn: { flex: 1, alignItems: 'center', borderWidth: 2 },
  btnMain: { backgroundColor: ACCENT, borderColor: ACCENT },
  btnGhost: { backgroundColor: colors.card, borderColor: colors.line },
  btnText: { fontWeight: '800', color: '#FFFFFF' },
});
