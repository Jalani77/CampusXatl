import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var entitlementManager: EntitlementManager
    @EnvironmentObject var listingService: ListingService

    var body: some View {
        TabView(selection: $appState.selectedTab) {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house")
                }
                .tag(0)

            SearchView()
                .tabItem {
                    Label("Search", systemImage: "magnifyingglass")
                }
                .tag(1)

            // Sell tab — opens sheet instead of navigating
            Color.clear
                .tabItem {
                    Label("Sell", systemImage: "plus.circle.fill")
                }
                .tag(2)

            SavedView()
                .tabItem {
                    Label("Saved", systemImage: "bookmark")
                }
                .tag(3)

            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.circle")
                }
                .tag(4)
        }
        .accentColor(Color.cxTeal)
        .onChange(of: appState.selectedTab) { _, newTab in
            if newTab == 2 {
                checkAndShowCreate()
                // Reset to previous or home
                appState.selectedTab = 0
            }
        }
        .sheet(isPresented: $appState.showCreateListing) {
            CreateListingView()
        }
        .sheet(isPresented: $appState.showPaywall) {
            PaywallView(trigger: appState.paywallTrigger)
        }
    }

    private func checkAndShowCreate() {
        guard let user = authService.currentUser else { return }
        let count = listingService.fetchActiveListings(for: user.id).count
        if entitlementManager.canCreateListing(currentCount: count) {
            appState.showCreateListing = true
        } else {
            appState.presentPaywall(trigger: "listing_limit_tab")
        }
    }
}
