import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Ticker } from 'react-native-bob-library';

export default function App() {
  return (
    <View style={styles.container}>
      <Ticker
        textStyle={{ fontSize: 48, fontWeight: '700' }}
        digitWidth="per-digit"
      >
        367
      </Ticker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
