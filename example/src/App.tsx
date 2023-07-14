import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Ticker } from 'react-native-bob-library';

const currentNum = 332;

export default function App() {
  return (
    <View style={styles.container}>
      <Ticker
        textStyle={{ fontSize: 48, fontWeight: '700', color: 'red' }}
        digitWidth="per-digit"
      >
        {currentNum}
      </Ticker>
    </View>
  );
}

const styles = StyleSheet.create({
  tickerTextStyle: {},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
