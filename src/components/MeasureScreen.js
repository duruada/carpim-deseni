import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { colors, tabular } from '../theme';

/** Fikir versin diye; zorunlu değil, Ada başka bir şey de seçebilir. */
const IDEAS = [
  'bir kalem', 'kitabın uzun kenarı', 'ayakkabın', 'kaşık', 'telefonun',
  'kapı kolunun yüksekliği', 'bir çatal', 'bardağın boyu', 'silgin',
  'masanın kenarı', 'elinin boyu', 'bir defter',
];

/** Tahmin ne kadar yakınsa o kadar iyi. Eşikler santimetre cinsinden. */
function judge(diff) {
  if (diff === 0) return { text: 'Tam isabet!', tone: 'great' };
  if (diff <= 1) return { text: '1 cm fark — neredeyse tam.', tone: 'great' };
  if (diff <= 3) return { text: `${diff} cm fark — çok iyi tahmin.`, tone: 'good' };
  if (diff <= 7) return { text: `${diff} cm fark — fena değil.`, tone: 'ok' };
  return { text: `${diff} cm fark. Bir dahakine daha yakın olur.`, tone: 'far' };
}

/**
 * Tahmin et, sonra ölç.
 *
 * Uygulama ölçmüyor — ekran kalibrasyonu güvenilir olmadığı için zaten
 * ölçemez. Bunu kusur değil özellik yaptım: Ada gerçek bir cetvel alıp
 * evde dolaşıyor, tablet sadece hedefi veriyor ve farkı tutuyor.
 * Tahmin becerisi sayı hissinin en doğrudan ölçüsü.
 */
export default function MeasureScreen({ s }) {
  const [what, setWhat] = useState('');
  const [guess, setGuess] = useState('');
  const [actual, setActual] = useState('');
  const [rounds, setRounds] = useState([]);
  const [idea, setIdea] = useState(() => IDEAS[Math.floor(Math.random() * IDEAS.length)]);

  const step = !guess ? 'guess' : !actual ? 'measure' : 'done';
  const canFinish = guess && actual;

  const finish = useCallback(() => {
    const g = Number(guess);
    const a = Number(actual);
    if (!g || !a) return;
    const diff = Math.abs(g - a);
    setRounds((r) => [{ what: what.trim() || idea, guess: g, actual: a, diff }, ...r].slice(0, 12));
    Haptics.notificationAsync(
      diff <= 3
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    ).catch(() => {});
    setWhat('');
    setGuess('');
    setActual('');
    setIdea(IDEAS[Math.floor(Math.random() * IDEAS.length)]);
  }, [guess, actual, what, idea]);

  const num = (v, setV) => (t) => setV(t.replace(/[^0-9]/g, '').slice(0, 3));

  const best = rounds.length
    ? rounds.reduce((b, r) => Math.min(b, r.diff), Infinity)
    : null;

  return (
    <View style={[styles.wrap, { gap: s(10) }]}>
      <View style={[styles.card, { borderRadius: s(10), padding: s(12), gap: s(9) }]}>
        <Text style={[styles.lead, { fontSize: s(14), lineHeight: s(20) }]}>
          Bir şey seç, kaç santim olduğunu <Text style={styles.strong}>tahmin et</Text>,
          sonra cetvelle ölç.
        </Text>

        <TextInput
          value={what}
          onChangeText={setWhat}
          placeholder={`ne ölçüyorsun? (örnek: ${idea})`}
          placeholderTextColor={colors.line}
          style={[styles.input, { fontSize: s(15), height: s(44), borderRadius: s(9) }]}
        />

        <View style={[styles.pair, { gap: s(8) }]}>
          <View style={{ flex: 1, gap: s(4) }}>
            <Text style={[styles.label, { fontSize: s(11) }]}>tahminin (cm)</Text>
            <TextInput
              value={guess}
              onChangeText={num(guess, setGuess)}
              keyboardType="number-pad"
              placeholder="?"
              placeholderTextColor={colors.line}
              style={[
                styles.input,
                tabular,
                styles.numInput,
                { fontSize: s(22), height: s(50), borderRadius: s(9) },
                step === 'guess' && styles.inputActive,
              ]}
            />
          </View>
          <View style={{ flex: 1, gap: s(4) }}>
            <Text style={[styles.label, { fontSize: s(11) }]}>ölçtüğün (cm)</Text>
            <TextInput
              value={actual}
              onChangeText={num(actual, setActual)}
              keyboardType="number-pad"
              placeholder="?"
              placeholderTextColor={colors.line}
              editable={!!guess}
              style={[
                styles.input,
                tabular,
                styles.numInput,
                { fontSize: s(22), height: s(50), borderRadius: s(9) },
                !guess && { opacity: 0.4 },
                step === 'measure' && styles.inputActive,
              ]}
            />
          </View>
        </View>

        <Pressable
          onPress={finish}
          disabled={!canFinish}
          style={({ pressed }) => [
            styles.btn,
            { borderRadius: s(22), paddingVertical: s(12) },
            !canFinish && { opacity: 0.4 },
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={[styles.btnText, { fontSize: s(16) }]}>
            {step === 'guess' ? 'Önce tahmin et' : step === 'measure' ? 'Şimdi ölç' : 'Karşılaştır'}
          </Text>
        </Pressable>
      </View>

      {rounds.length > 0 && (
        <>
          <Text style={[styles.bestLine, tabular, { fontSize: s(13) }]}>
            en yakın tahminin: {best} cm fark · {rounds.length} ölçüm
          </Text>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: s(6) }} showsVerticalScrollIndicator={false}>
            {rounds.map((r, i) => {
              const v = judge(r.diff);
              return (
                <View key={i} style={[styles.round, { borderRadius: s(9), padding: s(9) }]}>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={[styles.what, { fontSize: s(14) }]}>{r.what}</Text>
                    <Text style={[styles.verdict, { fontSize: s(12) }, styles[v.tone]]}>{v.text}</Text>
                  </View>
                  <Text style={[styles.nums, tabular, { fontSize: s(14) }]}>
                    {r.guess} → {r.actual}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  card: { backgroundColor: colors.card, borderWidth: 2, borderColor: colors.line },
  lead: { color: colors.inkSoft, textAlign: 'center' },
  strong: { color: colors.ink, fontWeight: '800' },
  input: {
    color: colors.ink,
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderColor: colors.line,
    paddingHorizontal: 12,
    fontWeight: '600',
  },
  numInput: { textAlign: 'center', fontWeight: '800' },
  inputActive: { borderColor: '#2C7A7A' },
  label: { color: colors.inkSoft, fontWeight: '700', textAlign: 'center' },
  pair: { flexDirection: 'row' },
  btn: { alignItems: 'center', backgroundColor: '#2C7A7A' },
  btnText: { color: '#FFFFFF', fontWeight: '800' },
  bestLine: { color: colors.inkSoft, fontWeight: '700', textAlign: 'center' },
  round: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
  },
  what: { color: colors.ink, fontWeight: '700' },
  verdict: { fontWeight: '600' },
  nums: { color: colors.inkSoft, fontWeight: '800' },
  great: { color: colors.factor[2] },
  good: { color: '#2C7A7A' },
  ok: { color: colors.inkSoft },
  far: { color: colors.factor[1] },
});
