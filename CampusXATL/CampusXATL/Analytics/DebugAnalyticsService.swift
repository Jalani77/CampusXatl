import Foundation

final class DebugAnalyticsService: AnalyticsTracking {
    func track(_ event: AnalyticsEvent) {
        #if DEBUG
        print("[Analytics] Event: \(event.name) | Properties: \(event.properties)")
        #endif
    }

    func identify(userID: String, properties: [String: Any]) {
        #if DEBUG
        print("[Analytics] Identify: \(userID) | \(properties)")
        #endif
    }

    func screen(_ name: String, properties: [String: Any]) {
        #if DEBUG
        print("[Analytics] Screen: \(name) | \(properties)")
        #endif
    }
}
