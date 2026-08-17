import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors, tabular } from '../theme';

/** Fiyatlar bilerek küçük ve yuvarlak: hesap zihinden yapılabilsin. */
const SHELF = [
  { key: 'elma', name: 'Elma', price: 4 },
  { key: 'ekmek', name: 'Ekmek', price: 7 },
  { key: 'sut', name: 'Süt', price: 9 },
  { key: 'yumurta', name: 'Yumurta', price: 6 },
  { key: 'peynir', name: 'Peynir', price: 8 },
  { key: 'cikolata', name: 'Çikolata', price: 3 },
];

const BUDGET = 60;

/**
 * Matematiği araç haline getiren oyun.
 *
 * Toplamı uygulama hesaplamıyor: sepete ne koyacağına Ada karar veriyor,
 * tutarı da kendi buluyor. Sayı sayması gereken şey "3 × 4" değil,
 * "üç elma kaç lira" — aynı işlem ama gerçek bir amaca bağlı.
 */
export default function MarketScreen({ s }) {
  const [cart, setCart] = useState({});
  const [guess, setGuess] = useState('');
  const [checked, setChecked] = useState(null); // { ok, total }

  const lines = useMemo(
    () =>
      SHELF.filter((i) => (cart[i.key] ?? 0) > 0).map((i) => ({
        ...i,
        qty: cart[i.key],
        sum: cart[i.key] * i.price,
      })),
    [cart]
  );

  const total = useMemo(() => lines.reduce((t, l) => t + l.sum, 0), [lines]);

  const change = useCallback((key, delta) => {
    setChecked(null);
    setGuess('');
    setCart((c) => {
      const next = Math.max(0, Math.min(9, (c[key] ?? 0) + delta));
      const copy = { ...c };
      if (next === 0) delete copy[key];
      else copy[key] = next;
      return copy;
    });
    Haptics.selectionAsync().catch(() => {});
  }, []);

  const check = useCallback(() => {
    const g = Number(guess);
    if (!guess || Number.isNaN(g)) return;
    const ok = g === total;
    setChecked({ ok, total });
    Haptics.notificationAsync(
      ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
    ).catch(() => {});
  }, [guess, total]);

  const reset = useCallback(() => {
    setCart({});
    setGuess('');
    setChecked(null);
  }, []);

  const overBudget = checked && checked.total > BUDGET;

  return (
    <View style={[styles.wrap, { gap: s(10) }]}>
      <View style={[styles.budget, { borderRadius: s(10), padding: s(10) }]}>
        <Text style={[styles.budgetText, tabular, { fontSize: s(15) }]}>
          Bütçen: <Text style={styles.budgetNum}>{BUDGET} ₺</Text>
        </Text>
        <Text style={[styles.hint, { fontSize: s(12) }]}>
          İstediğini sepete at, sonra tutarı sen hesapla.
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: s(7) }} showsVerticalScrollIndicator={false}>
        {SHELF.map((item) => {
          const qty = cart[item.key] ?? 0;
          return (
            <View
              key={item.key}
              style={[styles.row, { borderRadius: s(10), padding: s(9) }, qty > 0 && styles.rowOn]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { fontSize: s(16) }]}>{item.name}</Text>
                <Text style={[styles.price, tabular, { fontSize: s(13) }]}>{item.price} ₺</Text>
              </View>

              {qty > 0 && (
                <Text style={[styles.lineSum, tabular, { fontSize: s(14), marginRight: s(8) }]}>
                  {qty} × {item.price}
                </Text>
              )}

              <Pressable
                onPress={() => change(item.key, -1)}
                disabled={qty === 0}
                style={({ pressed }) => [
                  styles.stepBtn,
                  { width: s(36), height: s(36), borderRadius: s(18) },
                  qty === 0 && { opacity: 0.3 },
                  pressed && { backgroundColor: colors.line },
                ]}
                accessibilityLabel={`${item.name} azalt`}
              >
                <Text style={[styles.stepText, { fontSize: s(19) }]}>−</Text>
              </Pressable>

              <Text style={[styles.qty, tabular, { fontSize: s(17), width: s(28) }]}>{qty}</Text>

              <Pressable
                onPress={() => change(item.key, 1)}
                style={({ pressed }) => [
                  styles.stepBtn,
                  styles.stepAdd,
                  { width: s(36), height: s(36), borderRadius: s(18) },
                  pressed && { transform: [{ scale: 0.92 }] },
                ]}
                accessibilityLabel={`${item.name} ekle`}
              >
                <Text style={[styles.stepText, styles.stepAddText, { fontSize: s(19) }]}>+</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.kasa, { borderRadius: s(10), padding: s(11), gap: s(8) }]}>
        {lines.length === 0 ? (
          <Text style={[styles.hint, { fontSize: s(14) }]}>Sepetin boş.</Text>
        ) : (
          <>
            <Text style={[styles.cartLine, tabular, { fontSize: s(14), lineHeight: s(20) }]}>
              {lines.map((l) => `${l.qty}×${l.price}`).join('  +  ')}
            </Text>

            {!checked ? (
              <View style={[styles.checkRow, { gap: s(8) }]}>
                <TextInput
                  value={guess}
                  onChangeText={(t) => setGuess(t.replace(/[^0-9]/g, '').slice(0, 4))}
                  placeholder="tutar"
                  placeholderTextColor={colors.line}
                  keyboardType="number-pad"
                  style={[
                    styles.input,
                    tabular,
                    { fontSize: s(20), height: s(46), borderRadius: s(10) },
                  ]}
                />
                <Pressable
                  onPress={check}
                  disabled={!guess}
                  style={({ pressed }) => [
                    styles.payBtn,
                    { borderRadius: s(10), paddingHorizontal: s(18), height: s(46) },
                    !guess && { opacity: 0.4 },
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <Text style={[styles.payText, { fontSize: s(16) }]}>Kasaya git</Text>
                </Pressable>
              </View>
            ) : (
              <View style={{ gap: s(6) }}>
                <Text
                  style={[
                    styles.verdict,
                    tabular,
                    { fontSize: s(17) },
                    checked.ok ? styles.ok : styles.no,
                  ]}
                >
                  {checked.ok
                    ? `Doğru, tutar ${checked.total} ₺.`
                    : `Tutar ${checked.total} ₺ idi.`}
                </Text>
                <Text style={[styles.hint, { fontSize: s(13), lineHeight: s(19) }]}>
                  {overBudget
                    ? `Bütçen ${BUDGET} ₺ ama sepet ${checked.total} ₺. ${checked.total - BUDGET} ₺ fazla — neyi çıkarırsın?`
                    : `Bütçenden ${BUDGET - checked.total} ₺ arttı.`}
                </Text>
                <Pressable onPress={reset} hitSlop={8}>
                  <Text style={[styles.again, { fontSize: s(15) }]}>Yeni alışveriş</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  budget: { backgroundColor: colors.card, borderWidth: 2, borderColor: colors.line, alignItems: 'center', gap: 2 },
  budgetText: { color: colors.inkSoft, fontWeight: '700' },
  budgetNum: { color: colors.ink, fontWeight: '800' },
  hint: { color: colors.inkSoft, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
  },
  rowOn: { borderColor: colors.factor[0] },
  name: { fontWeight: '700', color: colors.ink },
  price: { color: colors.inkSoft },
  lineSum: { color: colors.factor[0], fontWeight: '800' },
  stepBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  stepAdd: { backgroundColor: colors.factor[0], borderColor: colors.factor[0] },
  stepText: { fontWeight: '800', color: colors.ink, lineHeight: undefined },
  stepAddText: { color: '#FFFFFF' },
  qty: { textAlign: 'center', fontWeight: '800', color: colors.ink },
  kasa: { backgroundColor: colors.card, borderWidth: 2, borderColor: colors.line },
  cartLine: { textAlign: 'center', color: colors.ink, fontWeight: '700' },
  checkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    maxWidth: 160,
    textAlign: 'center',
    fontWeight: '800',
    color: colors.ink,
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderColor: colors.line,
  },
  payBtn: { justifyContent: 'center', backgroundColor: colors.factor[0] },
  payText: { color: '#FFFFFF', fontWeight: '800' },
  verdict: { textAlign: 'center', fontWeight: '800' },
  ok: { color: colors.factor[2] },
  no: { color: colors.factor[1] },
  again: { color: colors.factor[0], fontWeight: '800', textAlign: 'center' },
});
