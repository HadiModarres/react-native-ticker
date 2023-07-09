import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { DigitTicker } from 'react-native-bob-library';

export default function App() {
  return (
    <View style={styles.container}>
      <DigitTicker direction="up">{7}</DigitTicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
