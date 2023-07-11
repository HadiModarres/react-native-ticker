import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DigitTicker, type Direction } from './DigitTicker';
import { Text, View } from 'react-native';
import range from 'lodash.range';
import type { TextStyle } from 'react-native';

type MeasureMap = Record<string, { width: number; height: number }>;

type TickerProps = {
  children: string;
  digitWidth?: 'per-digit' | 'max-digit-width';
  textStyle?: TextStyle;
};

export const Ticker = ({
  children,
  textStyle,
  digitWidth = 'per-digit',
}: TickerProps) => {
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
      <View
        style={{ flexDirection: 'row', borderColor: 'green', borderWidth: 0 }}
      >
        {digitsMeasured &&
          maxDimensions &&
          digits.map((d, index) => (
            <DigitTicker
              textStyle={textStyle}
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
      {/* <Text style={textStyle}>{children}</Text> */}

      <View style={{ opacity: 0 }}>
        {range(0, 10).map((digit) => (
          <Text
            style={[
              {
                marginRight: 'auto',
              },
              textStyle,
            ]}
            key={digit}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              measureMap.current[digit] = {
                width,
                height: Math.ceil(height),
              };
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
