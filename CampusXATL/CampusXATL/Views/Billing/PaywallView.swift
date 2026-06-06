import SwiftUI
import StoreKit

struct PaywallView: View {
    let trigger: String
    @EnvironmentObject var entitlementManager: EntitlementManager
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Spacing.lg) {
                    // Header
                    VStack(spacing: Spacing.sm) {
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 48))
                            .foregroundStyle(Color.cxTeal)
                        Text("Upgrade Your Account")
                            .font(.cxTitle1)
                            .multilineTextAlignment(.center)
                        Text("Sell more, reach more buyers, grow your campus hustle.")
                            .font(.cxBody)
                            .foregroundStyle(Color.cxSecondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, Spacing.lg)

                    // Plans
                    VStack(spacing: Spacing.sm) {
                        ForEach(SubscriptionTier.allCases, id: \.self) { tier in
                            PlanCard(
                                tier: tier,
                                isCurrentPlan: entitlementManager.currentTier == tier,
                                product: subscriptionManager.products.first(where: {
                                    tier == .paid ? $0.id.contains("campusplus") : tier == .premium ? $0.id.contains("campuspro") : false
                                })
                            ) {
                                if let product = subscriptionManager.products.first(where: {
                                    tier == .paid ? $0.id.contains("campusplus") : $0.id.contains("campuspro")
                                }) {
                                    Task { await subscriptionManager.purchase(product) }
                                }
                            }
                        }
                    }

                    if let error = subscriptionManager.purchaseError {
                        Text(error)
                            .font(.cxCaption)
                            .foregroundStyle(Color.cxDestructive)
                            .multilineTextAlignment(.center)
                    }

                    Button {
                        Task { await subscriptionManager.restorePurchases() }
                    } label: {
                        Text("Restore Purchases")
                            .font(.cxSubheadline)
                            .foregroundStyle(Color.cxSecondary)
                    }

                    Text("Subscriptions auto-renew monthly. Cancel anytime in Settings.")
                        .font(.cxCaption)
                        .foregroundStyle(Color.cxTertiary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, Spacing.lg)
                }
                .padding(Spacing.md)
            }
            .navigationTitle("Plans")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Not Now") { dismiss() }
                        .foregroundStyle(Color.cxSecondary)
                }
            }
        }
        .task {
            await subscriptionManager.loadProducts()
        }
    }
}

struct PlanCard: View {
    let tier: SubscriptionTier
    let isCurrentPlan: Bool
    let product: Product?
    let onSelect: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(tier.rawValue)
                        .font(.cxBodySemibold)
                        .foregroundStyle(Color.cxPrimary)
                    Text(product?.displayPrice ?? tier.monthlyPrice)
                        .font(.cxTitle3)
                        .foregroundStyle(Color.cxTeal)
                }
                Spacer()
                if isCurrentPlan {
                    CXBadge(text: "Current Plan")
                }
            }

            Divider()

            VStack(alignment: .leading, spacing: Spacing.xxs) {
                ForEach(tier.features, id: \.self) { feature in
                    HStack(spacing: Spacing.xs) {
                        Image(systemName: "checkmark")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(Color.cxTeal)
                        Text(feature)
                            .font(.cxSubheadline)
                            .foregroundStyle(Color.cxSecondary)
                    }
                }
            }

            if !isCurrentPlan && tier != .free {
                CXButton(
                    title: "Choose \(tier.rawValue)",
                    style: .primary
                ) {
                    onSelect()
                }
                .padding(.top, Spacing.xxs)
            }
        }
        .padding(Spacing.md)
        .background(Color.cxBackground)
        .cornerRadius(CornerRadius.md)
        .overlay(
            RoundedRectangle(cornerRadius: CornerRadius.md)
                .strokeBorder(isCurrentPlan ? Color.cxTeal : Color.cxBorder, lineWidth: isCurrentPlan ? 1.5 : 0.5)
        )
    }
}
