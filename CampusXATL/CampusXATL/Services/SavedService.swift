import Foundation
import SwiftData

@MainActor
final class SavedService: ObservableObject {
    private var modelContext: ModelContext?

    func configure(with context: ModelContext) {
        self.modelContext = context
    }

    func isSaved(listingID: UUID, userID: UUID) -> Bool {
        guard let context = modelContext else { return false }
        let descriptor = FetchDescriptor<SavedListing>(
            predicate: #Predicate { $0.listingID == listingID && $0.userID == userID }
        )
        return (try? context.fetch(descriptor).count) ?? 0 > 0
    }

    func toggleSave(listingID: UUID, userID: UUID) {
        guard let context = modelContext else { return }
        let descriptor = FetchDescriptor<SavedListing>(
            predicate: #Predicate { $0.listingID == listingID && $0.userID == userID }
        )
        if let existing = try? context.fetch(descriptor).first {
            context.delete(existing)
        } else {
            let saved = SavedListing(userID: userID, listingID: listingID)
            context.insert(saved)
        }
        try? context.save()
    }

    func fetchSavedListingIDs(for userID: UUID) -> Set<UUID> {
        guard let context = modelContext else { return [] }
        let descriptor = FetchDescriptor<SavedListing>(
            predicate: #Predicate { $0.userID == userID }
        )
        let items = (try? context.fetch(descriptor)) ?? []
        return Set(items.map { $0.listingID })
    }

    func fetchSavedListings(for userID: UUID, allListings: [Listing]) -> [Listing] {
        let savedIDs = fetchSavedListingIDs(for: userID)
        return allListings.filter { savedIDs.contains($0.id) }
    }
}
