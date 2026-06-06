import SwiftUI

struct HomeView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var listingService: ListingService
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = HomeViewModel()
    @State private var selectedListing: Listing? = nil
    @State private var path = NavigationPath()

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        if hour < 12 { return "Good morning" }
        else if hour < 17 { return "Good afternoon" }
        else { return "Good evening" }
    }

    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(alignment: .leading, spacing: Spacing.lg) {
                    // Header
                    VStack(alignment: .leading, spacing: Spacing.xxs) {
                        if let user = authService.currentUser {
                            Text("\(greeting), \(user.name.components(separatedBy: " ").first ?? user.name)")
                                .font(.cxLargeTitle)
                                .foregroundStyle(Color.cxPrimary)
                        } else {
                            Text("Explore")
                                .font(.cxLargeTitle)
                                .foregroundStyle(Color.cxPrimary)
                        }
                        Text("Find what your campus has to offer")
                            .font(.cxBody)
                            .foregroundStyle(Color.cxSecondary)
                    }
                    .padding(.horizontal, Spacing.md)
                    .padding(.top, Spacing.xs)

                    CategoryBrowseView(selectedCategory: $viewModel.selectedCategory)

                    FeaturedSectionView(listings: viewModel.filteredListings) { listing in
                        selectedListing = listing
                    }
                }
                .padding(.bottom, Spacing.xxl)
            }
            .background(Color.cxBackground)
            .navigationDestination(item: $selectedListing) { listing in
                ListingDetailView(listing: listing)
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        appState.switchToTab(1)
                    } label: {
                        Image(systemName: "magnifyingglass")
                            .foregroundStyle(Color.cxTeal)
                    }
                }
            }
        }
        .onAppear {
            viewModel.loadListings(service: listingService)
        }
    }
}
