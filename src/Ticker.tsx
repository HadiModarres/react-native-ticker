import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DigitTicker, type Direction } from './DigitTicker';
import { Text, View } from 'react-native';
import range from 'lodash.range';

type MeasureMap = Record<string, { width: number; height: number }>;

type TickerProps = {
  children: string;
  digitWidth?: 'per-digit' | 'max-digit-width';
};

export const Ticker = ({ children, digitWidth = 'per-digit' }: TickerProps) => {
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

  const maxDimensions = useMemo(() => {
    if (!digitsMeasured) {
      return undefined;
    }
    return {
      width: Math.max(...Object.values(measureMap.current).map((m) => m.width)),
      height: Math.max(
        ...Object.values(measureMap.current).map((m) => m.height)
      ),
    };
  }, [digitsMeasured]);

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {digitsMeasured &&
          maxDimensions &&
          digits.map((d, index) => (
            <DigitTicker
              measurements={{
                height: maxDimensions.height,
                width:
                  digitWidth === 'max-digit-width'
                    ? maxDimensions.width
                    : measureMap.current[d]!.width,
              }}
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
              const { width, height } = event.nativeEvent.layout;
              measureMap.current[digit] = { width, height: Math.ceil(height) };
              if (Object.keys(measureMap.current).length === 10) {
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
