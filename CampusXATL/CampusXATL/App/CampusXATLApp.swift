import SwiftUI
import SwiftData

@main
struct CampusXATLApp: App {
    @StateObject private var authService = AuthService()
    @StateObject private var analyticsService = AnalyticsService.shared
    @StateObject private var appState = AppState()
    @StateObject private var entitlementManager = EntitlementManager.shared
    @StateObject private var listingService = ListingService()
    @StateObject private var messagingService = MessagingService()
    @StateObject private var savedService = SavedService()
    @StateObject private var appSettings = AppSettings.shared

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(authService)
                .environmentObject(analyticsService)
                .environmentObject(appState)
                .environmentObject(entitlementManager)
                .environmentObject(listingService)
                .environmentObject(messagingService)
                .environmentObject(savedService)
                .environmentObject(appSettings)
                .modelContainer(AppPersistence.shared.container)
                .onAppear {
                    let context = AppPersistence.shared.container.mainContext
                    authService.configure(with: context)
                    listingService.configure(with: context)
                    messagingService.configure(with: context)
                    savedService.configure(with: context)
                }
        }
    }
}
