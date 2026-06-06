import SwiftUI

struct ListingDetailView: View {
    let listing: Listing
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var savedService: SavedService
    @EnvironmentObject var messagingService: MessagingService
    @EnvironmentObject var analyticsService: AnalyticsService
    @State private var isSaved: Bool = false
    @State private var showMessageThread = false
    @State private var conversation: Conversation? = nil
    @State private var currentImageIndex: Int = 0

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                // Image carousel
                if listing.imageData.isEmpty {
                    ZStack {
                        Color.cxSurface
                        Image(systemName: listing.categoryEnum.icon)
                            .font(.system(size: 64))
                            .foregroundStyle(Color.cxTeal.opacity(0.3))
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 300)
                } else {
                    TabView(selection: $currentImageIndex) {
                        ForEach(listing.imageData.indices, id: \.self) { idx in
                            if let uiImage = UIImage(data: listing.imageData[idx]) {
                                Image(uiImage: uiImage)
                                    .resizable()
                                    .scaledToFill()
                                    .clipped()
                                    .tag(idx)
                            }
                        }
                    }
                    .tabViewStyle(.page(indexDisplayMode: listing.imageData.count > 1 ? .always : .never))
                    .frame(height: 300)
                }

                VStack(alignment: .leading, spacing: Spacing.md) {
                    // Title and price
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: Spacing.xxs) {
                            Text(listing.title)
                                .font(.cxTitle2)
                                .foregroundStyle(Color.cxPrimary)

                            Text(listing.formattedPrice)
                                .font(.system(size: 28, weight: .bold))
                                .foregroundStyle(Color.cxTeal)
                        }
                        Spacer()
                        Button {
                            toggleSave()
                        } label: {
                            Image(systemName: isSaved ? "bookmark.fill" : "bookmark")
                                .font(.title2)
                                .foregroundStyle(isSaved ? Color.cxTeal : Color.cxSecondary)
                        }
                        .buttonStyle(.plain)
                    }

                    // Badges
                    HStack(spacing: Spacing.xs) {
                        CXBadge(text: listing.categoryEnum.rawValue, icon: listing.categoryEnum.icon)
                        if let condition = listing.conditionEnum {
                            CXBadge(text: condition.rawValue, color: Color.cxSurface, textColor: Color.cxSecondary)
                        }
                        if !listing.campusArea.isEmpty {
                            CXBadge(text: listing.campusArea, icon: "mappin", color: Color.cxSurface, textColor: Color.cxSecondary)
                        }
                    }

                    Divider()

                    // Description
                    VStack(alignment: .leading, spacing: Spacing.xs) {
                        Text("Description")
                            .font(.cxHeadline)
                            .foregroundStyle(Color.cxPrimary)
                        Text(listing.listingDescription.isEmpty ? "No description provided." : listing.listingDescription)
                            .font(.cxBody)
                            .foregroundStyle(Color.cxSecondary)
                    }

                    Divider()

                    // Seller card
                    VStack(alignment: .leading, spacing: Spacing.sm) {
                        Text("Seller")
                            .font(.cxHeadline)
                            .foregroundStyle(Color.cxPrimary)

                        HStack(spacing: Spacing.sm) {
                            AvatarView(name: listing.sellerName, size: 48)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(listing.sellerName)
                                    .font(.cxBodySemibold)
                                    .foregroundStyle(Color.cxPrimary)
                                Text("Member since \(listing.createdAt.formatted(.dateTime.month().year()))")
                                    .font(.cxCaption)
                                    .foregroundStyle(Color.cxSecondary)
                            }
                            Spacer()
                        }
                    }

                    // Action buttons
                    if let currentUser = authService.currentUser, currentUser.id != listing.sellerID {
                        VStack(spacing: Spacing.sm) {
                            CXButton(title: "Message Seller", style: .primary, icon: "message") {
                                startConversation()
                            }
                            ShareLink(item: "Check out \"\(listing.title)\" for \(listing.formattedPrice) on CampusXATL!") {
                                HStack {
                                    Image(systemName: "square.and.arrow.up")
                                    Text("Share Listing")
                                }
                                .font(.cxBodySemibold)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, Spacing.sm)
                                .background(Color.clear)
                                .foregroundStyle(Color.cxSecondary)
                                .cornerRadius(CornerRadius.md)
                                .overlay(
                                    RoundedRectangle(cornerRadius: CornerRadius.md)
                                        .strokeBorder(Color.cxBorder, lineWidth: 1.5)
                                )
                            }
                        }
                    }

                    // Metadata
                    HStack {
                        Image(systemName: "eye")
                            .font(.cxCaption)
                        Text("\(listing.viewCount) views")
                            .font(.cxCaption)
                        Spacer()
                        Text("Posted \(listing.createdAt.formatted(.relative(presentation: .named)))")
                            .font(.cxCaption)
                    }
                    .foregroundStyle(Color.cxTertiary)
                }
                .padding(Spacing.md)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .navigationTitle(listing.title)
        .background(Color.cxBackground)
        .navigationDestination(item: $conversation) { convo in
            MessageThreadView(conversation: convo)
        }
        .onAppear {
            if let user = authService.currentUser {
                isSaved = savedService.isSaved(listingID: listing.id, userID: user.id)
            }
            analyticsService.track(.listingViewed(id: listing.id.uuidString, category: listing.category))
        }
    }

    private func toggleSave() {
        guard let user = authService.currentUser else { return }
        savedService.toggleSave(listingID: listing.id, userID: user.id)
        isSaved.toggle()
        analyticsService.track(isSaved ? .listingSaved(id: listing.id.uuidString) : .listingUnsaved(id: listing.id.uuidString))
    }

    private func startConversation() {
        guard let user = authService.currentUser else { return }
        if let convo = messagingService.getOrCreateConversation(listing: listing, buyerID: user.id, buyerName: user.name) {
            conversation = convo
        }
    }
}
