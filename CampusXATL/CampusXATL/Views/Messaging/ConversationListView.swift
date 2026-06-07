import SwiftUI

struct ConversationListView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var messagingService: MessagingService
    @State private var conversations: [Conversation] = []
    @State private var selectedConversation: Conversation? = nil

    var body: some View {
        NavigationStack {
            Group {
                if conversations.isEmpty {
                    EmptyStateView(
                        systemImage: "message",
                        title: "No messages yet",
                        message: "When you message a seller or someone contacts you, conversations will appear here."
                    )
                } else {
                    List(conversations) { conversation in
                        Button {
                            selectedConversation = conversation
                        } label: {
                            ConversationRow(
                                conversation: conversation,
                                currentUserID: authService.currentUser?.id ?? UUID()
                            )
                        }
                        .buttonStyle(.plain)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Messages")
            .navigationBarTitleDisplayMode(.large)
            .navigationDestination(item: $selectedConversation) { convo in
                MessageThreadView(conversation: convo)
            }
        }
        .onAppear { loadConversations() }
    }

    private func loadConversations() {
        guard let user = authService.currentUser else { return }
        conversations = messagingService.fetchConversations(for: user.id)
    }
}

struct ConversationRow: View {
    let conversation: Conversation
    let currentUserID: UUID

    var body: some View {
        HStack(spacing: Spacing.sm) {
            ZStack {
                Color.cxSurface
                if let data = conversation.listingImageData, let img = UIImage(data: data) {
                    Image(uiImage: img)
                        .resizable()
                        .scaledToFill()
                }
            }
            .frame(width: 52, height: 52)
            .cornerRadius(CornerRadius.sm)
            .overlay(alignment: .topTrailing) {
                if conversation.unreadCount > 0 {
                    ZStack {
                        Circle().fill(Color.cxTeal)
                        Text("\(min(conversation.unreadCount, 9))")
                            .font(.cxCaption2)
                            .foregroundStyle(.white)
                    }
                    .frame(width: 18, height: 18)
                    .offset(x: 4, y: -4)
                }
            }

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(conversation.otherPartyName(currentUserID: currentUserID))
                        .font(.cxBodySemibold)
                        .lineLimit(1)
                    Spacer()
                    Text(conversation.lastMessageDate.formatted(.relative(presentation: .named)))
                        .font(.cxCaption)
                        .foregroundStyle(Color.cxTertiary)
                }

                Text(conversation.listingTitle)
                    .font(.cxCaption)
                    .foregroundStyle(Color.cxTeal)
                    .lineLimit(1)

                Text(conversation.lastMessageText.isEmpty ? "Start a conversation" : conversation.lastMessageText)
                    .font(.cxSubheadline)
                    .foregroundStyle(Color.cxSecondary)
                    .lineLimit(1)
            }
        }
        .padding(.vertical, Spacing.xxs)
    }
}
