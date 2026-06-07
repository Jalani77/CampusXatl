import SwiftUI

struct EmptyStateView: View {
    let systemImage: String
    let title: String
    let message: String
    var ctaTitle: String? = nil
    var ctaAction: (() -> Void)? = nil

    var body: some View {
        VStack(spacing: Spacing.lg) {
            Image(systemName: systemImage)
                .font(.system(size: 56))
                .foregroundStyle(Color.cxTeal.opacity(0.6))

            VStack(spacing: Spacing.xs) {
                Text(title)
                    .font(.cxTitle3)
                    .foregroundStyle(Color.cxPrimary)
                    .multilineTextAlignment(.center)

                Text(message)
                    .font(.cxBody)
                    .foregroundStyle(Color.cxSecondary)
                    .multilineTextAlignment(.center)
            }

            if let ctaTitle, let ctaAction {
                CXButton(title: ctaTitle, style: .primary, isFullWidth: false, action: ctaAction)
                    .padding(.top, Spacing.xs)
            }
        }
        .padding(Spacing.xl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
