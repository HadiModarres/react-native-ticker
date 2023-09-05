import * as React from 'react';

import { ScrollView } from 'react-native';
import { Ticker } from '@hmodarres/react-native-ticker';
import range from 'lodash.range';

// const numbers = [7, 1, 8, 9, 7];
export default function App() {
  // const enabled = true;
  // const [currentNumberIndex, setCurrentNumberIndex] = React.useState(0);
  // const [currentNumber, setCurrentNumber] = React.useState(
  //   numbers[currentNumberIndex]
  // );

  // React.useEffect(() => {
  //   if (!enabled) {
  //     return;
  //   }
  //   const interval = setInterval(() => {
  //     // Increment the index to get the next number
  //     setCurrentNumberIndex((prevIndex) => (prevIndex + 1) % numbers.length);
  //   }, 5000); // 5000 milliseconds (5 seconds)

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, [enabled]);

  // useEffect(() => {
  //   // Update the currentNumber whenever the index changes
  //   setCurrentNumber(numbers[currentNumberIndex]);
  // }, [currentNumberIndex]);

  // // const currentNum = 7;

  return (
    <ScrollView
      contentContainerStyle={{
        flexWrap: 'wrap',
        width: '100%',
        paddingTop: 80,
      }}
      horizontal
    >
      {range(40).map((i) => (
        // <Animated.Text key={i}>{currentNum}</Animated.Text>
        // <DigitTicker3
        //   // animation={{ type: 'timing', animationConfig: { duration: 2000 } }}
        //   measurements={{ width: 58, height: 81 }}
        //   textStyle={{
        //     fontWeight: 'bold',
        //     fontSize: 54,
        //     lineHeight: 81,
        //   }}
        //   key={i}
        // >
        //   {currentNumber}
        // </DigitTicker3>
        <Ticker key={i}>32</Ticker>
      ))}

      {/* <DigitTicker3
        textStyle={{
          fontWeight: 'bold',
          fontSize: 54,
          lineHeight: 81,
        }}
        measurements={{ width: 58, height: 81 }}
      >
        {4}
      </DigitTicker3> */}
      {/* <TickerBar2
        measurements={{ width: 40, height: 40 }}
        source={8}
        target={8}
      /> */}
    </ScrollView>
  );
}
