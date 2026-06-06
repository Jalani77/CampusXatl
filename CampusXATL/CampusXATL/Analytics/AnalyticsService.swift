import Foundation

@MainActor
final class AnalyticsService: ObservableObject {
    static let shared = AnalyticsService()

    private var providers: [AnalyticsTracking] = []

    private init() {
        #if DEBUG
        providers.append(DebugAnalyticsService())
        #endif
    }

    func register(_ provider: AnalyticsTracking) {
        providers.append(provider)
    }

    func track(_ event: AnalyticsEvent) {
        providers.forEach { $0.track(event) }
    }

    func identify(userID: String, properties: [String: Any] = [:]) {
        providers.forEach { $0.identify(userID: userID, properties: properties) }
    }

    func screen(_ name: String, properties: [String: Any] = [:]) {
        providers.forEach { $0.screen(name, properties: properties) }
    }
}
