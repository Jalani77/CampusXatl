import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var listingService: ListingService
    @State private var showEditProfile = false
    @State private var activeListingCount: Int = 0

    var body: some View {
        NavigationStack {
            if let user = authService.currentUser {
                List {
                    // Header
                    Section {
                        VStack(spacing: Spacing.md) {
                            AvatarView(imageData: user.profileImageData, name: user.name, size: 80)
                            VStack(spacing: Spacing.xxs) {
                                Text(user.name)
                                    .font(.cxTitle2)
                                    .foregroundStyle(Color.cxPrimary)
                                Text(user.school)
                                    .font(.cxSubheadline)
                                    .foregroundStyle(Color.cxSecondary)
                                Text("Class of \(user.graduationYear)")
                                    .font(.cxCaption)
                                    .foregroundStyle(Color.cxTertiary)
                            }
                            if !user.bio.isEmpty {
                                Text(user.bio)
                                    .font(.cxBody)
                                    .foregroundStyle(Color.cxSecondary)
                                    .multilineTextAlignment(.center)
                            }

                            // Stats
                            HStack(spacing: Spacing.xl) {
                                VStack(spacing: 2) {
                                    Text("\(activeListingCount)")
                                        .font(.cxTitle2)
                                        .foregroundStyle(Color.cxTeal)
                                    Text("Listings")
                                        .font(.cxCaption)
                                        .foregroundStyle(Color.cxSecondary)
                                }
                                VStack(spacing: 2) {
                                    Text(user.createdAt.formatted(.dateTime.month(.abbreviated).year()))
                                        .font(.cxSubheadlineSemibold)
                                        .foregroundStyle(Color.cxTeal)
                                    Text("Joined")
                                        .font(.cxCaption)
                                        .foregroundStyle(Color.cxSecondary)
                                }
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Spacing.md)
                    }
                    .listRowBackground(Color.clear)

                    // Actions
                    Section {
                        Button {
                            showEditProfile = true
                        } label: {
                            Label("Edit Profile", systemImage: "person.crop.circle")
                                .foregroundStyle(Color.cxPrimary)
                        }

                        NavigationLink {
                            MyListingsView()
                        } label: {
                            Label("My Listings", systemImage: "tag")
                        }

                        NavigationLink {
                            ConversationListView()
                        } label: {
                            Label("Messages", systemImage: "message")
                        }
                    }

                    Section {
                        NavigationLink {
                            SettingsView()
                        } label: {
                            Label("Settings", systemImage: "gear")
                        }
                    }
                }
                .listStyle(.insetGrouped)
                .navigationTitle("Profile")
                .navigationBarTitleDisplayMode(.large)
                .sheet(isPresented: $showEditProfile) {
                    EditProfileView(user: user)
                }
                .onAppear {
                    activeListingCount = listingService.fetchActiveListings(for: user.id).count
                }
            } else {
                EmptyStateView(
                    systemImage: "person.circle",
                    title: "Not signed in",
                    body: "Sign in to view your profile and manage listings."
                )
                .navigationTitle("Profile")
            }
        }
    }
}
