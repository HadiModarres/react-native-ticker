import range from 'lodash.range';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { View, type TextStyle, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
  type WithTimingConfig,
  type WithSpringConfig,
} from 'react-native-reanimated';

type DigitTicker2Props = {
  children: number;
  measurements: { width: number; height: number };
  textStyle?: TextStyle;
  animation?:
    | { type: 'timing'; animationConfig: WithTimingConfig }
    | { type: 'spring'; animationConfig: WithSpringConfig };
};

export const DigitTicker3 = ({
  children,
  measurements,
  textStyle,
}: DigitTicker2Props) => {
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
    <TickerBar2
      source={sourceAndTarget.source}
      target={sourceAndTarget.target}
      measurements={measurements}
      onReachedTarget={onReachTarget}
      textStyle={textStyle}
    />
  );
};

type TickerBarProps = {
  source: number;
  target?: number;
  measurements: { width: number; height: number };
  textStyle?: TextStyle;
  onReachedTarget?: () => void;
};

const getNumbersList = (source: number, target: number): number[] => {
  const upper = (target < source ? target + 10 : target) + 1;
  const lower = source;

  return range(lower + 10, upper + 10).map((n) => n % 10);
};

export const TickerBar2 = ({
  source,
  onReachedTarget,
  target,
  measurements,
  textStyle,
}: TickerBarProps) => {
  const translationSharedValue = useSharedValue(0);

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

    translationSharedValue.value = withTiming(
      measurements.height * (numberList.length - 1),
      { duration: 3e3 },
      () => {
        runOnJS(targetReached)();
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberList]);

  return (
    <View
      style={{
        width: measurements.width,
        height: measurements.height,
        overflow: 'hidden',
        borderColor: 'red',
        borderWidth: 1,
      }}
    >
      {numberList.map((i, index) => (
        <Cell
          key={'cell-' + i}
          text={i}
          index={index}
          measurements={measurements}
          translationSharedValue={translationSharedValue}
          textStyle={textStyle}
        />
      ))}
    </View>
  );
};

type CellProps = {
  index: number;
  translationSharedValue: SharedValue<number>;
  text: number;
  textStyle?: TextStyle;
  measurements: { width: number; height: number };
};

const Cell = ({
  index,
  translationSharedValue,
  text,
  textStyle,
  measurements,
}: CellProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            translationSharedValue.value - index * measurements.height,
        },
      ],
      height: measurements.height,
      width: measurements.width,
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
