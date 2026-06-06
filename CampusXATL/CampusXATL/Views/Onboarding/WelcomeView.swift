import SwiftUI

struct WelcomeView: View {
    @Binding var showSignUp: Bool
    @Binding var showSignIn: Bool

    var body: some View {
        VStack(spacing: 0) {
            Spacer()

            VStack(spacing: Spacing.sm) {
                Image(systemName: "storefront")
                    .font(.system(size: 64, weight: .light))
                    .foregroundStyle(Color.cxTeal)

                Text("CampusXATL")
                    .font(.system(size: 36, weight: .bold, design: .default))
                    .foregroundStyle(Color.cxPrimary)

                Text("Your campus. Your marketplace.")
                    .font(.cxBody)
                    .foregroundStyle(Color.cxSecondary)
                    .multilineTextAlignment(.center)
            }

            Spacer()

            VStack(spacing: Spacing.sm) {
                CXButton(title: "Create Account", style: .primary) {
                    showSignUp = true
                }

                CXButton(title: "Sign In", style: .secondary) {
                    showSignIn = true
                }

                Text("By continuing you agree to our Terms of Service and Privacy Policy.")
                    .font(.cxCaption)
                    .foregroundStyle(Color.cxTertiary)
                    .multilineTextAlignment(.center)
                    .padding(.top, Spacing.xs)
            }
            .padding(.horizontal, Spacing.lg)
            .padding(.bottom, Spacing.xxl)
        }
        .background(Color.cxBackground)
    }
}
