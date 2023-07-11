import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Ticker } from 'react-native-bob-library';

export default function App() {
  return (
    <View style={styles.container}>
      <Ticker digitWidth="per-digit">31</Ticker>
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
