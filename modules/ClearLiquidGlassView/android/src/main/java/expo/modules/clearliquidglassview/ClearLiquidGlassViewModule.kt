package expo.modules.clearliquidglassview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ClearLiquidGlassViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ClearLiquidGlassView")

    View(ClearLiquidGlassView::class) {
    }
  }
}
