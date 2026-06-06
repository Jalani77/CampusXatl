import SwiftUI
import PhotosUI

struct CreateListingView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var listingService: ListingService
    @EnvironmentObject var entitlementManager: EntitlementManager
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var analyticsService: AnalyticsService
    @Environment(\.dismiss) var dismiss

    @StateObject private var viewModel = CreateListingViewModel()
    @State private var showPaywall = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Progress bar
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Rectangle().fill(Color.cxSurface)
                        Rectangle()
                            .fill(Color.cxTeal)
                            .frame(width: geo.size.width * viewModel.stepProgress)
                            .animation(.easeInOut(duration: 0.3), value: viewModel.stepProgress)
                    }
                }
                .frame(height: 3)

                // Step content
                Group {
                    switch viewModel.currentStep {
                    case .type:
                        TypeStepView(viewModel: viewModel)
                    case .category:
                        CategoryStepView(viewModel: viewModel)
                    case .details:
                        DetailsStepView(viewModel: viewModel)
                    case .pricing:
                        PricingStepView(viewModel: viewModel)
                    case .photos:
                        PhotosStepView(viewModel: viewModel)
                    case .location:
                        LocationStepView(viewModel: viewModel)
                    case .preview:
                        VStack(spacing: 0) {
                            Text("Preview your listing")
                                .font(.cxTitle3)
                                .padding(Spacing.md)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            ListingPreviewView(viewModel: viewModel)
                        }
                    }
                }

                Divider()

                // Navigation controls
                HStack(spacing: Spacing.sm) {
                    if viewModel.currentStep.rawValue > 0 {
                        CXButton(title: "Back", style: .ghost, isFullWidth: false) {
                            viewModel.back()
                        }
                    }

                    if viewModel.currentStep == .preview {
                        CXButton(title: "Publish Listing", style: .primary, isLoading: viewModel.isPublishing) {
                            publishListing()
                        }
                    } else {
                        CXButton(title: "Continue", style: .primary) {
                            if viewModel.currentStep == .photos {
                                Task { await viewModel.loadPhotos() }
                            }
                            viewModel.advance()
                        }
                        .disabled(!viewModel.canAdvance)
                        .opacity(viewModel.canAdvance ? 1 : 0.5)
                    }
                }
                .padding(Spacing.md)
            }
            .navigationTitle(stepTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        viewModel.reset()
                        dismiss()
                    }
                    .foregroundStyle(Color.cxSecondary)
                }
            }
            .sheet(isPresented: $showPaywall) {
                PaywallView(trigger: "listing_limit")
            }
        }
        .onAppear {
            checkEntitlements()
        }
    }

    private var stepTitle: String {
        switch viewModel.currentStep {
        case .type: return "What are you listing?"
        case .category: return "Choose a Category"
        case .details: return "Add Details"
        case .pricing: return "Set Your Price"
        case .photos: return "Add Photos"
        case .location: return "Campus Area"
        case .preview: return "Review Listing"
        }
    }

    private func checkEntitlements() {
        guard let user = authService.currentUser else { return }
        let myListings = listingService.fetchActiveListings(for: user.id)
        if !entitlementManager.canCreateListing(currentCount: myListings.count) {
            showPaywall = true
        }
    }

    private func publishListing() {
        guard let user = authService.currentUser else { return }
        if let listing = viewModel.publish(service: listingService, user: user) {
            analyticsService.track(.listingCreated(category: listing.category, price: listing.price))
            viewModel.reset()
            dismiss()
        }
    }
}

// MARK: - Step Sub-views

struct TypeStepView: View {
    @ObservedObject var viewModel: CreateListingViewModel

    var body: some View {
        VStack(spacing: Spacing.lg) {
            Text("What kind of listing is this?")
                .font(.cxTitle3)
                .multilineTextAlignment(.center)
                .padding(.top, Spacing.xl)

            ForEach(ListingType.allCases, id: \.self) { type in
                Button {
                    viewModel.listingType = type
                } label: {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(type.rawValue)
                                .font(.cxBodySemibold)
                                .foregroundStyle(Color.cxPrimary)
                            Text(type == .item ? "Physical goods for sale" : "Skills or time you offer")
                                .font(.cxCaption)
                                .foregroundStyle(Color.cxSecondary)
                        }
                        Spacer()
                        if viewModel.listingType == type {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(Color.cxTeal)
                                .font(.title3)
                        }
                    }
                    .padding(Spacing.md)
                    .background(viewModel.listingType == type ? Color.cxTealLight : Color.cxSurface)
                    .cornerRadius(CornerRadius.md)
                    .overlay(
                        RoundedRectangle(cornerRadius: CornerRadius.md)
                            .strokeBorder(viewModel.listingType == type ? Color.cxTeal : Color.cxBorder, lineWidth: viewModel.listingType == type ? 1.5 : 0.5)
                    )
                }
                .buttonStyle(.plain)
            }
            Spacer()
        }
        .padding(Spacing.md)
    }
}

struct CategoryStepView: View {
    @ObservedObject var viewModel: CreateListingViewModel

    private let columns = [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: Spacing.sm) {
                ForEach(ListingCategory.allCases, id: \.self) { cat in
                    Button {
                        viewModel.category = cat
                    } label: {
                        VStack(spacing: Spacing.xs) {
                            Image(systemName: cat.icon)
                                .font(.title2)
                                .foregroundStyle(viewModel.category == cat ? Color.white : Color.cxTeal)
                            Text(cat.rawValue)
                                .font(.cxCaption)
                                .foregroundStyle(viewModel.category == cat ? Color.white : Color.cxPrimary)
                                .multilineTextAlignment(.center)
                                .lineLimit(2)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(Spacing.md)
                        .background(viewModel.category == cat ? Color.cxTeal : Color.cxSurface)
                        .cornerRadius(CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.md)
                                .strokeBorder(viewModel.category == cat ? Color.clear : Color.cxBorder, lineWidth: 0.5)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(Spacing.md)
        }
    }
}

struct DetailsStepView: View {
    @ObservedObject var viewModel: CreateListingViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.md) {
                CXTextField(label: "Title", placeholder: "e.g. Calculus Textbook 3rd Edition", text: $viewModel.title)

                VStack(alignment: .leading, spacing: Spacing.xxs) {
                    Text("Description")
                        .font(.cxSubheadlineSemibold)
                        .foregroundStyle(Color.cxPrimary)
                    TextField("Describe your listing in detail…", text: $viewModel.description, axis: .vertical)
                        .lineLimit(6, reservesSpace: true)
                        .font(.cxBody)
                        .padding(Spacing.md)
                        .background(Color.cxSurface)
                        .cornerRadius(CornerRadius.sm)
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.sm)
                                .strokeBorder(Color.cxBorder, lineWidth: 1)
                        )
                }

                if viewModel.listingType == .item {
                    VStack(alignment: .leading, spacing: Spacing.xxs) {
                        Text("Condition")
                            .font(.cxSubheadlineSemibold)
                            .foregroundStyle(Color.cxPrimary)
                        Picker("Condition", selection: $viewModel.condition) {
                            ForEach(ListingCondition.allCases, id: \.self) { c in
                                Text(c.rawValue).tag(c)
                            }
                        }
                        .pickerStyle(.segmented)
                    }
                }
            }
            .padding(Spacing.md)
        }
    }
}

struct PricingStepView: View {
    @ObservedObject var viewModel: CreateListingViewModel

    var body: some View {
        VStack(spacing: Spacing.lg) {
            VStack(spacing: Spacing.xs) {
                Text(viewModel.listingType == .service ? "Hourly Rate" : "Asking Price")
                    .font(.cxTitle3)
                    .foregroundStyle(Color.cxPrimary)
                Text(viewModel.listingType == .service ? "How much do you charge per hour?" : "What price are you asking for this item?")
                    .font(.cxBody)
                    .foregroundStyle(Color.cxSecondary)
                    .multilineTextAlignment(.center)
            }
            .padding(.top, Spacing.xl)

            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text("$")
                    .font(.system(size: 40, weight: .bold))
                    .foregroundStyle(Color.cxTeal)
                TextField("0", text: $viewModel.priceText)
                    .font(.system(size: 56, weight: .bold))
                    .foregroundStyle(Color.cxPrimary)
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 200)
                if viewModel.listingType == .service {
                    Text("/hr")
                        .font(.system(size: 24, weight: .medium))
                        .foregroundStyle(Color.cxSecondary)
                }
            }

            Spacer()
        }
        .padding(Spacing.md)
    }
}

struct PhotosStepView: View {
    @ObservedObject var viewModel: CreateListingViewModel

    var body: some View {
        VStack(spacing: Spacing.lg) {
            VStack(spacing: Spacing.xs) {
                Text("Add Photos")
                    .font(.cxTitle3)
                Text("Good photos help your listing sell faster. Up to 6 photos.")
                    .font(.cxBody)
                    .foregroundStyle(Color.cxSecondary)
                    .multilineTextAlignment(.center)
            }
            .padding(.top, Spacing.lg)

            PhotosPicker(
                selection: $viewModel.selectedPhotoItems,
                maxSelectionCount: 6,
                matching: .images
            ) {
                HStack {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.title2)
                    Text("Select Photos")
                        .font(.cxBodySemibold)
                }
                .frame(maxWidth: .infinity)
                .padding(Spacing.lg)
                .background(Color.cxSurface)
                .cornerRadius(CornerRadius.md)
                .overlay(
                    RoundedRectangle(cornerRadius: CornerRadius.md)
                        .strokeBorder(Color.cxBorder, lineWidth: 1, antialiased: true)
                )
                .foregroundStyle(Color.cxTeal)
            }
            .onChange(of: viewModel.selectedPhotoItems) { _, _ in
                Task { await viewModel.loadPhotos() }
            }

            if !viewModel.imageDataList.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Spacing.xs) {
                        ForEach(viewModel.imageDataList.indices, id: \.self) { idx in
                            if let uiImage = UIImage(data: viewModel.imageDataList[idx]) {
                                Image(uiImage: uiImage)
                                    .resizable()
                                    .scaledToFill()
                                    .frame(width: 100, height: 100)
                                    .clipped()
                                    .cornerRadius(CornerRadius.sm)
                            }
                        }
                    }
                }
            }

            Button("Skip — No photos") {
                viewModel.advance()
            }
            .font(.cxSubheadline)
            .foregroundStyle(Color.cxSecondary)

            Spacer()
        }
        .padding(Spacing.md)
    }
}

struct LocationStepView: View {
    @ObservedObject var viewModel: CreateListingViewModel

    private let areas = ["North Campus", "South Campus", "East Campus", "West Campus", "Downtown", "Near Campus", "Online / Remote"]

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.sm) {
                Text("Where is the item located?")
                    .font(.cxTitle3)
                    .padding(.top, Spacing.lg)
                    .padding(.horizontal, Spacing.md)

                ForEach(areas, id: \.self) { area in
                    Button {
                        viewModel.campusArea = area
                    } label: {
                        HStack {
                            Label(area, systemImage: "mappin")
                                .foregroundStyle(Color.cxPrimary)
                            Spacer()
                            if viewModel.campusArea == area {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundStyle(Color.cxTeal)
                            }
                        }
                        .padding(Spacing.md)
                        .background(viewModel.campusArea == area ? Color.cxTealLight : Color.cxSurface)
                        .cornerRadius(CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: CornerRadius.md)
                                .strokeBorder(viewModel.campusArea == area ? Color.cxTeal : Color.cxBorder, lineWidth: viewModel.campusArea == area ? 1.5 : 0.5)
                        )
                    }
                    .buttonStyle(.plain)
                    .padding(.horizontal, Spacing.md)
                }

                CXTextField(
                    label: "Or enter custom location",
                    placeholder: "e.g. Library 2nd floor",
                    text: $viewModel.campusArea
                )
                .padding(.horizontal, Spacing.md)
            }
        }
    }
}
