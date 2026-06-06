import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var appSettings: AppSettings
    @EnvironmentObject var entitlementManager: EntitlementManager
    @State private var showSignOutConfirmation = false
    @State private var showSubscription = false

    var body: some View {
        Form {
            Section("Notifications") {
                Toggle("Push Notifications", isOn: $appSettings.pushNotificationsEnabled)
                    .tint(Color.cxTeal)
                Toggle("Message Notifications", isOn: $appSettings.messageNotificationsEnabled)
                    .tint(Color.cxTeal)
                Toggle("Saved Listing Alerts", isOn: $appSettings.savedListingAlertsEnabled)
                    .tint(Color.cxTeal)
            }

            Section("Subscription") {
                HStack {
                    Text("Current Plan")
                    Spacer()
                    Text(entitlementManager.currentTier.rawValue)
                        .foregroundStyle(Color.cxSecondary)
                }
                Button("Manage Subscription") {
                    showSubscription = true
                }
                .foregroundStyle(Color.cxTeal)
            }

            Section("Account") {
                if let user = authService.currentUser {
                    HStack {
                        Text("Email")
                        Spacer()
                        Text(user.email)
                            .foregroundStyle(Color.cxSecondary)
                            .font(.cxSubheadline)
                    }
                }
                Button("Sign Out") {
                    showSignOutConfirmation = true
                }
                .foregroundStyle(Color.cxDestructive)
            }

            Section("About") {
                HStack {
                    Text("Version")
                    Spacer()
                    Text(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")
                        .foregroundStyle(Color.cxSecondary)
                }
                Link("Privacy Policy", destination: URL(string: "https://campusxatl.com/privacy")!)
                    .foregroundStyle(Color.cxTeal)
                Link("Terms of Service", destination: URL(string: "https://campusxatl.com/terms")!)
                    .foregroundStyle(Color.cxTeal)
            }
        }
        .navigationTitle("Settings")
        .navigationBarTitleDisplayMode(.inline)
        .confirmationDialog("Sign Out", isPresented: $showSignOutConfirmation, titleVisibility: .visible) {
            Button("Sign Out", role: .destructive) {
                authService.signOut()
            }
            Button("Cancel", role: .cancel) {}
        }
        .sheet(isPresented: $showSubscription) {
            SubscriptionView()
        }
    }
}
