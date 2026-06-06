import SwiftUI

struct SavedView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var savedService: SavedService
    @EnvironmentObject var listingService: ListingService
    @State private var savedListings: [Listing] = []
    @State private var selectedListing: Listing? = nil

    var body: some View {
        NavigationStack {
            Group {
                if savedListings.isEmpty {
                    EmptyStateView(
                        systemImage: "bookmark",
                        title: "No saved listings",
                        body: "Tap the bookmark on any listing to save it here for later."
                    )
                } else {
                    ScrollView {
                        LazyVGrid(
                            columns: [GridItem(.flexible(), spacing: Spacing.xs), GridItem(.flexible(), spacing: Spacing.xs)],
                            spacing: Spacing.xs
                        ) {
                            ForEach(savedListings) { listing in
                                ListingCard(listing: listing) {
                                    selectedListing = listing
                                }
                            }
                        }
                        .padding(Spacing.md)
                    }
                }
            }
            .navigationTitle("Saved")
            .navigationBarTitleDisplayMode(.large)
            .navigationDestination(item: $selectedListing) { listing in
                ListingDetailView(listing: listing)
            }
        }
        .onAppear { loadSaved() }
    }

    private func loadSaved() {
        guard let user = authService.currentUser else { return }
        let allActive = listingService.fetchActiveListings()
        savedListings = savedService.fetchSavedListings(for: user.id, allListings: allActive)
    }
}
