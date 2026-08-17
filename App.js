import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { GAMES } from './src/games';
import { colors, createScale } from './src/theme';
import DiceScreen from './src/components/DiceScreen';
import FractionScreen from './src/components/FractionScreen';
import GameIcon from './src/components/GameIcon';
import MarketScreen from './src/components/MarketScreen';
import MeasureScreen from './src/components/MeasureScreen';
import MenuScreen from './src/components/MenuScreen';
import MirrorScreen from './src/components/MirrorScreen';
import MultiplesScreen from './src/components/MultiplesScreen';
import NumberLineScreen from './src/components/NumberLineScreen';
import TableScreen from './src/components/TableScreen';

const SCREENS = {
  multiples: MultiplesScreen,
  table: TableScreen,
  numberline: NumberLineScreen,
  fraction: FractionScreen,
  market: MarketScreen,
  measure: MeasureScreen,
  dice: DiceScreen,
  mirror: MirrorScreen,
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <Root />
    </SafeAreaProvider>
  );
}

function Root() {
  const { width, height } = useWindowDimensions();
  const s = useMemo(() => createScale(width, height), [width, height]);
  const [active, setActive] = useState(null);

  const game = active ? GAMES.find((g) => g.key === active) : null;
  const Screen = active ? SCREENS[active] : null;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.page, { padding: s(12), gap: s(10) }]}>
        <View style={[styles.header, { gap: s(9) }]}>
          {game ? (
            <>
              <Pressable
                onPress={() => setActive(null)}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.back,
                  { width: s(38), height: s(38), borderRadius: s(19) },
                  pressed && { backgroundColor: colors.line },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Oyun listesine dön"
              >
                <Text style={{ fontSize: s(18), color: colors.inkSoft }}>‹</Text>
              </Pressable>
              <GameIcon name={game.key} color={game.color} size={s(24)} />
              <Text style={[styles.title, { fontSize: s(19) }]}>{game.title}</Text>
            </>
          ) : (
            <Text style={[styles.title, styles.titleHome, { fontSize: s(19) }]}>
              Ada'nın Matematik Oyunları
            </Text>
          )}
        </View>

        {Screen ? (
          <Screen s={s} />
        ) : (
          <MenuScreen onPick={setActive} s={s} wide={width > s(620)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  page: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center' },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  title: { fontWeight: '800', color: colors.ink },
  titleHome: { flex: 1, textAlign: 'center' },
});
