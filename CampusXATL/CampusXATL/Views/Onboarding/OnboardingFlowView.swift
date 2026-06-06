import SwiftUI

struct OnboardingFlowView: View {
    @State private var showSignUp = false
    @State private var showSignIn = false

    var body: some View {
        WelcomeView(showSignUp: $showSignUp, showSignIn: $showSignIn)
            .sheet(isPresented: $showSignUp) {
                SignUpView()
            }
            .sheet(isPresented: $showSignIn) {
                SignInView()
            }
    }
}
