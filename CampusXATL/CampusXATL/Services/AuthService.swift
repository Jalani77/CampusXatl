import Foundation
import SwiftData
import SwiftUI

@MainActor
final class AuthService: ObservableObject {
    @Published var currentUser: UserProfile? = nil
    @Published var isLoading: Bool = false
    @Published var authError: String? = nil

    private var modelContext: ModelContext?

    func configure(with context: ModelContext) {
        self.modelContext = context
        loadCurrentUser()
    }

    private func loadCurrentUser() {
        guard let context = modelContext else { return }
        let descriptor = FetchDescriptor<UserProfile>(predicate: #Predicate { $0.isCurrentUser == true })
        if let user = try? context.fetch(descriptor).first {
            self.currentUser = user
        }
    }

    func signUp(name: String, email: String, password: String, school: String, graduationYear: Int, bio: String = "") async -> Bool {
        guard let context = modelContext else { return false }
        isLoading = true
        authError = nil

        // Check email uniqueness
        let emailLower = email.lowercased()
        let descriptor = FetchDescriptor<UserProfile>(predicate: #Predicate { $0.email == emailLower })
        if let existing = try? context.fetch(descriptor), !existing.isEmpty {
            authError = "An account with this email already exists."
            isLoading = false
            return false
        }

        let hash = UserProfile.hashPassword(password)
        let user = UserProfile(name: name, email: emailLower, passwordHash: hash, school: school, graduationYear: graduationYear, bio: bio)
        user.isCurrentUser = true
        context.insert(user)
        try? context.save()
        self.currentUser = user
        isLoading = false
        return true
    }

    func signIn(email: String, password: String) async -> Bool {
        guard let context = modelContext else { return false }
        isLoading = true
        authError = nil

        let emailLower = email.lowercased()
        let hash = UserProfile.hashPassword(password)
        let descriptor = FetchDescriptor<UserProfile>(predicate: #Predicate { $0.email == emailLower && $0.passwordHash == hash })
        guard let user = try? context.fetch(descriptor).first else {
            authError = "Invalid email or password."
            isLoading = false
            return false
        }

        // Clear any previous current user flag
        let allDescriptor = FetchDescriptor<UserProfile>(predicate: #Predicate { $0.isCurrentUser == true })
        if let others = try? context.fetch(allDescriptor) {
            others.forEach { $0.isCurrentUser = false }
        }
        user.isCurrentUser = true
        try? context.save()
        self.currentUser = user
        isLoading = false
        return true
    }

    func signOut() {
        guard let context = modelContext, let user = currentUser else { return }
        user.isCurrentUser = false
        try? context.save()
        self.currentUser = nil
    }

    func updateProfile(name: String, school: String, graduationYear: Int, bio: String, imageData: Data?) {
        guard let user = currentUser, let context = modelContext else { return }
        user.name = name
        user.school = school
        user.graduationYear = graduationYear
        user.bio = bio
        if let data = imageData {
            user.profileImageData = data
        }
        try? context.save()
    }
}
