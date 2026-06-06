import SwiftUI

struct CXBadge: View {
    let text: String
    var color: Color = .cxTealLight
    var textColor: Color = .cxTeal
    var icon: String? = nil

    var body: some View {
        HStack(spacing: 4) {
            if let icon {
                Image(systemName: icon)
                    .font(.system(size: 10, weight: .semibold))
            }
            Text(text)
                .font(.cxCaption)
                .fontWeight(.semibold)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(color)
        .foregroundStyle(textColor)
        .cornerRadius(CornerRadius.full)
    }
}
