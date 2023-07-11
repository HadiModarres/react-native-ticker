import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DigitTicker, type Direction } from './DigitTicker';
import { Text, View } from 'react-native';
import range from 'lodash.range';

type MeasureMap = Record<string, { width: number; height: number }>;

type TickerProps = {
  children: string;
};

export const Ticker = ({ children }: TickerProps) => {
  const [currentNumber, setCurrentNumber] = useState(children);
  const [direction, setDirection] = useState<Direction>('up');
  const measureMap = useRef<MeasureMap>({});
  const [digitsMeasured, setDigitsMeasured] = useState(false);

  const digits = useMemo(() => {
    return currentNumber.split('');
  }, [currentNumber]);

  useEffect(() => {
    if (children !== currentNumber) {
      setCurrentNumber(children);
      setDirection(children > currentNumber ? 'up' : 'down');
    }
  }, [children, currentNumber]);

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {digitsMeasured &&
          digits.map((d, index) => (
            <DigitTicker
              measurements={measureMap.current[d]!}
              key={String(index)}
              direction={direction}
            >
              {parseInt(d, 10)}
            </DigitTicker>
          ))}
      </View>
      <Text>{children}</Text>

      <View style={{ backgroundColor: 'red', flex: 0, opacity: 0 }}>
        {range(0, 10).map((digit) => (
          <Text
            style={{
              flex: 0,
              marginRight: 'auto',
              borderColor: 'blue',
              borderWidth: 0,
            }}
            key={digit}
            onLayout={(event) => {
              console.log('measured');
              const { width, height } = event.nativeEvent.layout;
              measureMap.current[digit] = { width, height: Math.ceil(height) };
              if (Object.keys(measureMap.current).length === 10) {
                console.log('all measured');
                console.log(measureMap.current);
                setDigitsMeasured(true);
              }
            }}
          >
            {digit}
          </Text>
        ))}
      </View>
    </View>
  );
};
