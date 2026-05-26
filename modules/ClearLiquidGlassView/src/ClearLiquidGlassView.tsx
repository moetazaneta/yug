import { requireNativeView } from 'expo';
import * as React from 'react';

import { ClearLiquidGlassViewProps } from './ClearLiquidGlassView.types';

const NativeView: React.ComponentType<ClearLiquidGlassViewProps> = requireNativeView('ClearLiquidGlassView');

export default function ClearLiquidGlassView(props: ClearLiquidGlassViewProps) {
  return <NativeView {...props} />;
}
