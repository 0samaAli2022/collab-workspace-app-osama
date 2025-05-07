# Collab Workspace App - Setup and Installation Guide

This guide provides detailed instructions for setting up and running the Collab Workspace App for both development and production environments.

## Development Environment Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **Package Manager**: npm (comes with Node.js) or yarn
  - Install yarn (optional): `npm install -g yarn`
  - Verify installation: `yarn --version`

- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

- **Code Editor**: Visual Studio Code (recommended)
  - Download from [code.visualstudio.com](https://code.visualstudio.com/)
  - Recommended extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - Firebase Explorer

### Project Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd collab-workspace-app-osama
   ```

2. **Install Dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Using yarn:
   ```bash
   yarn
   ```

3. **Firebase Setup**

   a. Create a Firebase project:
      - Go to [Firebase Console](https://console.firebase.google.com/)
      - Click "Add project" and follow the setup wizard
      - Enable Google Analytics (optional)

   b. Set up Authentication:
      - In the Firebase Console, go to "Authentication" > "Sign-in method"
      - Enable "Email/Password" provider

   c. Set up Firestore Database:
      - In the Firebase Console, go to "Firestore Database"
      - Click "Create database"
      - Start in production mode
      - Choose a location closest to your users

   d. Get your Firebase configuration:
      - In the Firebase Console, go to Project settings
      - Scroll down to "Your apps" section
      - If no app is registered, click the web icon (</>) to register a new web app
      - Copy the Firebase configuration object

   e. Configure the application:
      - Create or update the file `src/config/firebase.ts` with your Firebase configuration:

      ```typescript
      // src/config/firebase.ts
      import { initializeApp } from 'firebase/app';
      import { getAuth } from 'firebase/auth';
      import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID" // Optional
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      // Enable offline persistence
      try {
        enableMultiTabIndexedDbPersistence(db);
      } catch (error) {
        console.error("Error enabling offline persistence:", error);
      }

      export { app, auth, db };
      ```

4. **Environment Variables (Optional)**

   For additional configuration or environment-specific settings:

   a. Create a `.env` file in the project root:
   ```
   VITE_APP_NAME=Collab Workspace
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

   b. Update `firebase.ts` to use environment variables:
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
   };
   ```

5. **Start the Development Server**

   Using npm:
   ```bash
   npm run dev
   ```

   Using yarn:
   ```bash
   yarn dev
   ```

   The application will be available at `http://localhost:5173` by default.

## Firebase Security Rules

To secure your Firestore database, set up the following security rules in the Firebase Console:

1. Go to Firestore Database > Rules
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workspace rules
    match /workspaces/{workspaceId} {
      allow read: if request.auth != null && (resource.data.members[request.auth.uid] == true || resource.data.createdBy == request.auth.uid);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (resource.data.createdBy == request.auth.uid);
      
      // Board rules within workspaces
      match /boards/{boardId} {
        allow read, write: if request.auth != null && get(/databases/$(database)/documents/workspaces/$(workspaceId)).data.members[request.auth.uid] == true;
        
        // Task rules within boards
        match /tasks/{taskId} {
          allow read, write: if request.auth != null && get(/databases/$(database)/documents/workspaces/$(workspaceId)).data.members[request.auth.uid] == true;
        }
      }
    }
  }
}
```

## Production Deployment

### Build the Application

1. Create a production build:

   Using npm:
   ```bash
   npm run build
   ```

   Using yarn:
   ```bash
   yarn build
   ```

   This will generate optimized production files in the `dist/` directory.

### Deployment Options

#### Option 1: Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Specify `dist` as the public directory
   - Configure as a single-page app
   - Set up automatic builds and deploys with GitHub (optional)

4. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

#### Option 2: Other Hosting Providers

The application can be deployed to any static hosting service:

1. Upload the contents of the `dist/` directory to your hosting provider
2. Configure the server to handle client-side routing:
   - For Apache, create a `.htaccess` file in the root directory:
     ```
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```
   - For Nginx, update your server configuration:
     ```
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

## Troubleshooting

### Common Issues

1. **Node.js Version Compatibility**
   - Error: "The engine "node" is incompatible with this module"
   - Solution: Update Node.js to version 18 or higher

2. **Firebase Authentication Issues**
   - Error: "Firebase: Error (auth/...)"
   - Solution: Check Firebase Console > Authentication > Sign-in methods

3. **Firestore Permissions**
   - Error: "Missing or insufficient permissions"
   - Solution: Review and update Firestore security rules

4. **Build Errors**
   - Error: TypeScript compilation errors
   - Solution: Fix type errors in the codebase

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Firebase documentation](https://firebase.google.com/docs)
2. Search for solutions on [Stack Overflow](https://stackoverflow.com/)
3. Open an issue in the project repository

## Development Workflow

### Code Style and Linting

The project uses ESLint for code linting:

```bash
# Run linting
npm run lint
# or
yarn lint
```

### Testing the Production Build Locally

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

This will serve the production build at `http://localhost:4173` by default.

## Conclusion

You should now have a fully functional development environment for the Collab Workspace App. If you have any questions or need further assistance, please refer to the project documentation or contact the development team.