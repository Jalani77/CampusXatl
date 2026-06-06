import SwiftUI

enum CXButtonStyle {
    case primary
    case secondary
    case ghost
    case destructive
}

struct CXButton: View {
    let title: String
    let style: CXButtonStyle
    var icon: String? = nil
    var isLoading: Bool = false
    var isFullWidth: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Spacing.xs) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: foregroundColor))
                        .scaleEffect(0.8)
                } else {
                    if let icon {
                        Image(systemName: icon)
                            .font(.cxSubheadlineSemibold)
                    }
                    Text(title)
                        .font(.cxBodySemibold)
                }
            }
            .frame(maxWidth: isFullWidth ? .infinity : nil)
            .padding(.horizontal, Spacing.lg)
            .padding(.vertical, Spacing.sm)
            .background(backgroundColor)
            .foregroundStyle(foregroundColor)
            .cornerRadius(CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.md)
                    .strokeBorder(borderColor, lineWidth: style == .secondary || style == .ghost ? 1.5 : 0)
            )
        }
        .disabled(isLoading)
    }

    private var backgroundColor: Color {
        switch style {
        case .primary: return .cxTeal
        case .secondary: return .clear
        case .ghost: return .clear
        case .destructive: return .cxDestructive
        }
    }

    private var foregroundColor: Color {
        switch style {
        case .primary: return .white
        case .secondary: return .cxTeal
        case .ghost: return .cxSecondary
        case .destructive: return .white
        }
    }

    private var borderColor: Color {
        switch style {
        case .secondary: return .cxTeal
        case .ghost: return .cxBorder
        default: return .clear
        }
    }
}
