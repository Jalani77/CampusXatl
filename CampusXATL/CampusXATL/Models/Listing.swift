import SwiftData
import Foundation

enum ListingCategory: String, Codable, CaseIterable {
    case textbooks = "Textbooks"
    case electronics = "Electronics"
    case furniture = "Furniture"
    case clothing = "Clothing"
    case services = "Services"
    case housing = "Housing"
    case tutoring = "Tutoring"
    case other = "Other"

    var icon: String {
        switch self {
        case .textbooks: return "book.closed"
        case .electronics: return "laptopcomputer"
        case .furniture: return "sofa"
        case .clothing: return "tshirt"
        case .services: return "wrench.and.screwdriver"
        case .housing: return "house"
        case .tutoring: return "graduationcap"
        case .other: return "square.grid.2x2"
        }
    }
}

enum ListingType: String, Codable, CaseIterable {
    case item = "Item"
    case service = "Service"
}

enum ListingCondition: String, Codable, CaseIterable {
    case new = "New"
    case likeNew = "Like New"
    case good = "Good"
    case fair = "Fair"
    case poor = "Poor"
}

enum ListingStatus: String, Codable {
    case active = "Active"
    case sold = "Sold"
    case archived = "Archived"
}

@Model
final class Listing {
    @Attribute(.unique) var id: UUID
    var title: String
    var price: Double
    var category: String
    var listingType: String
    var listingDescription: String
    var condition: String?
    var campusArea: String
    var imageData: [Data]
    var sellerID: UUID
    var sellerName: String
    var status: String
    var createdAt: Date
    var viewCount: Int

    init(
        title: String,
        price: Double,
        category: ListingCategory,
        listingType: ListingType,
        description: String,
        condition: ListingCondition? = nil,
        campusArea: String,
        sellerID: UUID,
        sellerName: String
    ) {
        self.id = UUID()
        self.title = title
        self.price = price
        self.category = category.rawValue
        self.listingType = listingType.rawValue
        self.listingDescription = description
        self.condition = condition?.rawValue
        self.campusArea = campusArea
        self.imageData = []
        self.sellerID = sellerID
        self.sellerName = sellerName
        self.status = ListingStatus.active.rawValue
        self.createdAt = Date()
        self.viewCount = 0
    }

    var categoryEnum: ListingCategory { ListingCategory(rawValue: category) ?? .other }
    var typeEnum: ListingType { ListingType(rawValue: listingType) ?? .item }
    var statusEnum: ListingStatus { ListingStatus(rawValue: status) ?? .active }
    var conditionEnum: ListingCondition? { condition.flatMap { ListingCondition(rawValue: $0) } }

    var formattedPrice: String {
        if typeEnum == .service {
            return "$\(String(format: "%.0f", price))/hr"
        }
        return "$\(String(format: "%.2f", price))"
    }
}
