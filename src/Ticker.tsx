import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type DigitTickerProps } from './DigitTicker';
import { Text, View } from 'react-native';
import range from 'lodash.range';
import type { TextStyle } from 'react-native';
import { DigitTicker3 } from './DigitTicker3';

type MeasureMap = Record<string, { width: number; height: number }>;

type TickerProps = Pick<DigitTickerProps, 'animation'> & {
  children: string | number;

  /**
   * @param {string} digitWidth Specifies the width of each digit.
   * @description
   * per-digit: Each digit keeps its original width this means strings of same length can have different widths depending on characters used.
   *
   *
   * max-digit-width: All digits take the width of the widest digit, this makes widths of strings with same length the same.
   */
  digitWidth?: 'per-digit' | 'max-digit-width';

  textStyle?: TextStyle;
};

export const Ticker = ({
  children,
  textStyle,
  digitWidth = 'per-digit',
}: TickerProps) => {
  if (children == null) {
    throw Error('provide a number as children e.g. <Ticker>123</Ticker>');
  }
  if (typeof children === 'string') {
    if (!/^\d+$/.test(children)) {
      throw Error('react-native-ticker only accepts integers at the moment');
    }
  } else {
    if (!Number.isInteger(children)) {
      throw Error('react-native-ticker only accepts integers at the moment');
    }
  }
  const [currentNumber, setCurrentNumber] = useState<string>(String(children));
  const measureMap = useRef<MeasureMap>({});
  const [digitsMeasured, setDigitsMeasured] = useState(false);

  useEffect(() => {
    if (children !== currentNumber) {
      setCurrentNumber(String(children));
    }
  }, [children, currentNumber]);

  const digits = useMemo(() => {
    return currentNumber.split('');
  }, [currentNumber]);

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
            <DigitTicker3
              textStyle={textStyle}
              measurements={{
                height: maxDimensions.height,
                // height: 80,
                // width: 40,
                width:
                  digitWidth === 'max-digit-width'
                    ? maxDimensions.width
                    : measureMap.current[d]!.width,
              }}
              key={String(index)}
              // direction={direction}
              // animation={animation}
            >
              {parseInt(d, 10)}
            </DigitTicker3>
          ))}
      </View>

      <View style={{ opacity: 0, position: 'absolute', top: 1e5 }}>
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
