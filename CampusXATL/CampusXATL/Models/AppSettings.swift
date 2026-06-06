import Foundation

final class AppSettings: ObservableObject {
    static let shared = AppSettings()

    @Published var pushNotificationsEnabled: Bool {
        didSet { UserDefaults.standard.set(pushNotificationsEnabled, forKey: Keys.pushNotifications) }
    }
    @Published var messageNotificationsEnabled: Bool {
        didSet { UserDefaults.standard.set(messageNotificationsEnabled, forKey: Keys.messageNotifications) }
    }
    @Published var savedListingAlertsEnabled: Bool {
        didSet { UserDefaults.standard.set(savedListingAlertsEnabled, forKey: Keys.savedAlerts) }
    }
    @Published var appearanceMode: String {
        didSet { UserDefaults.standard.set(appearanceMode, forKey: Keys.appearanceMode) }
    }

    private enum Keys {
        static let pushNotifications = "cx_push_notifications"
        static let messageNotifications = "cx_message_notifications"
        static let savedAlerts = "cx_saved_alerts"
        static let appearanceMode = "cx_appearance_mode"
    }

    private init() {
        self.pushNotificationsEnabled = UserDefaults.standard.object(forKey: Keys.pushNotifications) as? Bool ?? true
        self.messageNotificationsEnabled = UserDefaults.standard.object(forKey: Keys.messageNotifications) as? Bool ?? true
        self.savedListingAlertsEnabled = UserDefaults.standard.object(forKey: Keys.savedAlerts) as? Bool ?? false
        self.appearanceMode = UserDefaults.standard.string(forKey: Keys.appearanceMode) ?? "system"
    }
}
