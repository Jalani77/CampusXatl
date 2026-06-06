import Foundation

enum AnalyticsEvent {
    // Auth
    case signUpStarted
    case signUpCompleted(school: String)
    case signInCompleted
    case signedOut

    // Onboarding
    case onboardingStepCompleted(step: String)
    case onboardingCompleted

    // Listings
    case listingViewed(id: String, category: String)
    case listingCreated(category: String, price: Double)
    case listingEdited(id: String)
    case listingDeleted(id: String)
    case listingShared(id: String)

    // Search
    case searchPerformed(query: String)
    case filterApplied(category: String?, minPrice: Double?, maxPrice: Double?)

    // Saved
    case listingSaved(id: String)
    case listingUnsaved(id: String)

    // Messaging
    case conversationStarted(listingID: String)
    case messageSent(conversationID: String)

    // Subscription
    case paywallViewed(trigger: String)
    case subscriptionPurchased(tier: String)
    case subscriptionCancelled(tier: String)

    var name: String {
        switch self {
        case .signUpStarted: return "sign_up_started"
        case .signUpCompleted: return "sign_up_completed"
        case .signInCompleted: return "sign_in_completed"
        case .signedOut: return "signed_out"
        case .onboardingStepCompleted: return "onboarding_step_completed"
        case .onboardingCompleted: return "onboarding_completed"
        case .listingViewed: return "listing_viewed"
        case .listingCreated: return "listing_created"
        case .listingEdited: return "listing_edited"
        case .listingDeleted: return "listing_deleted"
        case .listingShared: return "listing_shared"
        case .searchPerformed: return "search_performed"
        case .filterApplied: return "filter_applied"
        case .listingSaved: return "listing_saved"
        case .listingUnsaved: return "listing_unsaved"
        case .conversationStarted: return "conversation_started"
        case .messageSent: return "message_sent"
        case .paywallViewed: return "paywall_viewed"
        case .subscriptionPurchased: return "subscription_purchased"
        case .subscriptionCancelled: return "subscription_cancelled"
        }
    }

    var properties: [String: Any] {
        switch self {
        case .signUpCompleted(let school): return ["school": school]
        case .onboardingStepCompleted(let step): return ["step": step]
        case .listingViewed(let id, let category): return ["listing_id": id, "category": category]
        case .listingCreated(let category, let price): return ["category": category, "price": price]
        case .listingEdited(let id): return ["listing_id": id]
        case .listingDeleted(let id): return ["listing_id": id]
        case .listingShared(let id): return ["listing_id": id]
        case .searchPerformed(let query): return ["query": query]
        case .filterApplied(let cat, let min, let max):
            var p: [String: Any] = [:]
            if let cat { p["category"] = cat }
            if let min { p["min_price"] = min }
            if let max { p["max_price"] = max }
            return p
        case .listingSaved(let id): return ["listing_id": id]
        case .listingUnsaved(let id): return ["listing_id": id]
        case .conversationStarted(let id): return ["listing_id": id]
        case .messageSent(let id): return ["conversation_id": id]
        case .paywallViewed(let trigger): return ["trigger": trigger]
        case .subscriptionPurchased(let tier): return ["tier": tier]
        case .subscriptionCancelled(let tier): return ["tier": tier]
        default: return [:]
        }
    }
}
