import Foundation
import SwiftData

final class AppPersistence {
    static let shared = AppPersistence()

    let container: ModelContainer

    private init() {
        let schema = Schema([
            UserProfile.self,
            Listing.self,
            Conversation.self,
            Message.self,
            SavedListing.self
        ])
        let config = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
        do {
            container = try ModelContainer(for: schema, configurations: [config])
        } catch {
            fatalError("Failed to create ModelContainer: \(error)")
        }
    }
}
