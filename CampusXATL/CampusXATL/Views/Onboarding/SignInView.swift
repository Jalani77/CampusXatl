import SwiftUI

struct SignInView: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss

    @State private var email = ""
    @State private var password = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Spacing.lg) {
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("Welcome back")
                            .font(.cxTitle2)
                            .foregroundStyle(Color.cxPrimary)
                        Text("Sign in to your account.")
                            .font(.cxBody)
                            .foregroundStyle(Color.cxSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    VStack(spacing: Spacing.md) {
                        CXTextField(label: "Email", placeholder: "you@school.edu", text: $email, keyboardType: .emailAddress, autoCapitalization: .never)
                        CXTextField(label: "Password", placeholder: "Your password", text: $password, isSecure: true)
                    }

                    if let error = authService.authError {
                        Text(error)
                            .font(.cxCaption)
                            .foregroundStyle(Color.cxDestructive)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    CXButton(title: "Sign In", style: .primary, isLoading: authService.isLoading) {
                        Task { await attemptSignIn() }
                    }
                }
                .padding(Spacing.lg)
            }
            .navigationTitle("Sign In")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(Color.cxTeal)
                }
            }
        }
    }

    private func attemptSignIn() async {
        let success = await authService.signIn(email: email, password: password)
        if success { dismiss() }
    }
}
