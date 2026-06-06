import SwiftUI

struct SearchView: View {
    @EnvironmentObject var listingService: ListingService
    @EnvironmentObject var analyticsService: AnalyticsService
    @StateObject private var viewModel = SearchViewModel()
    @State private var showFilter = false
    @State private var selectedListing: Listing? = nil

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search bar
                HStack(spacing: Spacing.xs) {
                    HStack(spacing: Spacing.xs) {
                        Image(systemName: "magnifyingglass")
                            .foregroundStyle(Color.cxSecondary)
                        TextField("Search listings…", text: $viewModel.query)
                            .submitLabel(.search)
                            .onSubmit {
                                viewModel.commitSearch()
                                analyticsService.track(.searchPerformed(query: viewModel.query))
                            }
                        if !viewModel.query.isEmpty {
                            Button {
                                viewModel.query = ""
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(Color.cxTertiary)
                            }
                        }
                    }
                    .padding(Spacing.sm)
                    .background(Color.cxSurface)
                    .cornerRadius(CornerRadius.md)

                    Button {
                        showFilter = true
                    } label: {
                        Image(systemName: viewModel.hasFilters ? "line.3.horizontal.decrease.circle.fill" : "line.3.horizontal.decrease.circle")
                            .font(.title3)
                            .foregroundStyle(viewModel.hasFilters ? Color.cxTeal : Color.cxSecondary)
                    }
                }
                .padding(.horizontal, Spacing.md)
                .padding(.vertical, Spacing.sm)

                Divider()

                if viewModel.query.isEmpty && !viewModel.hasFilters {
                    // Recent searches
                    if viewModel.recentSearches.isEmpty {
                        EmptyStateView(
                            systemImage: "magnifyingglass",
                            title: "Search the marketplace",
                            body: "Find textbooks, electronics, services, and more from students at your campus."
                        )
                    } else {
                        List {
                            Section {
                                ForEach(viewModel.recentSearches, id: \.self) { term in
                                    Button {
                                        viewModel.query = term
                                    } label: {
                                        Label(term, systemImage: "clock")
                                            .foregroundStyle(Color.cxPrimary)
                                    }
                                }
                            } header: {
                                HStack {
                                    Text("Recent Searches")
                                    Spacer()
                                    Button("Clear") {
                                        viewModel.clearRecentSearches()
                                    }
                                    .font(.cxCaption)
                                    .foregroundStyle(Color.cxTeal)
                                }
                            }
                        }
                        .listStyle(.plain)
                    }
                } else {
                    // Results
                    if viewModel.results.isEmpty {
                        EmptyStateView(
                            systemImage: "magnifyingglass",
                            title: "No results",
                            body: "Try a different search term or adjust your filters.",
                            ctaTitle: viewModel.hasFilters ? "Clear Filters" : nil,
                            ctaAction: viewModel.hasFilters ? { viewModel.clearFilters() } : nil
                        )
                    } else {
                        ScrollView {
                            LazyVGrid(
                                columns: [GridItem(.flexible(), spacing: Spacing.xs), GridItem(.flexible(), spacing: Spacing.xs)],
                                spacing: Spacing.xs
                            ) {
                                ForEach(viewModel.results) { listing in
                                    ListingCard(listing: listing) {
                                        selectedListing = listing
                                    }
                                }
                            }
                            .padding(Spacing.md)
                        }
                    }
                }
            }
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.large)
            .navigationDestination(item: $selectedListing) { listing in
                ListingDetailView(listing: listing)
            }
            .sheet(isPresented: $showFilter) {
                FilterView(
                    selectedCategory: $viewModel.selectedCategory,
                    minPrice: $viewModel.minPrice,
                    maxPrice: $viewModel.maxPrice
                )
            }
        }
        .onAppear {
            viewModel.load(service: listingService)
        }
    }
}
