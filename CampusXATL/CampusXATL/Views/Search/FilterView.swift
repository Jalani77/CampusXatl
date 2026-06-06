import SwiftUI

struct FilterView: View {
    @Binding var selectedCategory: ListingCategory?
    @Binding var minPrice: Double?
    @Binding var maxPrice: Double?
    @Environment(\.dismiss) var dismiss

    @State private var minPriceText: String = ""
    @State private var maxPriceText: String = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Category") {
                    Button("Any Category") {
                        selectedCategory = nil
                    }
                    .foregroundStyle(selectedCategory == nil ? Color.cxTeal : Color.cxPrimary)

                    ForEach(ListingCategory.allCases, id: \.self) { cat in
                        Button {
                            selectedCategory = cat
                        } label: {
                            HStack {
                                Label(cat.rawValue, systemImage: cat.icon)
                                    .foregroundStyle(Color.cxPrimary)
                                Spacer()
                                if selectedCategory == cat {
                                    Image(systemName: "checkmark")
                                        .foregroundStyle(Color.cxTeal)
                                }
                            }
                        }
                    }
                }

                Section("Price Range") {
                    HStack {
                        TextField("Min", text: $minPriceText)
                            .keyboardType(.decimalPad)
                        Text("—")
                            .foregroundStyle(Color.cxSecondary)
                        TextField("Max", text: $maxPriceText)
                            .keyboardType(.decimalPad)
                    }
                }
            }
            .navigationTitle("Filters")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Reset") {
                        selectedCategory = nil
                        minPrice = nil
                        maxPrice = nil
                        minPriceText = ""
                        maxPriceText = ""
                    }
                    .foregroundStyle(Color.cxDestructive)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Apply") {
                        minPrice = Double(minPriceText)
                        maxPrice = Double(maxPriceText)
                        dismiss()
                    }
                    .foregroundStyle(Color.cxTeal)
                }
            }
            .onAppear {
                minPriceText = minPrice.map { String(format: "%.0f", $0) } ?? ""
                maxPriceText = maxPrice.map { String(format: "%.0f", $0) } ?? ""
            }
        }
    }
}
