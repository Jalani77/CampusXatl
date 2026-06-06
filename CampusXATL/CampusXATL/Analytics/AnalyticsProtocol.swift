import Foundation

protocol AnalyticsTracking {
    func track(_ event: AnalyticsEvent)
    func identify(userID: String, properties: [String: Any])
    func screen(_ name: String, properties: [String: Any])
}
