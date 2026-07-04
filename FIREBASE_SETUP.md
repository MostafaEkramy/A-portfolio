# Firebase Setup

1. Create a Firebase project.
2. Enable Authentication with the Email/Password provider.
3. Create one admin user in Firebase Authentication.
4. Enable Firestore Database.
5. Enable Firebase Storage if you want image uploads from the admin panel.
6. Copy `.env.example` to `.env` and fill in your Firebase web app config.
7. Restart the Vite dev server after changing `.env`.

The admin route is:

```text
/#/admin
```

The site reads and writes this Firestore document:

```text
portfolioContent/main
```

Suggested Firestore rule while using Firebase Auth:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolioContent/main {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Suggested Storage rule for uploaded portfolio images:

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /portfolio/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
