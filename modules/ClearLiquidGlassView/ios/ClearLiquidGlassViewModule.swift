import ExpoModulesCore

public class ClearLiquidGlassViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ClearLiquidGlassView")

    View(ClearLiquidGlassView.self) {
    }
  }
}
