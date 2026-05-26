import * as React from 'react';

import { ClearLiquidGlassViewProps } from './ClearLiquidGlassView.types';

export default function ClearLiquidGlassView(_props: ClearLiquidGlassViewProps) {
  return (
    <div
      style={{
        backgroundColor: '#aabbcc',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <span>ClearLiquidGlassView - native view</span>
    </div>
  );
}
