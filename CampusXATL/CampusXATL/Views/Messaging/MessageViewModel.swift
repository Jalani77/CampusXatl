import Foundation
import SwiftUI

@MainActor
final class MessageViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var messageText: String = ""
    @Published var isSending: Bool = false

    let conversation: Conversation

    init(conversation: Conversation) {
        self.conversation = conversation
    }

    func loadMessages(service: MessagingService) {
        messages = service.fetchMessages(for: conversation.id)
    }

    func sendMessage(senderID: UUID, senderName: String, service: MessagingService, analyticsService: AnalyticsService) {
        let text = messageText.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return }
        isSending = true
        if let msg = service.sendMessage(text: text, conversationID: conversation.id, senderID: senderID, senderName: senderName) {
            messages.append(msg)
            analyticsService.track(.messageSent(conversationID: conversation.id.uuidString))
        }
        messageText = ""
        isSending = false
    }
}
