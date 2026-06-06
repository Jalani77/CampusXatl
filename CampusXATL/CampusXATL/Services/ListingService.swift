import Foundation
import SwiftData

@MainActor
final class ListingService: ObservableObject {
    private var modelContext: ModelContext?

    func configure(with context: ModelContext) {
        self.modelContext = context
    }

    func createListing(
        title: String,
        price: Double,
        category: ListingCategory,
        listingType: ListingType,
        description: String,
        condition: ListingCondition?,
        campusArea: String,
        imageData: [Data],
        sellerID: UUID,
        sellerName: String
    ) -> Listing? {
        guard let context = modelContext else { return nil }
        let listing = Listing(
            title: title,
            price: price,
            category: category,
            listingType: listingType,
            description: description,
            condition: condition,
            campusArea: campusArea,
            sellerID: sellerID,
            sellerName: sellerName
        )
        listing.imageData = imageData
        context.insert(listing)
        try? context.save()
        return listing
    }

    func updateListing(
        _ listing: Listing,
        title: String,
        price: Double,
        category: ListingCategory,
        description: String,
        condition: ListingCondition?,
        campusArea: String,
        imageData: [Data]
    ) {
        guard let context = modelContext else { return }
        listing.title = title
        listing.price = price
        listing.category = category.rawValue
        listing.listingDescription = description
        listing.condition = condition?.rawValue
        listing.campusArea = campusArea
        listing.imageData = imageData
        try? context.save()
    }

    func deleteListing(_ listing: Listing) {
        guard let context = modelContext else { return }
        context.delete(listing)
        try? context.save()
    }

    func markAsSold(_ listing: Listing) {
        guard let context = modelContext else { return }
        listing.status = ListingStatus.sold.rawValue
        try? context.save()
    }

    func incrementViewCount(_ listing: Listing) {
        guard let context = modelContext else { return }
        listing.viewCount += 1
        try? context.save()
    }

    func fetchActiveListings() -> [Listing] {
        guard let context = modelContext else { return [] }
        let active = ListingStatus.active.rawValue
        let descriptor = FetchDescriptor<Listing>(
            predicate: #Predicate { $0.status == active },
            sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func fetchListings(for sellerID: UUID) -> [Listing] {
        guard let context = modelContext else { return [] }
        let descriptor = FetchDescriptor<Listing>(
            predicate: #Predicate { $0.sellerID == sellerID },
            sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func fetchActiveListings(for sellerID: UUID) -> [Listing] {
        guard let context = modelContext else { return [] }
        let active = ListingStatus.active.rawValue
        let descriptor = FetchDescriptor<Listing>(
            predicate: #Predicate { $0.sellerID == sellerID && $0.status == active },
            sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }
}
