import SwiftUI

struct ListingPreviewView: View {
    @ObservedObject var viewModel: CreateListingViewModel

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                // Image preview
                if viewModel.imageDataList.isEmpty {
                    ZStack {
                        Color.cxSurface
                        VStack(spacing: Spacing.xs) {
                            Image(systemName: viewModel.category.icon)
                                .font(.system(size: 48))
                                .foregroundStyle(Color.cxTeal.opacity(0.4))
                            Text("No photos added")
                                .font(.cxCaption)
                                .foregroundStyle(Color.cxTertiary)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 240)
                } else {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: Spacing.xs) {
                            ForEach(viewModel.imageDataList.indices, id: \.self) { idx in
                                if let uiImage = UIImage(data: viewModel.imageDataList[idx]) {
                                    Image(uiImage: uiImage)
                                        .resizable()
                                        .scaledToFill()
                                        .frame(width: 240, height: 240)
                                        .clipped()
                                        .cornerRadius(CornerRadius.sm)
                                }
                            }
                        }
                        .padding(.horizontal, Spacing.md)
                    }
                    .frame(height: 240)
                }

                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text(viewModel.title.isEmpty ? "Your listing title" : viewModel.title)
                        .font(.cxTitle2)
                        .foregroundStyle(viewModel.title.isEmpty ? Color.cxTertiary : Color.cxPrimary)

                    Text(viewModel.price > 0 ? (viewModel.listingType == .service ? "$\(String(format: "%.0f", viewModel.price))/hr" : "$\(String(format: "%.2f", viewModel.price))") : "$0.00")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundStyle(Color.cxTeal)

                    HStack(spacing: Spacing.xs) {
                        CXBadge(text: viewModel.category.rawValue, icon: viewModel.category.icon)
                        if viewModel.listingType == .item {
                            CXBadge(text: viewModel.condition.rawValue, color: Color.cxSurface, textColor: Color.cxSecondary)
                        }
                        if !viewModel.campusArea.isEmpty {
                            CXBadge(text: viewModel.campusArea, icon: "mappin", color: Color.cxSurface, textColor: Color.cxSecondary)
                        }
                    }

                    Divider()

                    Text("Description")
                        .font(.cxHeadline)
                    Text(viewModel.description.isEmpty ? "No description provided." : viewModel.description)
                        .font(.cxBody)
                        .foregroundStyle(Color.cxSecondary)
                }
                .padding(Spacing.md)
            }
        }
    }
}
