import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { colors, tabular } from '../theme';

const MAX = 100;
const X0 = 40;
const X1 = 960;
const Y = 150;
const STEPS = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const xFor = (n) => X0 + (n / MAX) * (X1 - X0);

/**
 * Çarpma = tekrarlı zıplama.
 *
 * Ada zıpladıkça yay yay ilerliyor ve "5 zıplama × 7 = 35" kendiliğinden
 * oluşuyor. Sayı doğrusu hep 0-100 olduğu için sonucun 100'e göre nerede
 * durduğu da görünüyor — sayı hissi bunu ezberle veremiyor.
 */
export default function NumberLineScreen({ s }) {
  const [step, setStep] = useState(7);
  const [jumps, setJumps] = useState(0);

  const maxJumps = Math.floor(MAX / step);
  const pos = jumps * step;

  const jump = useCallback(() => {
    setJumps((j) => Math.min(maxJumps, j + 1));
    Haptics.selectionAsync().catch(() => {});
  }, [maxJumps]);

  const back = useCallback(() => setJumps((j) => Math.max(0, j - 1)), []);

  const pickStep = useCallback((n) => {
    setStep(n);
    setJumps(0);
    Haptics.selectionAsync().catch(() => {});
  }, []);

  const arcs = [];
  for (let i = 0; i < jumps; i += 1) {
    const a = xFor(i * step);
    const b = xFor((i + 1) * step);
    const h = Math.min(70, 22 + (b - a) * 0.55);
    arcs.push(
      <Path
        key={i}
        d={`M ${a} ${Y} Q ${(a + b) / 2} ${Y - h} ${b} ${Y}`}
        stroke={colors.factor[0]}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    );
  }

  return (
    <View style={[styles.wrap, { gap: s(10) }]}>
      <View style={[styles.chips, { gap: s(7) }]}>
        {STEPS.map((n) => {
          const on = n === step;
          return (
            <Pressable
              key={n}
              onPress={() => pickStep(n)}
              style={({ pressed }) => [
                styles.chip,
                {
                  width: s(38),
                  height: s(38),
                  borderRadius: s(19),
                  backgroundColor: on ? colors.factor[0] : colors.card,
                  borderColor: on ? colors.factor[0] : colors.line,
                },
                pressed && { transform: [{ scale: 0.93 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${n} adım`}
            >
              <Text style={[styles.chipText, tabular, { fontSize: s(17), color: on ? '#fff' : colors.ink }]}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.board}>
        <Svg width="100%" height="100%" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid meet">
          {/* doğru */}
          <Line x1={X0} y1={Y} x2={X1} y2={Y} stroke={colors.ink} strokeWidth={3} strokeLinecap="round" />

          {/* çentikler */}
          <G>
            {Array.from({ length: MAX + 1 }, (_, n) => {
              const big = n % 10 === 0;
              const mid = n % 5 === 0;
              if (!big && !mid && MAX > 50) {
                return (
                  <Line
                    key={n}
                    x1={xFor(n)}
                    y1={Y - 4}
                    x2={xFor(n)}
                    y2={Y + 4}
                    stroke={colors.line}
                    strokeWidth={1.5}
                  />
                );
              }
              return (
                <G key={n}>
                  <Line
                    x1={xFor(n)}
                    y1={Y - (big ? 12 : 8)}
                    x2={xFor(n)}
                    y2={Y + (big ? 12 : 8)}
                    stroke={big ? colors.ink : colors.inkSoft}
                    strokeWidth={big ? 3 : 2}
                  />
                  {big && (
                    <SvgText
                      x={xFor(n)}
                      y={Y + 34}
                      fontSize={17}
                      fontWeight="700"
                      fill={colors.inkSoft}
                      textAnchor="middle"
                    >
                      {n}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </G>

          {arcs}

          {/* bulunduğu konum */}
          <Circle cx={xFor(pos)} cy={Y} r={11} fill={colors.factor[0]} />
          {jumps > 0 && (
            <SvgText
              x={xFor(pos)}
              y={Y - 24}
              fontSize={26}
              fontWeight="800"
              fill={colors.factor[0]}
              textAnchor="middle"
            >
              {pos}
            </SvgText>
          )}
        </Svg>
      </View>

      <View style={[styles.readout, { borderRadius: s(10), padding: s(11) }]}>
        <Text style={[styles.eq, tabular, { fontSize: s(22) }]}>
          {jumps === 0
            ? `${step} adımlık zıplamalar`
            : `${jumps} zıplama × ${step} = ${pos}`}
        </Text>
        <Text style={[styles.hint, { fontSize: s(13), lineHeight: s(19) }]}>
          {jumps === 0
            ? 'Zıpla düğmesine bas. Her zıplama aynı boyda.'
            : jumps === maxJumps
              ? `${step}'in katlarıyla ${pos}'e geldin. Bir daha zıplasan 100'ü geçerdin.`
              : 'Kaç zıplamada 100’e yaklaşırsın? Önce tahmin et, sonra zıpla.'}
        </Text>
      </View>

      <View style={[styles.actions, { gap: s(10) }]}>
        <Pressable
          onPress={back}
          disabled={jumps === 0}
          style={({ pressed }) => [
            styles.btn,
            styles.btnGhost,
            { borderRadius: s(24), paddingVertical: s(12) },
            jumps === 0 && { opacity: 0.4 },
            pressed && { backgroundColor: colors.line },
          ]}
        >
          <Text style={[styles.btnGhostText, { fontSize: s(15) }]}>Geri</Text>
        </Pressable>
        <Pressable
          onPress={jump}
          disabled={jumps >= maxJumps}
          style={({ pressed }) => [
            styles.btn,
            styles.btnMain,
            { borderRadius: s(24), paddingVertical: s(12), flex: 2 },
            jumps >= maxJumps && { opacity: 0.4 },
            pressed && { transform: [{ scale: 0.97 }] },
          ]}
        >
          <Text style={[styles.btnMainText, { fontSize: s(17) }]}>Zıpla</Text>
        </Pressable>
        <Pressable
          onPress={() => setJumps(0)}
          style={({ pressed }) => [
            styles.btn,
            styles.btnGhost,
            { borderRadius: s(24), paddingVertical: s(12) },
            pressed && { backgroundColor: colors.line },
          ]}
        >
          <Text style={[styles.btnGhostText, { fontSize: s(15) }]}>Sıfırla</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  chip: { alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  chipText: { fontWeight: '800' },
  board: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  readout: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    gap: 4,
  },
  eq: { fontWeight: '800', color: colors.ink },
  hint: { color: colors.inkSoft, textAlign: 'center' },
  actions: { flexDirection: 'row' },
  btn: { flex: 1, alignItems: 'center', borderWidth: 2 },
  btnGhost: { backgroundColor: colors.card, borderColor: colors.line },
  btnGhostText: { fontWeight: '800', color: colors.inkSoft },
  btnMain: { backgroundColor: colors.factor[0], borderColor: colors.factor[0] },
  btnMainText: { fontWeight: '800', color: '#FFFFFF' },
});
