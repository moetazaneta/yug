import ExpoModulesCore
import UIKit

class ClearLiquidGlassView: ExpoView {
  private let cornerRadius: CGFloat = 20
  private let backdrop: UIVisualEffectView

  required init(appContext: AppContext? = nil) {
    if #available(iOS 26.0, *) {
      let effect = UIGlassEffect(style: .clear)
      backdrop = UIVisualEffectView(effect: effect)
      // if let vfxSubView = backdrop.subviews.first(where: {
      //   String(describing: type(of: $0)) == "_UIVisualEffectSubview"
      // }) {
      //   vfxSubView.backgroundColor = UIColor.white.withAlphaComponent(0.01)
      // }

      backdrop.subviews.forEach { subview in
        subview.backgroundColor = UIColor.white.withAlphaComponent(0.1)
      }
      // backdrop.cornerConfiguration = .capsule()
    } else {
      backdrop = UIVisualEffectView(effect: UIBlurEffect(style: .systemUltraThinMaterial))
      backdrop.layer.cornerRadius = cornerRadius
      backdrop.layer.cornerCurve = .continuous
      backdrop.clipsToBounds = true
    }

    super.init(appContext: appContext)

    backdrop.frame = bounds
    backdrop.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    addSubview(backdrop)
  }

  override func didAddSubview(_ subview: UIView) {
    super.didAddSubview(subview)
    if subview !== backdrop {
      sendSubviewToBack(backdrop)
    }
  }
}
