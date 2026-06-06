import SwiftUI

struct ListingCard: View {
    let listing: Listing
    var onTap: (() -> Void)? = nil

    var body: some View {
        Button {
            onTap?()
        } label: {
            VStack(alignment: .leading, spacing: 0) {
                // Image area
                ZStack {
                    Color.cxSurface
                    if let data = listing.imageData.first, let uiImage = UIImage(data: data) {
                        Image(uiImage: uiImage)
                            .resizable()
                            .scaledToFill()
                    } else {
                        Image(systemName: listing.categoryEnum.icon)
                            .font(.system(size: 32))
                            .foregroundStyle(Color.cxTeal.opacity(0.4))
                    }
                }
                .aspectRatio(1, contentMode: .fill)
                .clipped()

                VStack(alignment: .leading, spacing: Spacing.xxs) {
                    Text(listing.title)
                        .font(.cxSubheadlineSemibold)
                        .foregroundStyle(Color.cxPrimary)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)

                    Text(listing.formattedPrice)
                        .font(.cxBodySemibold)
                        .foregroundStyle(Color.cxTeal)

                    HStack {
                        CXBadge(
                            text: listing.categoryEnum.rawValue,
                            icon: listing.categoryEnum.icon
                        )
                        Spacer()
                    }

                    Text(listing.sellerName)
                        .font(.cxCaption)
                        .foregroundStyle(Color.cxSecondary)
                        .lineLimit(1)
                }
                .padding(Spacing.xs)
            }
            .background(Color.cxBackground)
            .cornerRadius(CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.md)
                    .strokeBorder(Color.cxBorder, lineWidth: 0.5)
            )
        }
        .buttonStyle(.plain)
    }
}
