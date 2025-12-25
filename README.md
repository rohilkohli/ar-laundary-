<div align="center">
  <h1>ar-laundry-</h1>
</div>

Simple laundry booking and admin dashboard. Install dependencies and start dev server:

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

The repository now includes a GitHub Actions workflow that builds and publishes the Vite app to GitHub Pages on pushes to `main`. To enable the site:

1. In repository **Settings → Pages**, choose **Source: GitHub Actions**.
2. Push to `main` (or trigger the workflow manually) and the app will deploy to `https://<your-username>.github.io/ar-laundary-/`.

## Adding real-time OTP and Google sign-in

The app currently uses a mock login for demo purposes. To plug in production auth:

- **SMS OTP (mobile):** Add Firebase to the project, enable **Phone** authentication, and use `signInWithPhoneNumber` + `RecaptchaVerifier` to send/verify OTP codes in the Auth page. Store the verified user in `AuthContext` instead of `mockLogin`.
- **Google sign-in:** Enable the **Google** provider in Firebase Auth and call `signInWithPopup(new GoogleAuthProvider())`. On success, persist the returned user in `AuthContext`.
- **Server-based OTP alternative:** If you prefer Twilio/MSG91, expose backend endpoints `/auth/send-otp` and `/auth/verify-otp` that deliver and validate codes, then swap the Auth page handlers to call those endpoints and set the session upon verification.

Keep the `HashRouter` router and `AuthProvider` wrapping intact; only replace the mock service calls with your provider of choice.
