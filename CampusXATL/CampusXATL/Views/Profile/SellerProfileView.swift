import SwiftUI

struct SellerProfileView: View {
    let sellerID: UUID
    let sellerName: String
    @EnvironmentObject var listingService: ListingService
    @State private var listings: [Listing] = []
    @State private var selectedListing: Listing? = nil

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.lg) {
                VStack(spacing: Spacing.sm) {
                    AvatarView(name: sellerName, size: 80)
                    Text(sellerName)
                        .font(.cxTitle2)
                    Text("\(listings.count) active listing\(listings.count == 1 ? "" : "s")")
                        .font(.cxSubheadline)
                        .foregroundStyle(Color.cxSecondary)
                }
                .padding(.top, Spacing.lg)

                if listings.isEmpty {
                    EmptyStateView(
                        systemImage: "tag",
                        title: "No active listings",
                        body: "This seller has no active listings right now."
                    )
                    .frame(height: 200)
                } else {
                    LazyVGrid(
                        columns: [GridItem(.flexible(), spacing: Spacing.xs), GridItem(.flexible(), spacing: Spacing.xs)],
                        spacing: Spacing.xs
                    ) {
                        ForEach(listings) { listing in
                            ListingCard(listing: listing) {
                                selectedListing = listing
                            }
                        }
                    }
                    .padding(.horizontal, Spacing.md)
                }
            }
        }
        .navigationTitle(sellerName)
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(item: $selectedListing) { listing in
            ListingDetailView(listing: listing)
        }
        .onAppear {
            listings = listingService.fetchActiveListings(for: sellerID)
        }
    }
}
