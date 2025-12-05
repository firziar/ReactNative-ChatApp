# 🚀 Chat App - Developer Guide

## Quick Reference

### Instalasi & Setup

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android
# atau
npx react-native run-android
```

### File Structure

```
ChatApp/
├── App.tsx                          # Root navigator
├── firebase.ts                      # Firebase config & auth
├── context/
│   └── AuthContext.tsx             # Auth state management
├── screens/
│   ├── LoginScreen.tsx             # Login/Sign Up UI
│   └── ChatScreen.tsx              # Chat & messaging
├── android/                        # Android native code
└── ios/                           # iOS native code
```

### Key APIs

#### Firebase Auth
```typescript
// Register
registerUser(email, password): Promise<void>

// Login
loginUser(email, password): Promise<void>

// Logout
logoutUser(): Promise<void>

// Watch auth state
onAuthStateChanged(auth, callback)
```

#### Auth Context
```typescript
const { user, loading, error, register, login, logout } = useAuth()

// user: Firebase User object or null
// loading: boolean - during auth operations
// error: string | null - error messages
```

#### Firestore
```typescript
// Messages collection
messagesCollection

// Query messages
query(messagesCollection, orderBy("createdAt", "asc"))

// Listen for changes
onSnapshot(q, (snapshot) => { ... })

// Add message
addDoc(messagesCollection, { text, user, createdAt })
```

---

## Development Workflow

### 1. Making Changes
```bash
# Edit files
# Hot reload automatically triggers on save
```

### 2. Testing
```bash
# Run app in emulator
npm run android

# Check console logs
# Open Android Studio logcat for debugging
```

### 3. Build Release
```bash
cd android
./gradlew assembleRelease

# Find APK: android/app/build/outputs/apk/release/app-release.apk
```

---

## Common Tasks

### Add New Auth Method
```typescript
// In firebase.ts
export const customAuthMethod = (params) => {
  return customAuthFunction(auth, ...params)
}

// Export it
export { customAuthFunction }

// Use in AuthContext.tsx
```

### Add New Screen
```typescript
// screens/NewScreen.tsx
import { useAuth } from '../context/AuthContext'

export default function NewScreen() {
  const { user } = useAuth()
  // ... your code
}

// Add to App.tsx
<Stack.Screen name="NewScreen" component={NewScreen} />

// Add to RootStackParamList type
export type RootStackParamList = {
  Login: undefined
  Chat: { name: string }
  NewScreen: { /* params */ }
}
```

### Handle Auth Errors
```typescript
try {
  await login(email, password)
} catch (err: any) {
  // Error message dari Firebase
  console.error(err.message)
  // Common errors:
  // "auth/user-not-found"
  // "auth/wrong-password"
  // "auth/invalid-email"
  // "auth/weak-password"
  // "auth/email-already-in-use"
}
```

---

## Debugging

### Metro Bundler
```bash
# Reset cache if having issues
npm start -- --reset-cache
```

### Android Emulator
```bash
# Reload app (double tap R)
# Open dev menu (Ctrl+M or Cmd+M)
# Chrome DevTools: chrome://inspect
```

### Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select project: chatapp-f6ac6
3. Monitor auth users, firestore data, etc.

### AsyncStorage Debugging
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

// Check stored data
const data = await AsyncStorage.getItem('@chat_user')
console.log('Stored user:', JSON.parse(data))

// Clear all
await AsyncStorage.clear()
```

---

## Performance Tips

1. **Optimize Firestore Queries**
   ```typescript
   // Good: Paginated
   query(messages, orderBy("createdAt", "desc"), limit(50))
   
   // Bad: No limit
   query(messages, orderBy("createdAt", "desc"))
   ```

2. **Use useCallback for Functions**
   ```typescript
   const handleSend = useCallback(async () => {
     // Send message
   }, [])
   ```

3. **Lazy Load Components**
   ```typescript
   const ChatScreen = lazy(() => import('./screens/ChatScreen'))
   ```

---

## Troubleshooting

### App Won't Start
```bash
# 1. Clear cache
npm start -- --reset-cache

# 2. Delete node_modules
rm -rf node_modules
npm install

# 3. Clean Gradle
cd android
./gradlew clean
cd ..

# 4. Rebuild
npm run android
```

### Firebase Connection Failed
```
- Check internet connection
- Verify Firebase config in firebase.ts
- Check Firestore rules are correct
- Verify API keys are not revoked
```

### AsyncStorage Not Working
```typescript
// Check if package installed
npm list @react-native-async-storage/async-storage

// Reinstall if needed
npm install @react-native-async-storage/async-storage
```

### Messages Not Syncing
```
- Check Firestore rules allow read/write
- Verify onSnapshot listener is registered
- Check network connectivity
- Look for Firebase errors in console
```

---

## Code Style

### Naming Convention
```typescript
// Components: PascalCase
export default function LoginScreen() { }

// Functions: camelCase
const handleLogin = () => { }

// Constants: UPPER_SNAKE_CASE
const MAX_MESSAGE_LENGTH = 1000

// Types: PascalCase
interface MessageType { }
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>
```

### File Organization
```
features/
├── components/        # Reusable UI components
├── screens/          # Full page components
├── context/          # Context & state
├── utils/            # Utility functions
├── types/            # TypeScript types
└── hooks/            # Custom hooks
```

---

## Git Workflow

```bash
# Create branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "feat: add awesome feature"

# Push
git push origin feature/your-feature

# Create pull request on GitHub
```

---

## Environment Variables

Create `.env` file for sensitive data:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... etc
```

Then use:
```typescript
import { FIREBASE_API_KEY } from '@env'

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  // ...
}
```

---

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (with Detox)
```bash
# Install Detox
npm install detox-cli detox --save-dev

# Build
detox build-framework-cache
detox build-app --configuration release

# Run tests
detox test --configuration release
```

---

## Deployment

### Development Build
```bash
npm run android
```

### Production Build
```bash
cd android
./gradlew assembleRelease

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore release-key.jks \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  release-key-alias

# Align
zipalign -v 4 app-release-unsigned.apk ChatApp.apk
```

### Release on Play Store
1. Go to: https://play.google.com/console
2. Create new app or update existing
3. Upload APK/AAB
4. Fill store listing
5. Review and publish

---

## Resources

- 📖 [React Native Docs](https://reactnative.dev/)
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- 🗺️ [React Navigation](https://reactnavigation.org/)
- 💾 [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- 🎨 [React Native UI Kits](https://github.com/topics/react-native-ui-kit)

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-24  
**Maintainer**: Development Team
