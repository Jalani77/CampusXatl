import SwiftUI

struct MyListingsView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var listingService: ListingService
    @EnvironmentObject var analyticsService: AnalyticsService
    @State private var listings: [Listing] = []
    @State private var listingToEdit: Listing? = nil
    @State private var showConfirmDelete = false
    @State private var listingToDelete: Listing? = nil

    var body: some View {
        Group {
            if listings.isEmpty {
                EmptyStateView(
                    systemImage: "tag",
                    title: "No listings yet",
                    message: "Your active listings will appear here."
                )
            } else {
                List {
                    ForEach(listings) { listing in
                        HStack(spacing: Spacing.sm) {
                            ZStack {
                                Color.cxSurface
                                if let data = listing.imageData.first, let img = UIImage(data: data) {
                                    Image(uiImage: img)
                                        .resizable()
                                        .scaledToFill()
                                }
                            }
                            .frame(width: 56, height: 56)
                            .cornerRadius(CornerRadius.sm)

                            VStack(alignment: .leading, spacing: 4) {
                                Text(listing.title)
                                    .font(.cxBodySemibold)
                                    .lineLimit(1)
                                Text(listing.formattedPrice)
                                    .font(.cxSubheadline)
                                    .foregroundStyle(Color.cxTeal)
                                Text(listing.statusEnum.rawValue)
                                    .font(.cxCaption)
                                    .foregroundStyle(listing.statusEnum == .active ? Color.cxSuccess : Color.cxSecondary)
                            }
                            Spacer()
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                listingToDelete = listing
                                showConfirmDelete = true
                            } label: {
                                Label("Delete", systemImage: "trash")
                            }
                            Button {
                                listingToEdit = listing
                            } label: {
                                Label("Edit", systemImage: "pencil")
                            }
                            .tint(Color.cxTeal)
                        }
                    }
                }
                .listStyle(.plain)
            }
        }
        .navigationTitle("My Listings")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $listingToEdit) { listing in
            EditListingView(listing: listing)
        }
        .confirmationDialog("Delete Listing", isPresented: $showConfirmDelete, titleVisibility: .visible) {
            Button("Delete", role: .destructive) {
                if let listing = listingToDelete {
                    listingService.deleteListing(listing)
                    analyticsService.track(.listingDeleted(id: listing.id.uuidString))
                    loadListings()
                }
            }
            Button("Cancel", role: .cancel) {}
        }
        .onAppear { loadListings() }
    }

    private func loadListings() {
        guard let user = authService.currentUser else { return }
        listings = listingService.fetchListings(for: user.id)
    }
}
