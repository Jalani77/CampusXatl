import SwiftUI

struct AvatarView: View {
    var imageData: Data? = nil
    var name: String = ""
    var size: CGFloat = 44

    var body: some View {
        Group {
            if let data = imageData, let uiImage = UIImage(data: data) {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFill()
            } else {
                ZStack {
                    Color.cxTealLight
                    Text(initials)
                        .font(.system(size: size * 0.38, weight: .semibold))
                        .foregroundStyle(Color.cxTeal)
                }
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay(Circle().strokeBorder(Color.cxBorder, lineWidth: 0.5))
    }

    private var initials: String {
        let parts = name.split(separator: " ").prefix(2)
        return parts.compactMap { $0.first }.map { String($0) }.joined().uppercased()
    }
}
