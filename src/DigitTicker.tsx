import range from 'lodash.range';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { type TextStyle, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { AnimationConfig, CellMeasurements } from './types';

export type DigitTickerProps = {
  textStyle?: TextStyle;
  tickerAnimation?: AnimationConfig;
  widthAnimation?: AnimationConfig;
  measurements: CellMeasurements;
  children: number;
};

export const DigitTicker = ({
  children,
  measurements,
  textStyle,
  tickerAnimation,
  widthAnimation,
}: DigitTickerProps) => {
  const [sourceAndTarget, setSourceAndTarget] = useState<{
    source: number;
    target?: number;
  }>({ source: children });

  const onReachTarget = () => {
    setSourceAndTarget((s) => ({
      source: s.target ?? s.source,
      target: undefined,
    }));
  };

  useEffect(() => {
    if (sourceAndTarget.source != null && sourceAndTarget.target != null) {
      // in transition
      return;
    } else if (children !== sourceAndTarget.source) {
      setSourceAndTarget((s) => ({ ...s, target: children }));
    }
  }, [children, sourceAndTarget]);

  return (
    <TickerBar
      source={sourceAndTarget.source}
      target={sourceAndTarget.target}
      measurements={measurements}
      onReachedTarget={onReachTarget}
      textStyle={textStyle}
      tickerAnimation={tickerAnimation}
      widthAnimation={widthAnimation}
    />
  );
};

type TickerBarProps = {
  source: number;
  target?: number;
  measurements: CellMeasurements;
  tickerAnimation?: AnimationConfig;
  widthAnimation?: AnimationConfig;
  textStyle?: TextStyle;
  onReachedTarget?: () => void;
};

const getNumbersList = (source: number, target: number): number[] => {
  const upper = (target < source ? target + 10 : target) + 1;
  const lower = source;

  return range(lower + 10, upper + 10).map((n) => n % 10);
};

export const TickerBar = ({
  source,
  onReachedTarget,
  target,
  measurements,
  textStyle,
  tickerAnimation = { type: 'spring', animationConfig: { mass: 0.4 } },
  widthAnimation = { type: 'spring', animationConfig: { mass: 0.4 } },
}: TickerBarProps) => {
  const { cellHeight, cellWidth } = measurements;

  const translationSharedValue = useSharedValue(0);
  const widthSharedValue = useSharedValue(cellWidth);

  const numberList = useMemo(() => {
    if (target == null) {
      return [source];
    } else {
      return getNumbersList(source, target);
    }
  }, [source, target]);

  const targetReached = () => {
    onReachedTarget?.();
  };

  useEffect(() => {
    translationSharedValue.value = 0;

    if (tickerAnimation.type === 'spring') {
      translationSharedValue.value = withSpring(
        cellHeight * (numberList.length - 1),
        tickerAnimation.animationConfig,
        () => {
          runOnJS(targetReached)();
        }
      );
    } else {
      translationSharedValue.value = withTiming(
        cellHeight * (numberList.length - 1),
        tickerAnimation.animationConfig,
        () => {
          runOnJS(targetReached)();
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberList]);

  useEffect(() => {
    if (widthAnimation.type === 'timing') {
      widthSharedValue.value = withTiming(
        cellWidth,
        widthAnimation.animationConfig
      );
    } else {
      widthSharedValue.value = withSpring(
        cellWidth,
        widthAnimation.animationConfig
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellWidth]);

  const containerStyle = useAnimatedStyle(() => ({
    width: widthSharedValue.value,
    height: cellHeight,
    overflow: 'hidden',
    borderColor: 'red',
    borderWidth: 0,
  }));

  return (
    <Animated.View style={containerStyle}>
      {numberList.map((i, index) => (
        <Cell
          key={'cell-' + i}
          text={i}
          index={index}
          height={cellHeight}
          translationSharedValue={translationSharedValue}
          textStyle={textStyle}
        />
      ))}
    </Animated.View>
  );
};

type CellProps = {
  index: number;
  translationSharedValue: SharedValue<number>;
  text: number;
  textStyle?: TextStyle;
  height: number;
};

const Cell = ({
  index,
  translationSharedValue,
  text,
  textStyle,
  height,
}: CellProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translationSharedValue.value - index * height,
        },
      ],
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    };
  });
  return (
    <Animated.View style={animatedStyle}>
      <Text style={textStyle}>{text}</Text>
    </Animated.View>
  );
};
