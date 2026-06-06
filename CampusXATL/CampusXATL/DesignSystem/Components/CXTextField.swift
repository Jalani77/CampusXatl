import SwiftUI

struct CXTextField: View {
    let label: String
    let placeholder: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default
    var isSecure: Bool = false
    var autoCapitalization: TextInputAutocapitalization = .sentences
    var errorMessage: String? = nil

    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.xxs) {
            Text(label)
                .font(.cxSubheadlineSemibold)
                .foregroundStyle(Color.cxPrimary)

            Group {
                if isSecure {
                    SecureField(placeholder, text: $text)
                } else {
                    TextField(placeholder, text: $text)
                        .keyboardType(keyboardType)
                        .textInputAutocapitalization(autoCapitalization)
                }
            }
            .font(.cxBody)
            .padding(.horizontal, Spacing.md)
            .padding(.vertical, Spacing.sm)
            .background(Color.cxSurface)
            .cornerRadius(CornerRadius.sm)
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.sm)
                    .strokeBorder(
                        isFocused ? Color.cxTeal : (errorMessage != nil ? Color.cxDestructive : Color.cxBorder),
                        lineWidth: isFocused ? 1.5 : 1
                    )
            )
            .focused($isFocused)

            if let error = errorMessage {
                Text(error)
                    .font(.cxCaption)
                    .foregroundStyle(Color.cxDestructive)
            }
        }
    }
}
