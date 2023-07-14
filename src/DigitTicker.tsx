import range from 'lodash.range';
import React, { useEffect, useMemo, useState } from 'react';
import type { TextStyle } from 'react-native';
import { Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type Direction = 'up' | 'down';

type TickerBar = {
  name: string;
  source: number;
  target?: number;
  animating?: boolean;
  showing?: boolean;
  numberList: number[];
};

const getTickerBarInitialTranslation = (
  tickerBar: TickerBar,
  cellHeight: number
): number => {
  return -tickerBar.numberList.indexOf(tickerBar.source) * cellHeight;
};

const getTickerBarTargetTranslation = (
  tickerBar: TickerBar,
  target: number,
  direction: Direction,
  cellHeight: number
): number => {
  if (direction === 'up') {
    return -tickerBar.numberList.indexOf(target) * cellHeight;
  } else {
    return (
      -tickerBar.numberList.findLastIndex((n) => n === target) * cellHeight
    );
  }
};

const getBarNubmersForSourceNumber = (source: number): number[] => {
  const upper = source + 10;
  const lower = source - 9;

  return range(lower + 10, upper + 10)
    .reverse()
    .map((n) => n % 10);
};

type DigitTickerProps = {
  children: number;
  direction: Direction;
  measurements: { width: number; height: number };
  textStyle?: TextStyle;
};

export const DigitTicker = ({
  children,
  direction,
  measurements,
  textStyle,
}: DigitTickerProps) => {
  const { height, width } = measurements;

  const [tickerBar1, setTickerBar1] = useState<TickerBar>({
    name: 'bar-1',
    source: 0,
    numberList: getBarNubmersForSourceNumber(0),
    showing: true,
  });

  const [tickerBar2, setTickerBar2] = useState<TickerBar>({
    name: 'bar-2',
    source: 0,
    numberList: getBarNubmersForSourceNumber(0),
    showing: false,
  });

  const bar1Translate = useSharedValue(
    getTickerBarInitialTranslation(tickerBar1, height)
  );

  const bar2Translate = useSharedValue(
    getTickerBarInitialTranslation(tickerBar2, height)
  );

  const bar1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bar1Translate.value }],
    width,
    opacity: tickerBar1.showing ? 255 : 0,
    position: 'absolute',
  }));

  const bar2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bar2Translate.value }],
    width,
    opacity: tickerBar2.showing ? 255 : 0,
    position: 'absolute',
  }));

  const {
    getNonShowingBarSetter,
    getOtherBar,
    getShowingBar,
    getShowingBarSetter,
    setNonShowingBar,
    setShowingBar,
  } = useMemo(() => {
    return {
      getShowingBar: (): TickerBar => {
        if (tickerBar1.showing) {
          return tickerBar1;
        } else {
          return tickerBar2;
        }
      },

      getOtherBar: (tickerBar: TickerBar) => {
        if (tickerBar.name === 'bar-1') {
          return tickerBar2;
        } else {
          return tickerBar1;
        }
      },
      getShowingBarSetter: () => {
        if (tickerBar1.showing) {
          return setTickerBar1;
        } else {
          return setTickerBar2;
        }
      },
      getNonShowingBarSetter: () => {
        if (!tickerBar1.showing) {
          return setTickerBar1;
        } else {
          return setTickerBar2;
        }
      },

      setShowingBar: (showing: boolean, animating: boolean) => {
        getShowingBarSetter()((bar) => ({
          ...bar,
          showing,
          animating,
        }));
      },
      setNonShowingBar: (showing: boolean) => {
        getNonShowingBarSetter()((bar) => ({
          ...bar,
          showing,
        }));
      },
    };
  }, [tickerBar1, tickerBar2]);

  const { getTranslation } = useMemo(() => {
    return {
      getTranslation: (tickerBarName: string) => {
        if (tickerBarName === 'bar-1') {
          return bar1Translate;
        } else {
          return bar2Translate;
        }
      },
    };
  }, [bar1Translate, bar2Translate]);

  useEffect(() => {
    const showingBar = getShowingBar();

    if (showingBar.animating) {
      return;
    }

    if (showingBar.source !== children) {
      getShowingBarSetter()((bar) => ({
        ...bar,
        target: children,
        animating: true,
      }));

      getTranslation(getOtherBar(showingBar).name).value =
        getTickerBarInitialTranslation(getOtherBar(showingBar), height);

      getNonShowingBarSetter()((bar) => ({
        ...bar,
        showing: false,
        source: children,
        numberList: getBarNubmersForSourceNumber(children),
      }));

      getTranslation(showingBar.name).value = withTiming(
        getTickerBarTargetTranslation(showingBar, children, direction, height),
        { duration: 700 },
        () => {
          runOnJS(setNonShowingBar)(true);
          runOnJS(setShowingBar)(false, false);
        }
      );
    }
  }, [
    children,
    direction,
    getNonShowingBarSetter,
    getOtherBar,
    getShowingBar,
    getShowingBarSetter,
    getTranslation,
    height,
    setNonShowingBar,
    setShowingBar,
  ]);

  return (
    <View
      style={{
        height: height,
        width: measurements.width,
        borderColor: 'green',
        borderWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Animated.View style={bar1AnimatedStyle}>
        {tickerBar1.numberList.map((i, index) => (
          <View
            key={'bar-1' + index}
            style={{
              height,
              borderColor: 'red',
              borderWidth: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={textStyle}>{i}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View style={bar2AnimatedStyle}>
        {tickerBar2.numberList.map((i, index) => (
          <View
            key={'bar-2' + index}
            style={{
              height,
              borderColor: 'blue',
              borderWidth: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={textStyle}>{i}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};
