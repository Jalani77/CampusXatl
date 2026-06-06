import Foundation
import SwiftUI

@MainActor
final class EntitlementManager: ObservableObject {
    static let shared = EntitlementManager()

    @Published var currentTier: SubscriptionTier = .free

    private init() {
        if let raw = UserDefaults.standard.string(forKey: "cx_subscription_tier"),
           let tier = SubscriptionTier(rawValue: raw) {
            self.currentTier = tier
        }
    }

    func canCreateListing(currentCount: Int) -> Bool {
        if currentTier == .premium { return true }
        return currentCount < currentTier.listingLimit
    }

    func setTier(_ tier: SubscriptionTier) {
        currentTier = tier
        UserDefaults.standard.set(tier.rawValue, forKey: "cx_subscription_tier")
    }
}
