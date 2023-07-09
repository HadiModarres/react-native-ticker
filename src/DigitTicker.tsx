import range from 'lodash.range';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const CELL_HEIGHT = 40;
type Direction = 'up' | 'down';

type TickerBar = {
  name: string;
  source: number;
  target?: number;
  animating?: boolean;
  showing?: boolean;
  numberList: number[];
};

const getTickerBarInitialTranslation = (tickerBar: TickerBar): number => {
  return -tickerBar.numberList.indexOf(tickerBar.source) * CELL_HEIGHT;
};

const getTickerBarTargetTranslation = (
  tickerBar: TickerBar,
  target: number,
  direction: Direction
): number => {
  if (direction === 'up') {
    return -tickerBar.numberList.indexOf(target) * CELL_HEIGHT;
  } else {
    return (
      -tickerBar.numberList.findLastIndex((n) => n === target) * CELL_HEIGHT
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
};

export const DigitTicker = ({ children, direction }: DigitTickerProps) => {
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
    getTickerBarInitialTranslation(tickerBar1)
  );

  const bar2Translate = useSharedValue(
    getTickerBarInitialTranslation(tickerBar2)
  );

  const bar1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bar1Translate.value }],
    width: 40,
    opacity: tickerBar1.showing ? 255 : 0,
    position: 'absolute',
  }));

  const bar2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bar2Translate.value }],
    width: 40,
    opacity: tickerBar2.showing ? 255 : 0,
    position: 'absolute',
  }));

  useEffect(() => {
    const getShowingBar = (): TickerBar => {
      if (tickerBar1.showing) {
        return tickerBar1;
      } else {
        return tickerBar2;
      }
    };

    const getOtherBar = (tickerBar: TickerBar) => {
      if (tickerBar.name === 'bar-1') {
        return tickerBar2;
      } else {
        return tickerBar1;
      }
    };

    const getTranslation = (tickerBarName: string) => {
      if (tickerBarName === 'bar-1') {
        return bar1Translate;
      } else {
        return bar2Translate;
      }
    };

    const getShowingBarSetter = () => {
      if (tickerBar1.showing) {
        return setTickerBar1;
      } else {
        return setTickerBar2;
      }
    };

    const getNonShowingBarSetter = () => {
      if (!tickerBar1.showing) {
        return setTickerBar1;
      } else {
        return setTickerBar2;
      }
    };

    const setShowingBar = (showing: boolean, animating: boolean) => {
      getShowingBarSetter()((bar) => ({
        ...bar,
        showing,
        animating,
      }));
    };

    const setNonShowingBar = (showing: boolean) => {
      getNonShowingBarSetter()((bar) => ({
        ...bar,
        showing,
      }));
    };

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
        getTickerBarInitialTranslation(getOtherBar(showingBar));
      getNonShowingBarSetter()((bar) => ({
        ...bar,
        showing: false,
        source: children,
        numberList: getBarNubmersForSourceNumber(children),
      }));

      getTranslation(showingBar.name).value = withTiming(
        getTickerBarTargetTranslation(showingBar, children, direction),
        { duration: 400 },
        () => {
          runOnJS(setNonShowingBar)(true);
          runOnJS(setShowingBar)(false, false);
        }
      );
    }
  }, [
    children,
    tickerBar1,
    tickerBar2,
    bar1AnimatedStyle,
    bar2AnimatedStyle,
    bar1Translate,
    bar2Translate,
    direction,
  ]);

  return (
    <View
      style={{
        height: 40,
        width: 50,
        borderColor: 'green',
        borderWidth: 1,
        // flexDirection: 'row',
        overflow: 'hidden',
      }}
    >
      <Animated.View style={bar1AnimatedStyle}>
        {tickerBar1.numberList.map((i, index) => (
          <View
            key={'bar-1' + index}
            style={{
              height: 40,
              borderColor: 'red',
              borderWidth: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>{i}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View style={bar2AnimatedStyle}>
        {tickerBar2.numberList.map((i, index) => (
          <View
            key={'bar-2' + index}
            style={{
              height: 40,
              borderColor: 'blue',
              borderWidth: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>{i}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};
