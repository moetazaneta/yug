import { NativeModule, requireNativeModule } from 'expo';

declare class ClearLiquidGlassViewModule extends NativeModule<{}> {}

export default requireNativeModule<ClearLiquidGlassViewModule>('ClearLiquidGlassView');
