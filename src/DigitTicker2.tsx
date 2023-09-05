import range from 'lodash.range';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { View, type TextStyle, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type DigitTicker2Props = {
  children: number;
  measurements: { width: number; height: number };
  textStyle?: TextStyle;
  //   animation?:
  //     | { type: 'timing'; animationConfig: WithTimingConfig }
  //     | { type: 'spring'; animationConfig: WithSpringConfig };
};

export const DigitTicker2 = ({
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
    <TickerBar
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

  return range(lower + 10, upper + 10)
    .reverse()
    .map((n) => n % 10);
};

export const TickerBar = ({
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
    translationSharedValue.value = -(
      measurements.height *
      (numberList.length - 1)
    );
    translationSharedValue.value = withTiming(0, { duration: 1e3 }, () => {
      runOnJS(targetReached)();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberList]);

  const barAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translationSharedValue.value }],
    width: measurements.width,
    // opacity: coverDigitShowingSharedValue.value ? 0 : 255,
    // zIndex: coverDigitShowingSharedValue.value ? -1 : 1,
    // zIndex: 6,
  }));

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
      <Animated.View key={'bar'} style={barAnimatedStyle}>
        {numberList.map((i, index) => (
          <View
            key={i + 'bar' + index}
            style={{
              height: measurements.height,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'red',
              borderWidth: 0,
            }}
          >
            <Text style={textStyle}>{i}</Text>
          </View>
        ))}
      </Animated.View>

      {/* <Animated.View key={'cover-digit'} style={coverDigitAnimatedStyle}>
        <Text style={textStyle}>{source}</Text>
      </Animated.View> */}
    </View>
  );
};
