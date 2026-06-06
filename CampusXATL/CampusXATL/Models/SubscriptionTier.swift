import Foundation

enum SubscriptionTier: String, Codable, CaseIterable {
    case free = "Free"
    case paid = "Campus+"
    case premium = "Campus Pro"

    var listingLimit: Int {
        switch self {
        case .free: return 3
        case .paid: return 15
        case .premium: return Int.max
        }
    }

    var canBoostListings: Bool {
        switch self {
        case .free: return false
        case .paid, .premium: return true
        }
    }

    var canMessageFirst: Bool { true }

    var monthlyPrice: String {
        switch self {
        case .free: return "Free"
        case .paid: return "$4.99/mo"
        case .premium: return "$9.99/mo"
        }
    }

    var features: [String] {
        switch self {
        case .free:
            return ["Up to 3 active listings", "Browse & search", "Messaging"]
        case .paid:
            return ["Up to 15 active listings", "Boost 2 listings/month", "Priority search placement", "Everything in Free"]
        case .premium:
            return ["Unlimited listings", "Unlimited boosts", "Featured seller badge", "Analytics dashboard", "Everything in Campus+"]
        }
    }
}
