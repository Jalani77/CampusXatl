import SwiftUI

struct MessageThreadView: View {
    let conversation: Conversation
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var messagingService: MessagingService
    @EnvironmentObject var analyticsService: AnalyticsService
    @StateObject private var viewModel: MessageViewModel

    init(conversation: Conversation) {
        self.conversation = conversation
        _viewModel = StateObject(wrappedValue: MessageViewModel(conversation: conversation))
    }

    var body: some View {
        VStack(spacing: 0) {
            // Listing header
            HStack(spacing: Spacing.sm) {
                ZStack {
                    Color.cxSurface
                    if let data = conversation.listingImageData, let img = UIImage(data: data) {
                        Image(uiImage: img)
                            .resizable()
                            .scaledToFill()
                    }
                }
                .frame(width: 44, height: 44)
                .cornerRadius(CornerRadius.sm)

                VStack(alignment: .leading, spacing: 2) {
                    Text(conversation.listingTitle)
                        .font(.cxSubheadlineSemibold)
                        .lineLimit(1)
                    Text(conversation.listingPrice)
                        .font(.cxCaption)
                        .foregroundStyle(Color.cxTeal)
                }
                Spacer()
            }
            .padding(Spacing.md)
            .background(Color.cxSurface)

            Divider()

            // Messages
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: Spacing.xs) {
                        ForEach(viewModel.messages) { message in
                            MessageBubble(
                                message: message,
                                isFromCurrentUser: message.senderID == authService.currentUser?.id
                            )
                            .id(message.id)
                        }
                    }
                    .padding(Spacing.md)
                }
                .onChange(of: viewModel.messages.count) { _, _ in
                    if let last = viewModel.messages.last {
                        withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                    }
                }
            }

            Divider()

            // Input bar
            HStack(spacing: Spacing.sm) {
                TextField("Type a message…", text: $viewModel.messageText, axis: .vertical)
                    .lineLimit(4)
                    .padding(.horizontal, Spacing.sm)
                    .padding(.vertical, Spacing.xs)
                    .background(Color.cxSurface)
                    .cornerRadius(CornerRadius.full)
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.full)
                            .strokeBorder(Color.cxBorder, lineWidth: 1)
                    )

                Button {
                    guard let user = authService.currentUser else { return }
                    viewModel.sendMessage(senderID: user.id, senderName: user.name, service: messagingService, analyticsService: analyticsService)
                } label: {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 32))
                        .foregroundStyle(viewModel.messageText.trimmingCharacters(in: .whitespaces).isEmpty ? Color.cxTertiary : Color.cxTeal)
                }
                .disabled(viewModel.messageText.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding(.horizontal, Spacing.md)
            .padding(.vertical, Spacing.sm)
        }
        .navigationTitle(conversation.otherPartyName(currentUserID: authService.currentUser?.id ?? UUID()))
        .navigationBarTitleDisplayMode(.inline)
        .background(Color.cxBackground)
        .onAppear {
            viewModel.loadMessages(service: messagingService)
            messagingService.markConversationRead(conversation)
        }
    }
}

struct MessageBubble: View {
    let message: Message
    let isFromCurrentUser: Bool

    var body: some View {
        HStack {
            if isFromCurrentUser { Spacer(minLength: 60) }

            VStack(alignment: isFromCurrentUser ? .trailing : .leading, spacing: 2) {
                Text(message.text)
                    .font(.cxBody)
                    .foregroundStyle(isFromCurrentUser ? Color.white : Color.cxPrimary)
                    .padding(.horizontal, Spacing.sm)
                    .padding(.vertical, Spacing.xs)
                    .background(isFromCurrentUser ? Color.cxTeal : Color.cxSurface)
                    .cornerRadius(CornerRadius.md)

                Text(message.sentAt.formatted(.dateTime.hour().minute()))
                    .font(.cxCaption2)
                    .foregroundStyle(Color.cxTertiary)
            }

            if !isFromCurrentUser { Spacer(minLength: 60) }
        }
    }
}
