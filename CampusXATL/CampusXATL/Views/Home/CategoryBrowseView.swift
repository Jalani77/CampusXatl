import SwiftUI

struct CategoryBrowseView: View {
    @Binding var selectedCategory: ListingCategory?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Spacing.xs) {
                // "All" chip
                Button {
                    selectedCategory = nil
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "square.grid.2x2")
                            .font(.system(size: 12))
                        Text("All")
                            .font(.cxSubheadlineSemibold)
                    }
                    .padding(.horizontal, Spacing.sm)
                    .padding(.vertical, Spacing.xs)
                    .background(selectedCategory == nil ? Color.cxTeal : Color.cxSurface)
                    .foregroundStyle(selectedCategory == nil ? Color.white : Color.cxPrimary)
                    .cornerRadius(CornerRadius.full)
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.full)
                            .strokeBorder(selectedCategory == nil ? Color.clear : Color.cxBorder, lineWidth: 0.5)
                    )
                }
                .buttonStyle(.plain)

                ForEach(ListingCategory.allCases, id: \.self) { cat in
                    Button {
                        selectedCategory = selectedCategory == cat ? nil : cat
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: cat.icon)
                                .font(.system(size: 12))
                            Text(cat.rawValue)
                                .font(.cxSubheadlineSemibold)
                        }
                        .padding(.horizontal, Spacing.sm)
                        .padding(.vertical, Spacing.xs)
                        .background(selectedCategory == cat ? Color.cxTeal : Color.cxSurface)
                        .foregroundStyle(selectedCategory == cat ? Color.white : Color.cxPrimary)
                        .cornerRadius(CornerRadius.full)
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.full)
                                .strokeBorder(selectedCategory == cat ? Color.clear : Color.cxBorder, lineWidth: 0.5)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, Spacing.md)
        }
    }
}
