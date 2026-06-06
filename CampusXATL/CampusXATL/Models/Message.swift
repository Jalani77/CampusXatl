import SwiftData
import Foundation

@Model
final class Message {
    @Attribute(.unique) var id: UUID
    var conversationID: UUID
    var senderID: UUID
    var senderName: String
    var text: String
    var sentAt: Date
    var isRead: Bool

    init(conversationID: UUID, senderID: UUID, senderName: String, text: String) {
        self.id = UUID()
        self.conversationID = conversationID
        self.senderID = senderID
        self.senderName = senderName
        self.text = text
        self.sentAt = Date()
        self.isRead = false
    }
}
