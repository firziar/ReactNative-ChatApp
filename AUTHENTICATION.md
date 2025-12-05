# 📱 Chat App - Autentikasi dengan Firebase

## Ringkasan Fitur

Aplikasi ChatApp sekarang memiliki sistem autentikasi lengkap dengan username-password menggunakan Firebase Authentication dan React Native.

## 🔐 Fitur Autentikasi

### 1. **Registrasi (Sign Up)**
- User dapat membuat akun baru dengan email dan password
- Validasi input:
  - Email tidak boleh kosong
  - Password minimal 6 karakter
  - Konfirmasi password harus sama
  - Error handling untuk email yang sudah terdaftar

### 2. **Login**
- User login dengan email dan password yang terdaftar
- Error handling untuk kredensial yang salah
- Loading state selama proses autentikasi

### 3. **Session Persistence**
- Auth state disimpan menggunakan AsyncStorage
- User tetap login meski app di-close dan dibuka kembali
- Automatic redirect ke Chat screen jika sudah login

### 4. **Logout**
- Tombol logout di Chat screen
- Confirmation dialog sebelum logout
- Clear semua user data dan session

### 5. **Real-time Chat dengan User Identity**
- Setiap pesan teridentifikasi dengan email pengirim
- Hanya user yang sudah login dapat mengirim pesan
- Messages disimpan di Firestore dengan timestamp

## 🏗️ Struktur Arsitektur

```
App.tsx
  ├── AuthProvider (context/AuthContext.tsx)
  │   ├── useAuth() hook
  │   └── Auth state management
  │
  ├── RootNavigator
  │   ├── LoginScreen (jika belum login)
  │   └── ChatScreen (jika sudah login)
  │
firebase.ts
  ├── Firebase initialization
  ├── Auth functions
  ├── Firestore setup
  └── AsyncStorage persistence
```

## 📁 File-File Penting

### `firebase.ts`
```typescript
// Custom React Native persistence dengan AsyncStorage
const reactNativePersistence = {
  type: "LOCAL",
  _get: async (key) => AsyncStorage.getItem(key),
  _set: async (key, value) => AsyncStorage.setItem(key, value),
  _remove: async (key) => AsyncStorage.removeItem(key),
}

// Initialize auth dengan persistence
const auth = initializeAuth(app, {
  persistence: reactNativePersistence,
})

// Auth functions
export const registerUser = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password)

export const loginUser = (email, password) => 
  signInWithEmailAndPassword(auth, email, password)

export const logoutUser = () => signOut(auth)
```

### `context/AuthContext.tsx`
```typescript
interface AuthContextType {
  user: User | null           // Firebase user object
  loading: boolean            // Loading state
  error: string | null        // Error messages
  register: (email, password) => Promise<void>
  login: (email, password) => Promise<void>
  logout: () => Promise<void>
}

// Hook untuk akses auth di component
export function useAuth() {
  return useContext(AuthContext)
}
```

### `screens/LoginScreen.tsx`
```typescript
// Two modes: Login & Sign Up
const [isSignUp, setIsSignUp] = useState(false)

// Validasi input
// Error display
// Loading indicator
// Toggle antara login dan signup
```

### `screens/ChatScreen.tsx`
```typescript
// Display user email di header
// Logout button dengan confirmation
// Messages teridentifikasi dengan email
// Real-time message listener
```

### `App.tsx`
```typescript
// Wrap dengan AuthProvider
<AuthProvider>
  <RootNavigator />
</AuthProvider>

// Conditional navigation berdasarkan auth state
{user ? <Stack.Screen name="Chat" /> : <Stack.Screen name="Login" />}
```

## 🔄 Auth Flow

```
User Membuka App
    ↓
App Check Auth State via Firebase
    ↓
Loading Screen (sementara check)
    ↓
┌─────────────────┬────────────────┐
│                 │                │
v                 v                v
User Ada      Tidak Ada User    Error
│             │
Redirect ke   Redirect ke
Chat          Login
```

## 📝 User Flow

### Sign Up
```
1. Click "Daftar"
2. Toggle ke mode Sign Up
3. Masukkan Email
4. Masukkan Password (min 6 karakter)
5. Masukkan Konfirmasi Password
6. Tap "Daftar"
7. Auto redirect ke Chat (jika berhasil)
```

### Login
```
1. Masukkan Email
2. Masukkan Password
3. Tap "Masuk"
4. Auto redirect ke Chat (jika berhasil)
```

### Logout
```
1. Di Chat Screen, tap "Keluar"
2. Confirm di dialog
3. Redirect ke Login Screen
4. Session clear dari AsyncStorage
```

## 🔒 Security

### Firebase Security Rules
```firestore
match /messages/{document=**} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
}
```

**Kebijakan:**
- Only authenticated users dapat read/write messages
- Email dari auth digunakan sebagai identifier
- Password di-hash oleh Firebase

### AsyncStorage
- Auth token disimpan secara secure
- Session data di-persist untuk offline support

## 🧪 Testing

### Test Scenarios

1. **Sign Up**
   ```
   Email: user1@example.com
   Password: Password123
   Confirm: Password123
   Expected: Account created, redirect to Chat
   ```

2. **Login**
   ```
   Email: user1@example.com
   Password: Password123
   Expected: Login berhasil, redirect to Chat
   ```

3. **Wrong Password**
   ```
   Email: user1@example.com
   Password: wrongpassword
   Expected: Error message "Login gagal..."
   ```

4. **Session Persistence**
   ```
   - Login dengan user1
   - Close app completely
   - Open app kembali
   Expected: User tetap login, langsung ke Chat
   ```

5. **Logout**
   ```
   - Di Chat Screen, tap "Keluar"
   - Confirm logout
   Expected: Redirect ke Login, session clear
   ```

6. **Multi-User Chat**
   ```
   - User1 login di device 1
   - User2 login di device 2
   - User1 send message
   - Check User2 dapat melihat message dari user1
   Expected: Real-time sync via Firestore
   ```

## 🚀 Deployment

### Build APK
```bash
cd ChatApp
npm run android
# atau
npx react-native run-android
```

### Build Release APK
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## 📊 Dependencies

- `firebase`: ^12.6.0 - Firebase SDK
- `@react-native-async-storage/async-storage`: ^1.24.0 - Storage persistence
- `@react-navigation/native`: ^7.1.20 - Navigation
- React Native: 0.82.1

## 🐛 Troubleshooting

### Warning Firebase AsyncStorage
✅ Fixed dengan custom React Native persistence implementation

### ChatScreen params undefined
✅ Fixed dengan optional chaining fallback ke user.email

### Session tidak persist
✅ Fixed dengan AsyncStorage + initializeAuth persistence

### Multiple app instances
- Firebase handles multiple auth instances automatically
- Setiap device punya separate auth session

## 📚 Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase Console](https://console.firebase.google.com/)

## ✅ Checklist

- [x] Firebase Auth setup dengan email/password
- [x] AsyncStorage persistence
- [x] Sign Up screen
- [x] Login screen
- [x] Logout functionality
- [x] Session persistence
- [x] Error handling
- [x] Loading states
- [x] Real-time chat with user identity
- [x] Firestore integration
- [x] Navigation flow
- [x] Android build success

---

**Status**: ✅ Production Ready
**Last Updated**: 2025-11-24
**Version**: 1.0.0
