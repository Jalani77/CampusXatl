import Foundation
import SwiftUI

@MainActor
final class HomeViewModel: ObservableObject {
    @Published var listings: [Listing] = []
    @Published var selectedCategory: ListingCategory? = nil

    var filteredListings: [Listing] {
        guard let cat = selectedCategory else { return listings }
        return listings.filter { $0.categoryEnum == cat }
    }

    func loadListings(service: ListingService) {
        listings = service.fetchActiveListings()
    }
}
