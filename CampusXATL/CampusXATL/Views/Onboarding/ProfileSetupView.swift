import SwiftUI
import PhotosUI

struct ProfileSetupView: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss

    @State private var bio = ""
    @State private var selectedPhotoItem: PhotosPickerItem? = nil
    @State private var selectedImageData: Data? = nil

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Spacing.lg) {
                    VStack(spacing: Spacing.xs) {
                        PhotosPicker(selection: $selectedPhotoItem, matching: .images) {
                            ZStack(alignment: .bottomTrailing) {
                                AvatarView(imageData: selectedImageData, name: authService.currentUser?.name ?? "", size: 96)
                                Circle()
                                    .fill(Color.cxTeal)
                                    .frame(width: 28, height: 28)
                                    .overlay(
                                        Image(systemName: "camera")
                                            .font(.system(size: 13, weight: .semibold))
                                            .foregroundStyle(.white)
                                    )
                            }
                        }
                        .onChange(of: selectedPhotoItem) { _, item in
                            Task {
                                if let data = try? await item?.loadTransferable(type: Data.self) {
                                    selectedImageData = data
                                }
                            }
                        }

                        Text("Add a profile photo")
                            .font(.cxSubheadline)
                            .foregroundStyle(Color.cxSecondary)
                    }

                    VStack(alignment: .leading, spacing: Spacing.xxs) {
                        Text("Bio (optional)")
                            .font(.cxSubheadlineSemibold)
                            .foregroundStyle(Color.cxPrimary)
                        TextField("Tell buyers a bit about yourself…", text: $bio, axis: .vertical)
                            .lineLimit(4, reservesSpace: true)
                            .font(.cxBody)
                            .padding(Spacing.md)
                            .background(Color.cxSurface)
                            .cornerRadius(CornerRadius.sm)
                            .overlay(
                                RoundedRectangle(cornerRadius: CornerRadius.sm)
                                    .strokeBorder(Color.cxBorder, lineWidth: 1)
                            )
                    }

                    CXButton(title: "Save Profile", style: .primary) {
                        authService.updateProfile(
                            name: authService.currentUser?.name ?? "",
                            school: authService.currentUser?.school ?? "",
                            graduationYear: authService.currentUser?.graduationYear ?? 2026,
                            bio: bio,
                            imageData: selectedImageData
                        )
                        dismiss()
                    }

                    Button("Skip for now") {
                        dismiss()
                    }
                    .font(.cxSubheadline)
                    .foregroundStyle(Color.cxSecondary)
                }
                .padding(Spacing.lg)
            }
            .navigationTitle("Complete Your Profile")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
