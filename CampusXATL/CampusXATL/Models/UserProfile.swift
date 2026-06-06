import SwiftData
import Foundation

@Model
final class UserProfile {
    @Attribute(.unique) var id: UUID
    var name: String
    var email: String
    var passwordHash: String
    var school: String
    var graduationYear: Int
    var bio: String
    var profileImageData: Data?
    var createdAt: Date
    var isCurrentUser: Bool

    init(name: String, email: String, passwordHash: String, school: String, graduationYear: Int, bio: String = "") {
        self.id = UUID()
        self.name = name
        self.email = email
        self.passwordHash = passwordHash
        self.school = school
        self.graduationYear = graduationYear
        self.bio = bio
        self.createdAt = Date()
        self.isCurrentUser = false
    }

    static func hashPassword(_ password: String) -> String {
        // Simple deterministic hash for local auth shell (not cryptographically secure)
        var hash = 5381
        for char in password.unicodeScalars {
            hash = ((hash << 5) &+ hash) &+ Int(char.value)
        }
        return String(hash)
    }
}
