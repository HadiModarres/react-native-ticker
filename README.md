![media](./media/example.gif)

## Description
A ticker component for react native. 

- Performant
- Configurable
- Ticker animates upwards when new number is greater than previous number and down if it's less

This package requires installation of [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

## Installation
```
npm install --save @hmodarres/react-native-ticker
or
yarn add @hmodarres/react-native-ticker
```

## Usage
react-native-ticker supports a single child text string or number

```
import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Ticker } from '@hmodarres/react-native-ticker';


export default function App() {
  return (
    <View style={styles.container}>
      <Ticker
        textStyle={{ fontSize: 48, fontWeight: '700', color: 'red' }}
        digitWidth="per-digit"
      >
        332
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

```


## License
[MIT License](https://opensource.org/licenses/MIT)