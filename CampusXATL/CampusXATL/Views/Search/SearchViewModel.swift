import Foundation
import SwiftUI

@MainActor
final class SearchViewModel: ObservableObject {
    @Published var query: String = ""
    @Published var allListings: [Listing] = []
    @Published var recentSearches: [String] = []
    @Published var selectedCategory: ListingCategory? = nil
    @Published var minPrice: Double? = nil
    @Published var maxPrice: Double? = nil

    private let recentKey = "cx_recent_searches"

    init() {
        loadRecentSearches()
    }

    var results: [Listing] {
        var filtered = allListings
        let q = query.trimmingCharacters(in: .whitespaces).lowercased()
        if !q.isEmpty {
            filtered = filtered.filter {
                $0.title.lowercased().contains(q) ||
                $0.listingDescription.lowercased().contains(q) ||
                $0.categoryEnum.rawValue.lowercased().contains(q)
            }
        }
        if let cat = selectedCategory {
            filtered = filtered.filter { $0.categoryEnum == cat }
        }
        if let min = minPrice {
            filtered = filtered.filter { $0.price >= min }
        }
        if let max = maxPrice {
            filtered = filtered.filter { $0.price <= max }
        }
        return filtered
    }

    var hasFilters: Bool {
        selectedCategory != nil || minPrice != nil || maxPrice != nil
    }

    func load(service: ListingService) {
        allListings = service.fetchActiveListings()
    }

    func commitSearch() {
        let q = query.trimmingCharacters(in: .whitespaces)
        guard !q.isEmpty else { return }
        if !recentSearches.contains(q) {
            recentSearches.insert(q, at: 0)
            if recentSearches.count > 10 { recentSearches = Array(recentSearches.prefix(10)) }
            saveRecentSearches()
        }
    }

    func clearRecentSearches() {
        recentSearches = []
        UserDefaults.standard.removeObject(forKey: recentKey)
    }

    func clearFilters() {
        selectedCategory = nil
        minPrice = nil
        maxPrice = nil
    }

    private func loadRecentSearches() {
        recentSearches = UserDefaults.standard.stringArray(forKey: recentKey) ?? []
    }

    private func saveRecentSearches() {
        UserDefaults.standard.set(recentSearches, forKey: recentKey)
    }
}
