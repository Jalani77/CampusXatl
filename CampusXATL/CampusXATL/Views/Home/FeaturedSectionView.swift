import SwiftUI

struct FeaturedSectionView: View {
    let listings: [Listing]
    var onTap: (Listing) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            Text("Recently Added")
                .font(.cxTitle3)
                .foregroundStyle(Color.cxPrimary)
                .padding(.horizontal, Spacing.md)

            if listings.isEmpty {
                EmptyStateView(
                    systemImage: "tag",
                    title: "No listings yet",
                    body: "Be the first to post something for sale on your campus."
                )
                .frame(height: 200)
            } else {
                LazyVGrid(
                    columns: [GridItem(.flexible(), spacing: Spacing.xs), GridItem(.flexible(), spacing: Spacing.xs)],
                    spacing: Spacing.xs
                ) {
                    ForEach(listings) { listing in
                        ListingCard(listing: listing) {
                            onTap(listing)
                        }
                    }
                }
                .padding(.horizontal, Spacing.md)
            }
        }
    }
}
