import SwiftUI
import PhotosUI

struct EditProfileView: View {
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss

    @State private var name: String
    @State private var school: String
    @State private var graduationYear: Int
    @State private var bio: String
    @State private var selectedPhotoItem: PhotosPickerItem? = nil
    @State private var selectedImageData: Data? = nil

    private let currentYear = Calendar.current.component(.year, from: Date())

    init(user: UserProfile) {
        _name = State(initialValue: user.name)
        _school = State(initialValue: user.school)
        _graduationYear = State(initialValue: user.graduationYear)
        _bio = State(initialValue: user.bio)
        _selectedImageData = State(initialValue: user.profileImageData)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    HStack {
                        Spacer()
                        PhotosPicker(selection: $selectedPhotoItem, matching: .images) {
                            ZStack(alignment: .bottomTrailing) {
                                AvatarView(imageData: selectedImageData, name: name, size: 80)
                                Circle()
                                    .fill(Color.cxTeal)
                                    .frame(width: 26, height: 26)
                                    .overlay(
                                        Image(systemName: "camera")
                                            .font(.system(size: 12))
                                            .foregroundStyle(.white)
                                    )
                            }
                        }
                        Spacer()
                    }
                    .listRowBackground(Color.clear)
                }
                .onChange(of: selectedPhotoItem) { _, item in
                    Task {
                        if let data = try? await item?.loadTransferable(type: Data.self) {
                            selectedImageData = data
                        }
                    }
                }

                Section("Personal Info") {
                    TextField("Full Name", text: $name)
                    TextField("School / University", text: $school)
                    Picker("Graduation Year", selection: $graduationYear) {
                        ForEach(currentYear...(currentYear + 6), id: \.self) { year in
                            Text(String(year)).tag(year)
                        }
                    }
                }

                Section("Bio") {
                    TextField("Tell buyers about yourself…", text: $bio, axis: .vertical)
                        .lineLimit(4, reservesSpace: true)
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(Color.cxSecondary)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        authService.updateProfile(
                            name: name,
                            school: school,
                            graduationYear: graduationYear,
                            bio: bio,
                            imageData: selectedImageData
                        )
                        dismiss()
                    }
                    .foregroundStyle(Color.cxTeal)
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }
}
