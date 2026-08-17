import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { colors, createScale } from './src/theme';
import MultiplesScreen from './src/components/MultiplesScreen';
import TableScreen from './src/components/TableScreen';

const TABS = [
  { key: 'multiples', label: 'Katlar' },
  { key: 'table', label: 'Tablo' },
];

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
  const [tab, setTab] = useState('multiples');

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.page, { padding: s(12), gap: s(10) }]}>
        <Text style={[styles.title, { fontSize: s(19) }]}>Ada'nın Çarpım Deseni</Text>

        {tab === 'multiples' ? <MultiplesScreen s={s} /> : <TableScreen s={s} />}

        <View style={[styles.tabs, { gap: s(8) }]}>
          {TABS.map((t) => {
            const on = tab === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
                style={({ pressed }) => [
                  styles.tab,
                  {
                    paddingVertical: s(11),
                    borderRadius: s(24),
                    backgroundColor: on ? colors.ink : colors.card,
                    borderColor: on ? colors.ink : colors.line,
                  },
                  pressed && !on && { backgroundColor: colors.line },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    { fontSize: s(15), color: on ? '#FFFFFF' : colors.inkSoft },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  page: { flex: 1 },
  title: { textAlign: 'center', fontWeight: '800', color: colors.ink },
  tabs: { flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', borderWidth: 2 },
  tabLabel: { fontWeight: '800' },
});
