import Foundation
import SwiftUI

@MainActor
final class AppState: ObservableObject {
    @Published var selectedTab: Int = 0
    @Published var showCreateListing: Bool = false
    @Published var showPaywall: Bool = false
    @Published var paywallTrigger: String = ""

    func presentPaywall(trigger: String) {
        paywallTrigger = trigger
        showPaywall = true
    }

    func switchToTab(_ index: Int) {
        selectedTab = index
    }
}
