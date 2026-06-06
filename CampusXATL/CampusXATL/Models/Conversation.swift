import SwiftData
import Foundation

@Model
final class Conversation {
    @Attribute(.unique) var id: UUID
    var listingID: UUID
    var listingTitle: String
    var listingPrice: String
    var listingImageData: Data?
    var buyerID: UUID
    var buyerName: String
    var sellerID: UUID
    var sellerName: String
    var lastMessageText: String
    var lastMessageDate: Date
    var unreadCount: Int
    var createdAt: Date

    init(
        listingID: UUID,
        listingTitle: String,
        listingPrice: String,
        listingImageData: Data? = nil,
        buyerID: UUID,
        buyerName: String,
        sellerID: UUID,
        sellerName: String
    ) {
        self.id = UUID()
        self.listingID = listingID
        self.listingTitle = listingTitle
        self.listingPrice = listingPrice
        self.listingImageData = listingImageData
        self.buyerID = buyerID
        self.buyerName = buyerName
        self.sellerID = sellerID
        self.sellerName = sellerName
        self.lastMessageText = ""
        self.lastMessageDate = Date()
        self.unreadCount = 0
        self.createdAt = Date()
    }

    func otherPartyName(currentUserID: UUID) -> String {
        currentUserID == buyerID ? sellerName : buyerName
    }

    func otherPartyID(currentUserID: UUID) -> UUID {
        currentUserID == buyerID ? sellerID : buyerID
    }
}
