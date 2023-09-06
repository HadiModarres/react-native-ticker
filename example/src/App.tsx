import * as React from 'react';

import { ScrollView } from 'react-native';
import { Ticker } from '@hmodarres/react-native-ticker';
import range from 'lodash.range';

export default function App() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexWrap: 'wrap',
        width: '100%',
        paddingTop: 180,
      }}
      horizontal
    >
      {range(1).map((i) => (
        <Ticker
          digitWidth="per-digit"
          textStyle={{
            fontWeight: 'bold',
            fontSize: 54,
            lineHeight: 81,
          }}
          key={i}
        >
          17986
        </Ticker>
      ))}
    </ScrollView>
  );
}
