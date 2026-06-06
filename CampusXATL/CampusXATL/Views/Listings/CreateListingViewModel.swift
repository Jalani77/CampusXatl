import Foundation
import SwiftUI
import PhotosUI

enum CreateListingStep: Int, CaseIterable {
    case type = 0
    case category = 1
    case details = 2
    case pricing = 3
    case photos = 4
    case location = 5
    case preview = 6
}

@MainActor
final class CreateListingViewModel: ObservableObject {
    @Published var currentStep: CreateListingStep = .type

    // Form fields
    @Published var listingType: ListingType = .item
    @Published var category: ListingCategory = .other
    @Published var title: String = ""
    @Published var description: String = ""
    @Published var condition: ListingCondition = .good
    @Published var priceText: String = ""
    @Published var campusArea: String = ""
    @Published var selectedPhotoItems: [PhotosPickerItem] = []
    @Published var imageDataList: [Data] = []
    @Published var isPublishing: Bool = false
    @Published var publishError: String? = nil

    var price: Double { Double(priceText) ?? 0 }

    var stepProgress: Double {
        Double(currentStep.rawValue + 1) / Double(CreateListingStep.allCases.count)
    }

    var canAdvance: Bool {
        switch currentStep {
        case .type: return true
        case .category: return true
        case .details: return !title.trimmingCharacters(in: .whitespaces).isEmpty
        case .pricing: return price > 0
        case .photos: return true
        case .location: return true
        case .preview: return true
        }
    }

    func advance() {
        guard let next = CreateListingStep(rawValue: currentStep.rawValue + 1) else { return }
        currentStep = next
    }

    func back() {
        guard let prev = CreateListingStep(rawValue: currentStep.rawValue - 1) else { return }
        currentStep = prev
    }

    func loadPhotos() async {
        var loaded: [Data] = []
        for item in selectedPhotoItems {
            if let data = try? await item.loadTransferable(type: Data.self) {
                loaded.append(data)
            }
        }
        imageDataList = loaded
    }

    func publish(service: ListingService, user: UserProfile) -> Listing? {
        isPublishing = true
        publishError = nil
        guard !title.isEmpty, price > 0 else {
            publishError = "Please fill in all required fields."
            isPublishing = false
            return nil
        }
        let listing = service.createListing(
            title: title,
            price: price,
            category: category,
            listingType: listingType,
            description: description,
            condition: listingType == .item ? condition : nil,
            campusArea: campusArea,
            imageData: imageDataList,
            sellerID: user.id,
            sellerName: user.name
        )
        isPublishing = false
        return listing
    }

    func reset() {
        currentStep = .type
        listingType = .item
        category = .other
        title = ""
        description = ""
        condition = .good
        priceText = ""
        campusArea = ""
        selectedPhotoItems = []
        imageDataList = []
        publishError = nil
    }
}
