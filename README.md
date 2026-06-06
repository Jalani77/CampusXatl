# CampusXATL

A student marketplace iOS app for college campuses, built with SwiftUI and SwiftData. No backend, no external dependencies — fully local and ready to run.

---

## Requirements

- Xcode 15.0+
- iOS 17.0+ deployment target
- macOS Ventura or later (for building)
- No CocoaPods, SPM packages, or API keys required

---

## Getting Started

1. Open `CampusXATL/CampusXATL.xcodeproj` in Xcode 15.
2. Select the `CampusXATL` scheme.
3. Choose an iOS 17 simulator (iPhone 15 recommended).
4. Press **Run** (Cmd+R).

No configuration needed. The app runs entirely locally using SwiftData for persistence.

---

## Architecture

### Stack
- **SwiftUI** — declarative UI throughout
- **SwiftData** — local persistence (replaces CoreData)
- **StoreKit 2** — subscription skeleton (requires App Store Connect or StoreKit config for live purchases)
- **PhotosUI** — photo picker for listing images and profile photos

### Pattern
- **MVVM** — Views own `@StateObject` ViewModels; Services handle data layer
- **Environment injection** — Services and state passed via `.environmentObject`
- **No Combine** — uses `async/await` and `@Published` directly

---

## Project Structure

```
CampusXATL/
  App/                    Entry point, AppState, AppPersistence (ModelContainer)
  DesignSystem/           Colors, Typography, Spacing + reusable components
  Models/                 SwiftData @Model classes
  Services/               Auth, Listing, Messaging, Saved — all local
  Analytics/              Protocol-based analytics with debug console logging
  Billing/                EntitlementManager, SubscriptionManager (StoreKit 2)
  Views/
    Onboarding/           Welcome, Sign Up, Sign In, Profile Setup
    Home/                 Greeting header, category filter, listings grid
    Search/               Full-text search, recent searches, filter sheet
    Listings/             Detail, Create (7-step), Edit, My Listings
    Saved/                Bookmarked listings grid
    Messaging/            Conversation list + message thread
    Profile/              User profile, edit, settings
    Billing/              Paywall, subscription management
```

---

## Key Behaviors

### Authentication
All auth is local — no network calls. Sign-up creates a `UserProfile` in SwiftData. Sign-in queries by email + password hash. `AuthService.currentUser` drives the root view switch between `OnboardingFlowView` and `MainTabView`.

### Listing Flow
The Sell tab (center tab) triggers `CreateListingView` as a modal sheet. The 7-step form collects: type, category, details, pricing, photos, location, preview. On publish, `ListingService` persists to SwiftData.

### Subscription Gating
`EntitlementManager` checks active listing count against tier limits:
- **Free**: 3 listings
- **Campus+**: 15 listings
- **Campus Pro**: Unlimited

Exceeding the limit shows `PaywallView`. For real purchases, configure your App Store Connect subscription products using the product IDs in `SubscriptionManager.swift`.

### StoreKit Testing
The scheme is pre-configured to use `StoreKitConfiguration.storekit` for sandbox testing in the simulator. Add your own product entries or connect to App Store Connect for live testing.

---

## Adding a Development Team

To run on a physical device:
1. Open `CampusXATL.xcodeproj` in Xcode.
2. Select the `CampusXATL` target, then **Signing & Capabilities**.
3. Set your **Team** to your Apple Developer account.
4. Xcode will handle provisioning automatically.

---

## Notes

- `UserProfile.hashPassword` uses a basic integer hash suitable only for this local auth shell. Replace with a cryptographic approach (e.g., CryptoKit SHA-256 with a salt) before any production use.
- All data is stored on-device via SwiftData. Deleting the app clears all data.
- The app is portrait-only by default (set in `Info.plist`).
- Bundle identifier: `com.campusxatl.app`
