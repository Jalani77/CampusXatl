import SwiftUI

extension Color {
    // Primary
    static let cxTeal = Color(hex: "1A7A6E")
    static let cxTealLight = Color(hex: "E8F5F3")
    static let cxTealMid = Color(hex: "2A9D8F")

    // Neutrals
    static let cxBackground = Color(UIColor.systemBackground)
    static let cxSurface = Color(UIColor.secondarySystemBackground)
    static let cxSurfaceElevated = Color(UIColor.tertiarySystemBackground)
    static let cxBorder = Color(UIColor.separator)

    // Text
    static let cxPrimary = Color(UIColor.label)
    static let cxSecondary = Color(UIColor.secondaryLabel)
    static let cxTertiary = Color(UIColor.tertiaryLabel)

    // Semantic
    static let cxSuccess = Color(hex: "34A853")
    static let cxWarning = Color(hex: "F59E0B")
    static let cxDestructive = Color(UIColor.systemRed)

    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(.sRGB, red: Double(r) / 255, green: Double(g) / 255, blue: Double(b) / 255, opacity: Double(a) / 255)
    }
}
