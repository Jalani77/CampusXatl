import Foundation
import StoreKit

@MainActor
final class SubscriptionManager: ObservableObject {
    static let shared = SubscriptionManager()

    @Published var products: [Product] = []
    @Published var isPurchasing: Bool = false
    @Published var purchaseError: String? = nil

    // Product IDs — configure in StoreKit configuration or App Store Connect
    enum ProductID {
        static let campusPlus = "com.campusxatl.app.campusplus.monthly"
        static let campusPro = "com.campusxatl.app.campuspro.monthly"
    }

    private init() {}

    func loadProducts() async {
        do {
            let fetched = try await Product.products(for: [ProductID.campusPlus, ProductID.campusPro])
            self.products = fetched.sorted { $0.price < $1.price }
        } catch {
            print("[SubscriptionManager] Failed to load products: \(error)")
        }
    }

    func purchase(_ product: Product) async {
        isPurchasing = true
        purchaseError = nil
        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                switch verification {
                case .verified(let transaction):
                    await transaction.finish()
                    applyEntitlement(for: product.id)
                case .unverified:
                    purchaseError = "Purchase could not be verified."
                }
            case .userCancelled:
                break
            case .pending:
                break
            @unknown default:
                break
            }
        } catch {
            purchaseError = error.localizedDescription
        }
        isPurchasing = false
    }

    func restorePurchases() async {
        do {
            try await AppStore.sync()
            await checkCurrentEntitlements()
        } catch {
            purchaseError = error.localizedDescription
        }
    }

    func checkCurrentEntitlements() async {
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result {
                applyEntitlement(for: transaction.productID)
            }
        }
    }

    private func applyEntitlement(for productID: String) {
        switch productID {
        case ProductID.campusPlus:
            EntitlementManager.shared.setTier(.paid)
        case ProductID.campusPro:
            EntitlementManager.shared.setTier(.premium)
        default:
            break
        }
    }
}
