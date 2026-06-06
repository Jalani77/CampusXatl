import SwiftUI
import PhotosUI

struct EditListingView: View {
    @EnvironmentObject var listingService: ListingService
    @EnvironmentObject var analyticsService: AnalyticsService
    @Environment(\.dismiss) var dismiss

    let listing: Listing

    @State private var title: String
    @State private var description: String
    @State private var priceText: String
    @State private var category: ListingCategory
    @State private var condition: ListingCondition
    @State private var campusArea: String
    @State private var imageDataList: [Data]
    @State private var selectedPhotoItems: [PhotosPickerItem] = []
    @State private var isSaving = false

    init(listing: Listing) {
        self.listing = listing
        _title = State(initialValue: listing.title)
        _description = State(initialValue: listing.listingDescription)
        _priceText = State(initialValue: String(format: "%.2f", listing.price))
        _category = State(initialValue: listing.categoryEnum)
        _condition = State(initialValue: listing.conditionEnum ?? .good)
        _campusArea = State(initialValue: listing.campusArea)
        _imageDataList = State(initialValue: listing.imageData)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Details") {
                    TextField("Title", text: $title)
                    TextField("Description", text: $description, axis: .vertical)
                        .lineLimit(4, reservesSpace: true)
                }

                Section("Category & Condition") {
                    Picker("Category", selection: $category) {
                        ForEach(ListingCategory.allCases, id: \.self) { c in
                            Label(c.rawValue, systemImage: c.icon).tag(c)
                        }
                    }
                    if listing.typeEnum == .item {
                        Picker("Condition", selection: $condition) {
                            ForEach(ListingCondition.allCases, id: \.self) { c in
                                Text(c.rawValue).tag(c)
                            }
                        }
                    }
                }

                Section("Pricing") {
                    HStack {
                        Text("$")
                        TextField("Price", text: $priceText)
                            .keyboardType(.decimalPad)
                    }
                }

                Section("Location") {
                    TextField("Campus Area", text: $campusArea)
                }

                Section("Photos") {
                    PhotosPicker(selection: $selectedPhotoItems, maxSelectionCount: 6, matching: .images) {
                        Label("Change Photos", systemImage: "photo.on.rectangle.angled")
                    }
                    if !imageDataList.isEmpty {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                ForEach(imageDataList.indices, id: \.self) { idx in
                                    if let img = UIImage(data: imageDataList[idx]) {
                                        Image(uiImage: img)
                                            .resizable()
                                            .scaledToFill()
                                            .frame(width: 80, height: 80)
                                            .clipped()
                                            .cornerRadius(8)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Edit Listing")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(Color.cxSecondary)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { saveChanges() }
                        .foregroundStyle(Color.cxTeal)
                        .disabled(isSaving)
                }
            }
            .onChange(of: selectedPhotoItems) { _, items in
                Task {
                    var loaded: [Data] = []
                    for item in items {
                        if let data = try? await item.loadTransferable(type: Data.self) {
                            loaded.append(data)
                        }
                    }
                    if !loaded.isEmpty { imageDataList = loaded }
                }
            }
        }
    }

    private func saveChanges() {
        isSaving = true
        listingService.updateListing(
            listing,
            title: title,
            price: Double(priceText) ?? listing.price,
            category: category,
            description: description,
            condition: listing.typeEnum == .item ? condition : nil,
            campusArea: campusArea,
            imageData: imageDataList
        )
        analyticsService.track(.listingEdited(id: listing.id.uuidString))
        isSaving = false
        dismiss()
    }
}
