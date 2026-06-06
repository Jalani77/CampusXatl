import SwiftUI

struct SubscriptionView: View {
    @EnvironmentObject var entitlementManager: EntitlementManager
    @Environment(\.dismiss) var dismiss

    var body: some View {
        PaywallView(trigger: "settings")
    }
}
