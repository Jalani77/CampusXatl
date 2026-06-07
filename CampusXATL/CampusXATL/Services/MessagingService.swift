import Foundation
import SwiftData

@MainActor
final class MessagingService: ObservableObject {
    private var modelContext: ModelContext?

    func configure(with context: ModelContext) {
        self.modelContext = context
    }

    func getOrCreateConversation(
        listing: Listing,
        buyerID: UUID,
        buyerName: String
    ) -> Conversation? {
        guard let context = modelContext else { return nil }
        // Check for existing conversation
        let listingID = listing.id
        let descriptor = FetchDescriptor<Conversation>(
            predicate: #Predicate { $0.listingID == listingID && $0.buyerID == buyerID }
        )
        if let existing = try? context.fetch(descriptor).first {
            return existing
        }
        let conversation = Conversation(
            listingID: listing.id,
            listingTitle: listing.title,
            listingPrice: listing.formattedPrice,
            listingImageData: listing.imageData.first,
            buyerID: buyerID,
            buyerName: buyerName,
            sellerID: listing.sellerID,
            sellerName: listing.sellerName
        )
        context.insert(conversation)
        try? context.save()
        return conversation
    }

    func sendMessage(text: String, conversationID: UUID, senderID: UUID, senderName: String) -> Message? {
        guard let context = modelContext else { return nil }
        let message = Message(conversationID: conversationID, senderID: senderID, senderName: senderName, text: text)
        context.insert(message)

        // Update conversation last message
        let descriptor = FetchDescriptor<Conversation>(predicate: #Predicate { $0.id == conversationID })
        if let convo = try? context.fetch(descriptor).first {
            convo.lastMessageText = text
            convo.lastMessageDate = Date()
        }
        try? context.save()
        return message
    }

    func fetchMessages(for conversationID: UUID) -> [Message] {
        guard let context = modelContext else { return [] }
        let descriptor = FetchDescriptor<Message>(
            predicate: #Predicate { $0.conversationID == conversationID },
            sortBy: [SortDescriptor(\.sentAt, order: .forward)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func fetchConversations(for userID: UUID) -> [Conversation] {
        guard let context = modelContext else { return [] }
        let descriptor = FetchDescriptor<Conversation>(
            predicate: #Predicate { $0.buyerID == userID || $0.sellerID == userID },
            sortBy: [SortDescriptor(\.lastMessageDate, order: .reverse)]
        )
        return (try? context.fetch(descriptor)) ?? []
    }

    func markConversationRead(_ conversation: Conversation) {
        guard let context = modelContext else { return }
        conversation.unreadCount = 0
        // Mark messages read
        let targetID: UUID = conversation.id
        let descriptor = FetchDescriptor<Message>(
            predicate: #Predicate<Message> { $0.conversationID == targetID && $0.isRead == false }
        )
        if let msgs = try? context.fetch(descriptor) {
            msgs.forEach { $0.isRead = true }
        }
        try? context.save()
    }
}
