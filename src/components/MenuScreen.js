import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GAMES } from '../games';
import { colors } from '../theme';

export default function MenuScreen({ onPick, s, wide }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.content, { gap: s(10), paddingBottom: s(10) }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.lead, { fontSize: s(14), lineHeight: s(20), marginBottom: s(2) }]}>
        Burada soru sorulmuyor. Hepsi denemek, karıştırmak ve fark etmek için.
      </Text>

      <View style={[styles.grid, { gap: s(10) }]}>
        {GAMES.map((g) => (
          <Pressable
            key={g.key}
            onPress={() => onPick(g.key)}
            style={({ pressed }) => [
              styles.card,
              {
                borderRadius: s(14),
                padding: s(14),
                borderLeftWidth: s(6),
                borderLeftColor: g.color,
                width: wide ? '48.5%' : '100%',
              },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={g.title}
          >
            <View style={styles.cardTop}>
              <Text style={[styles.cardTitle, { fontSize: s(19) }]}>{g.title}</Text>
              <Text style={[styles.lever, { fontSize: s(10), color: g.color }]}>
                {g.lever}
              </Text>
            </View>
            <Text style={[styles.blurb, { fontSize: s(13), lineHeight: s(19) }]}>
              {g.blurb}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center' },
  lead: { color: colors.inkSoft, textAlign: 'center', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
  },
  pressed: { backgroundColor: colors.paper, transform: [{ scale: 0.985 }] },
  cardTop: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  cardTitle: { fontWeight: '800', color: colors.ink },
  lever: { fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  blurb: { color: colors.inkSoft, marginTop: 4 },
});
