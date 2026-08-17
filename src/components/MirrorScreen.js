import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import { colors } from '../theme';

const PALETTE = ['#2C5F8A', '#B3402F', '#2F7D55', '#7F5AB6', '#A5731A', '#2F2A24'];

/** Parmak bu kadar oynamadan yeni nokta eklenmiyor; yol dosyası şişmesin. */
const MIN_STEP = 2.5;
/** Bellek sınırı: bundan fazla çizgi tutulmuyor. */
const MAX_PATHS = 300;

const MODES = [
  { key: 2, label: 'İki ayna' },
  { key: 4, label: 'Dört ayna' },
];

/**
 * Simetri çizimi.
 *
 * Ada bir yarıya çiziyor, ayna öbür yarıyı tamamlıyor. Sınav yok, doğru
 * cevap yok — çıkan şey güzel oluyor ve simetri, eksen, yansıma sezgisi
 * kendiliğinden geliyor. Matematiği sevdiren şeylerden biri de üretmek.
 */
export default function MirrorScreen({ s }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState([]);
  const [current, setCurrent] = useState(null);
  const [color, setColor] = useState(PALETTE[0]);
  const [mode, setMode] = useState(4);

  // PanResponder bir kez kuruluyor, o yüzden değişkenler ref üzerinden okunuyor.
  const colorRef = useRef(color);
  const modeRef = useRef(mode);
  const lastRef = useRef(null);

  const pickColor = useCallback((c) => {
    setColor(c);
    colorRef.current = c;
  }, []);

  const pickMode = useCallback((m) => {
    setMode(m);
    modeRef.current = m;
  }, []);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          const { locationX: x, locationY: y } = e.nativeEvent;
          lastRef.current = [x, y];
          setCurrent({ pts: [[x, y]], color: colorRef.current, mode: modeRef.current });
        },
        onPanResponderMove: (e) => {
          const { locationX: x, locationY: y } = e.nativeEvent;
          const last = lastRef.current;
          if (last && Math.hypot(x - last[0], y - last[1]) < MIN_STEP) return;
          lastRef.current = [x, y];
          setCurrent((c) => (c ? { ...c, pts: [...c.pts, [x, y]] } : c));
        },
        onPanResponderRelease: () => {
          setCurrent((c) => {
            if (c && c.pts.length > 1) {
              setPaths((p) => [...p, c].slice(-MAX_PATHS));
            }
            return null;
          });
          lastRef.current = null;
        },
      }),
    []
  );

  const undo = useCallback(() => setPaths((p) => p.slice(0, -1)), []);
  const clear = useCallback(() => {
    setPaths([]);
    setCurrent(null);
  }, []);

  /** Bir çizginin kendisi ve aynadaki yansımaları. */
  const renderPath = (p, key) => {
    const { w, h } = size;
    if (!w || !h) return null;

    const d = p.pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const dv = p.pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${(w - x).toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const variants = [d, dv];

    if (p.mode === 4) {
      variants.push(
        p.pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${(h - y).toFixed(1)}`).join(' '),
        p.pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${(w - x).toFixed(1)} ${(h - y).toFixed(1)}`).join(' ')
      );
    }

    return variants.map((dd, i) => (
      <Path
        key={`${key}-${i}`}
        d={dd}
        stroke={p.color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={i === 0 ? 1 : 0.92}
      />
    ));
  };

  return (
    <View style={[styles.wrap, { gap: s(10) }]}>
      <View style={[styles.bar, { gap: s(7) }]}>
        {PALETTE.map((c) => (
          <Pressable
            key={c}
            onPress={() => pickColor(c)}
            style={({ pressed }) => [
              styles.swatch,
              {
                width: s(32),
                height: s(32),
                borderRadius: s(16),
                backgroundColor: c,
                borderWidth: c === color ? s(4) : 2,
                borderColor: c === color ? colors.ink : colors.line,
              },
              pressed && { transform: [{ scale: 0.9 }] },
            ]}
            accessibilityLabel="renk seç"
          />
        ))}
      </View>

      <View
        style={styles.canvas}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setSize({ w: width, h: height });
        }}
        {...responder.panHandlers}
      >
        {size.w > 0 && (
          <Svg width={size.w} height={size.h}>
            {/* ayna eksenleri */}
            <Line
              x1={size.w / 2}
              y1={0}
              x2={size.w / 2}
              y2={size.h}
              stroke={colors.line}
              strokeWidth={2}
              strokeDasharray="8 8"
            />
            {mode === 4 && (
              <Line
                x1={0}
                y1={size.h / 2}
                x2={size.w}
                y2={size.h / 2}
                stroke={colors.line}
                strokeWidth={2}
                strokeDasharray="8 8"
              />
            )}

            {paths.map((p, i) => renderPath(p, i))}
            {current && renderPath(current, 'cur')}
          </Svg>
        )}

        {paths.length === 0 && !current && (
          <View style={styles.empty} pointerEvents="none">
            <Text style={[styles.emptyText, { fontSize: s(15), lineHeight: s(22) }]}>
              Parmağınla çiz.{'\n'}Ayna gerisini halleder.
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.bar, { gap: s(8) }]}>
        {MODES.map((m) => {
          const on = m.key === mode;
          return (
            <Pressable
              key={m.key}
              onPress={() => pickMode(m.key)}
              style={({ pressed }) => [
                styles.modeBtn,
                {
                  borderRadius: s(20),
                  paddingVertical: s(9),
                  paddingHorizontal: s(14),
                  backgroundColor: on ? colors.ink : colors.card,
                  borderColor: on ? colors.ink : colors.line,
                },
                pressed && !on && { backgroundColor: colors.line },
              ]}
            >
              <Text style={[styles.modeText, { fontSize: s(13), color: on ? '#fff' : colors.inkSoft }]}>
                {m.label}
              </Text>
            </Pressable>
          );
        })}

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={undo}
          disabled={paths.length === 0}
          style={({ pressed }) => [
            styles.modeBtn,
            { borderRadius: s(20), paddingVertical: s(9), paddingHorizontal: s(14) },
            paths.length === 0 && { opacity: 0.4 },
            pressed && { backgroundColor: colors.line },
          ]}
        >
          <Text style={[styles.modeText, { fontSize: s(13), color: colors.inkSoft }]}>Geri al</Text>
        </Pressable>
        <Pressable
          onPress={clear}
          disabled={paths.length === 0}
          style={({ pressed }) => [
            styles.modeBtn,
            { borderRadius: s(20), paddingVertical: s(9), paddingHorizontal: s(14) },
            paths.length === 0 && { opacity: 0.4 },
            pressed && { backgroundColor: colors.line },
          ]}
        >
          <Text style={[styles.modeText, { fontSize: s(13), color: colors.factor[1] }]}>Temizle</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  swatch: {},
  canvas: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 12,
    overflow: 'hidden',
  },
  empty: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.line, textAlign: 'center', fontWeight: '700' },
  modeBtn: { borderWidth: 2, borderColor: colors.line, backgroundColor: colors.card },
  modeText: { fontWeight: '800' },
});
