# Fitur Autentikasi Username-Password dengan Firebase

## 📋 Overview
Fitur autentikasi pengguna menggunakan email dan password dengan Firebase Authentication telah berhasil diintegrasikan ke aplikasi React Native ChatApp untuk platform Android.

## ✨ Fitur-Fitur Utama

### 1. **Registrasi Pengguna**
- User dapat membuat akun baru dengan email dan password
- Validasi password minimal 6 karakter
- Validasi konfirmasi password
- Error handling untuk email yang sudah terdaftar

### 2. **Login Pengguna**
- User dapat login dengan email dan password yang terdaftar
- Persistent authentication state
- Error handling untuk kredensial salah

### 3. **Session Management**
- Automatic navigation berdasarkan auth state
- Loading indicator saat checking session
- User session tetap aktif meski app di-close

### 4. **Logout Functionality**
- Tombol logout dengan confirmation dialog
- Clear session saat logout
- Redirect ke login screen

### 5. **User Information Display**
- Email user ditampilkan di chat room
- Messages dikirim dengan email sender
- User bisa melihat siapa yang mengirim pesan

## 🏗️ Struktur File

```
context/
├── AuthContext.tsx          # Context & hooks untuk authentication

screens/
├── LoginScreen.tsx          # UI untuk login/signup
└── ChatScreen.tsx           # Chat screen dengan logout

firebase.ts                 # Firebase config & auth functions

App.tsx                     # Root navigator dengan auth flow
```

## 📝 File yang Diubah/Dibuat

### 1. **context/AuthContext.tsx** (BARU)
```typescript
- AuthProvider: Context provider untuk authentication
- useAuth(): Hook untuk mengakses auth context
- Functions: register(), login(), logout()
- State: user, loading, error
```

### 2. **firebase.ts** (UPDATED)
```typescript
- registerUser(email, password)
- loginUser(email, password)
- logoutUser()
- Export Firebase Auth functions
```

### 3. **screens/LoginScreen.tsx** (UPDATED)
```typescript
- Toggle antara Login dan Sign Up mode
- Form validation
- Error display
- Loading state dengan ActivityIndicator
```

### 4. **screens/ChatScreen.tsx** (UPDATED)
```typescript
- Header dengan user email
- Logout button
- Messages dikirim dengan email user
```

### 5. **App.tsx** (UPDATED)
```typescript
- Wrap dengan AuthProvider
- Conditional navigation berdasarkan user auth state
- Loading screen saat checking session
```

## 🔐 Firebase Security Rules

Pastikan Firestore rules di Firebase Console sudah diset:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## 🚀 Cara Menggunakan

### Sign Up
1. Tap "Daftar" untuk mode registrasi
2. Masukkan email dan password
3. Tap "Daftar" untuk membuat akun

### Login
1. Masukkan email dan password
2. Tap "Masuk" untuk login

### Logout
1. Di Chat Room, tap tombol "Keluar"
2. Confirm logout
3. Akan kembali ke Login screen

## 🧪 Testing

Untuk test aplikasi:

```bash
# Build dan run di Android
npm run android

# Atau
npx react-native run-android
```

## 📦 Dependencies

- `firebase`: ^12.6.0 - Firebase SDK
- `@react-navigation/native`: ^7.1.20 - Navigation
- `@react-navigation/native-stack`: ^7.6.3 - Stack navigator
- React Native: 0.82.1

## ⚠️ Error Handling

Aplikasi sudah handle berbagai error scenarios:

- Email kosong/invalid
- Password terlalu pendek
- Email sudah terdaftar
- Kredensial salah
- Network error

Error messages ditampilkan di red alert box di login screen.

## 🔄 Auth Flow

```
┌─────────────────┐
│   App Start     │
└────────┬────────┘
         │
    Check Auth State
         │
    ┌────┴─────┐
    │           │
┌───▼────┐  ┌──▼────┐
│Logged  │  │Not    │
│In      │  │Logged │
└───┬────┘  └──┬────┘
    │         │
  Chat      Login/
  Screen    Signup
```

## 📝 Notes

- Email digunakan sebagai unique identifier untuk user
- Password di-hash oleh Firebase Auth
- Session persisten menggunakan Firebase Auth state
- Logout clear semua user data dari memory
