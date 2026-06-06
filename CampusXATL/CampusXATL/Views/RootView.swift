import SwiftUI

struct RootView: View {
    @EnvironmentObject var authService: AuthService

    var body: some View {
        Group {
            if authService.currentUser != nil {
                MainTabView()
            } else {
                OnboardingFlowView()
            }
        }
        .animation(.easeInOut(duration: 0.3), value: authService.currentUser?.id)
    }
}
