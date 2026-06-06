import SwiftUI

struct SignUpView: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss

    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var school = ""
    @State private var graduationYear = Calendar.current.component(.year, from: Date()) + 2
    @State private var nameError: String? = nil
    @State private var emailError: String? = nil
    @State private var passwordError: String? = nil

    private let currentYear = Calendar.current.component(.year, from: Date())

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Spacing.lg) {
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("Create your account")
                            .font(.cxTitle2)
                            .foregroundStyle(Color.cxPrimary)
                        Text("Join your campus marketplace.")
                            .font(.cxBody)
                            .foregroundStyle(Color.cxSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    VStack(spacing: Spacing.md) {
                        CXTextField(label: "Full Name", placeholder: "Jane Smith", text: $name, errorMessage: nameError)
                        CXTextField(label: "Email", placeholder: "you@school.edu", text: $email, keyboardType: .emailAddress, autoCapitalization: .never, errorMessage: emailError)
                        CXTextField(label: "Password", placeholder: "At least 8 characters", text: $password, isSecure: true, errorMessage: passwordError)
                        CXTextField(label: "Confirm Password", placeholder: "Repeat password", text: $confirmPassword, isSecure: true)
                        CXTextField(label: "School / University", placeholder: "Georgia Tech", text: $school)

                        VStack(alignment: .leading, spacing: Spacing.xxs) {
                            Text("Graduation Year")
                                .font(.cxSubheadlineSemibold)
                                .foregroundStyle(Color.cxPrimary)
                            Picker("Graduation Year", selection: $graduationYear) {
                                ForEach(currentYear...(currentYear + 6), id: \.self) { year in
                                    Text(String(year)).tag(year)
                                }
                            }
                            .pickerStyle(.segmented)
                        }
                    }

                    if let error = authService.authError {
                        Text(error)
                            .font(.cxCaption)
                            .foregroundStyle(Color.cxDestructive)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    CXButton(title: "Create Account", style: .primary, isLoading: authService.isLoading) {
                        Task { await attemptSignUp() }
                    }
                }
                .padding(Spacing.lg)
            }
            .navigationTitle("Sign Up")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(Color.cxTeal)
                }
            }
        }
    }

    private func validate() -> Bool {
        nameError = nil
        emailError = nil
        passwordError = nil
        var valid = true

        if name.trimmingCharacters(in: .whitespaces).isEmpty {
            nameError = "Name is required."
            valid = false
        }
        if !email.contains("@") || !email.contains(".") {
            emailError = "Enter a valid email address."
            valid = false
        }
        if password.count < 8 {
            passwordError = "Password must be at least 8 characters."
            valid = false
        } else if password != confirmPassword {
            passwordError = "Passwords do not match."
            valid = false
        }
        return valid
    }

    private func attemptSignUp() async {
        guard validate() else { return }
        let success = await authService.signUp(
            name: name,
            email: email,
            password: password,
            school: school.isEmpty ? "University" : school,
            graduationYear: graduationYear
        )
        if success { dismiss() }
    }
}
