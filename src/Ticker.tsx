import React, { useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import range from 'lodash.range';
import { DigitTicker, type DigitTickerProps } from './DigitTicker';
import { isDigit } from './utils';

type MeasureMap = Record<string, { width: number; height: number }>;

type TickerProps = Pick<
  DigitTickerProps,
  'textStyle' | 'tickerAnimation' | 'widthAnimation'
> & {
  children: string | number | null | undefined;

  /**
   * @param {string} digitWidth Specifies the width of each digit.
   * @description
   * per-digit: Each digit keeps its original width this means strings of same length can have different widths depending on characters used.
   *
   *
   * max-digit-width: All digits take the width of the widest digit, this makes widths of strings with same length the same.
   */
  digitWidth?: 'per-digit' | 'max-digit-width';
};

export const Ticker = ({
  children,
  textStyle,
  digitWidth = 'per-digit',
  tickerAnimation,
  widthAnimation,
}: TickerProps) => {
  const measureMap = useRef<MeasureMap>({});
  const [digitsMeasured, setDigitsMeasured] = useState(false);

  const characters = useMemo(() => {
    if (children == null) {
      return children;
    }
    return String(children).split('');
  }, [children]);

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
    <View collapsable={false}>
      <View style={{ flexDirection: 'row' }}>
        {digitsMeasured &&
          maxDimensions &&
          characters &&
          characters.map((d, index) =>
            isDigit(d) ? (
              <DigitTicker
                textStyle={textStyle}
                measurements={{
                  cellHeight: maxDimensions.height,
                  cellWidth:
                    digitWidth === 'max-digit-width'
                      ? maxDimensions.width
                      : measureMap.current[d]!.width,
                }}
                key={String(index)}
                tickerAnimation={tickerAnimation}
                widthAnimation={widthAnimation}
              >
                {parseInt(d, 10)}
              </DigitTicker>
            ) : (
              <Text key={String(index)} style={textStyle}>
                {d}
              </Text>
            )
          )}
      </View>

      <View
        collapsable={false}
        style={{
          opacity: 0,
          position: 'absolute',
          top: 1e4,
          alignItems: 'flex-start',
        }}
      >
        {range(0, 10).map((digit) => (
          <Text
            style={textStyle}
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
