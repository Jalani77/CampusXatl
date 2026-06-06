import SwiftUI

struct CXCard<Content: View>: View {
    var padding: CGFloat = Spacing.md
    @ViewBuilder let content: Content

    var body: some View {
        content
            .padding(padding)
            .background(Color.cxBackground)
            .cornerRadius(CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.md)
                    .strokeBorder(Color.cxBorder, lineWidth: 0.5)
            )
    }
}
