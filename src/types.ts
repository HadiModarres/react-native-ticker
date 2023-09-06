import type {
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

export type AnimationConfig =
  | { type: 'timing'; animationConfig: WithTimingConfig }
  | { type: 'spring'; animationConfig: WithSpringConfig };

export type CellMeasurements = {
  cellWidth: number;
  cellHeight: number;
};
