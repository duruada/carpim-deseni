import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GAMES } from '../games';
import { colors } from '../theme';
import GameIcon from './GameIcon';

export default function MenuScreen({ onPick, s, wide }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.content, { gap: s(9), paddingBottom: s(8) }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.lead, { fontSize: s(13), lineHeight: s(19), marginBottom: s(2) }]}>
        Burada soru sorulmuyor. Hepsi denemek, karıştırmak ve fark etmek için.
      </Text>

      <View style={[styles.grid, { gap: s(9) }]}>
        {GAMES.map((g) => (
          <Pressable
            key={g.key}
            onPress={() => onPick(g.key)}
            style={({ pressed }) => [
              styles.card,
              {
                borderRadius: s(14),
                padding: s(12),
                gap: s(11),
                width: wide ? '48.7%' : '100%',
              },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={g.title}
          >
            <View
              style={[
                styles.iconBox,
                {
                  width: s(48),
                  height: s(48),
                  borderRadius: s(12),
                  backgroundColor: `${g.color}1A`,
                },
              ]}
            >
              <GameIcon name={g.key} color={g.color} size={s(28)} />
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.titleRow}>
                <Text style={[styles.cardTitle, { fontSize: s(17) }]} numberOfLines={1}>
                  {g.title}
                </Text>
                <Text style={[styles.lever, { fontSize: s(9), color: g.color }]}>{g.lever}</Text>
              </View>
              <Text style={[styles.blurb, { fontSize: s(12), lineHeight: s(17) }]}>
                {g.blurb}
              </Text>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.line,
  },
  pressed: { backgroundColor: colors.paper, transform: [{ scale: 0.985 }] },
  iconBox: { alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  cardTitle: { fontWeight: '800', color: colors.ink, flexShrink: 1 },
  lever: { fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  blurb: { color: colors.inkSoft, marginTop: 2 },
});
