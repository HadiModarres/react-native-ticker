import range from 'lodash.range';
import React, { memo, useEffect, useMemo, useState } from 'react';
import type { TextStyle } from 'react-native';
import { Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
  withSpring,
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

export type DigitTickerProps = {
  children: number;
  direction: Direction;
  measurements: { width: number; height: number };
  textStyle?: TextStyle;
  animation?:
    | { type: 'timing'; animationConfig: WithTimingConfig }
    | { type: 'spring'; animationConfig: WithSpringConfig };
};

export const DigitTicker = ({
  children,
  direction,
  measurements,
  textStyle,
  animation = { type: 'timing', animationConfig: { duration: 700 } },
}: DigitTickerProps) => {
  const { height, width } = measurements;

  const widthSharedValue = useSharedValue(width);

  useEffect(() => {
    widthSharedValue.value = withTiming(width);
  }, [width, widthSharedValue]);

  const [tickerBar1, setTickerBar1] = useState<TickerBar>({
    name: 'bar-1',
    source: children,
    numberList: getBarNubmersForSourceNumber(children),
    showing: true,
  });

  const [tickerBar2, setTickerBar2] = useState<TickerBar>({
    name: 'bar-2',
    source: children,
    numberList: getBarNubmersForSourceNumber(children),
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
    console.log('running use effect');

    const showingBar = getShowingBar();

    if (showingBar.animating) {
      return;
    }

    if (showingBar.source !== children) {
      console.log('inside');
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

      // setTimeout(() => {
      if (animation.type === 'spring') {
        getTranslation(showingBar.name).value = withSpring(
          getTickerBarTargetTranslation(
            showingBar,
            children,
            direction,
            height
          ),
          animation.animationConfig,
          () => {
            runOnJS(setNonShowingBar)(true);
            runOnJS(setShowingBar)(false, false);
          }
        );
      } else {
        getTranslation(showingBar.name).value = withTiming(
          getTickerBarTargetTranslation(
            showingBar,
            children,
            direction,
            height
          ),
          animation.animationConfig,
          () => {
            runOnJS(setNonShowingBar)(true);
            runOnJS(setShowingBar)(false, false);
          }
        );
      }
      // }, 0);
    }
  }, [
    children,
    animation,
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

  // const containerAnimatedStyle = useAnimatedStyle(() => ({
  //   height,
  //   width: widthSharedValue.value,
  //   overflow: 'hidden',
  // }));

  return (
    <View
      style={{
        height: height,
        width: measurements.width,
        overflow: 'hidden',
      }}
      // style={containerAnimatedStyle}
    >
      <Animated.View style={bar1AnimatedStyle}>
        <Bar
          numberList={tickerBar1.numberList}
          height={height}
          textStyle={textStyle}
        />
      </Animated.View>

      <Animated.View style={bar2AnimatedStyle}>
        <Bar
          numberList={tickerBar2.numberList}
          height={height}
          textStyle={textStyle}
        />
      </Animated.View>
    </View>
  );
};

type BarProps = {
  textStyle?: TextStyle;
  numberList: number[];
  height: number;
};
const Bar = memo(
  ({ numberList, textStyle, height }: BarProps) => {
    console.log('rendering number list');
    return (
      <>
        {numberList.map((i, index) => (
          <View
            key={'bar' + index}
            style={{
              height,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={textStyle}>{i}</Text>
          </View>
        ))}
      </>
    );
  },
  (prev, next) => prev.numberList[0] === next.numberList[0]
);
