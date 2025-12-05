# ✅ Chat App - Testing Checklist

## Pre-Testing Checklist

- [ ] Android emulator running
- [ ] Metro bundler running (`npm start`)
- [ ] App installed on emulator (`npm run android`)
- [ ] Internet connection active
- [ ] Firebase project accessible
- [ ] Console logs visible

---

## Authentication Testing

### Sign Up Flow
- [ ] Can access Sign Up screen
- [ ] "Daftar" link works and toggles to sign up mode
- [ ] Email field accepts input
- [ ] Password field masks input
- [ ] Confirm password field shows
- [ ] Can enter all required fields
- [ ] Error for empty fields
- [ ] Error for password < 6 chars
- [ ] Error for password mismatch
- [ ] Success creates account
- [ ] Auto redirects to Chat screen on success
- [ ] Error shown for duplicate email
- [ ] Loading indicator shown during signup
- [ ] Can toggle back to Login mode

### Login Flow
- [ ] Can access Login screen
- [ ] Email field accepts input
- [ ] Password field masks input
- [ ] Can submit with valid credentials
- [ ] Success redirects to Chat
- [ ] Error for wrong password
- [ ] Error for non-existent email
- [ ] Error for empty fields
- [ ] Loading indicator shown during login
- [ ] Can toggle to Sign Up mode
- [ ] Previous credentials not remembered (security)

### Session Persistence
- [ ] Login with user account
- [ ] Close app completely
- [ ] Reopen app
- [ ] Auto redirected to Chat (not Login)
- [ ] User email shows correctly
- [ ] Messages still load
- [ ] Logout
- [ ] Close and reopen app
- [ ] Back at Login screen
- [ ] Can login again

---

## Chat Functionality

### Message Sending
- [ ] Text input field visible
- [ ] "Kirim" button clickable
- [ ] Can type message
- [ ] Empty message doesn't send
- [ ] Message appears immediately
- [ ] Message shows your email
- [ ] Message persists in list
- [ ] No duplicate messages

### Message Display
- [ ] Messages appear in order (oldest first)
- [ ] Your messages aligned right
- [ ] Other messages aligned left
- [ ] Different colors for yours vs others
- [ ] Sender name displayed
- [ ] Message timestamps accurate (if shown)
- [ ] Can scroll through messages
- [ ] Old messages load correctly

### Real-time Sync
- [ ] Open app on 2 devices/emulators
- [ ] Login as 2 different users
- [ ] User 1 sends message
- [ ] User 2 receives immediately
- [ ] Message shows correct sender
- [ ] User 2 sends message
- [ ] User 1 receives immediately
- [ ] No message delays > 2 seconds

---

## UI/UX Testing

### Login Screen
- [ ] Clean layout
- [ ] Title clear
- [ ] Input fields clearly labeled
- [ ] Error messages readable
- [ ] Error box visible and styled
- [ ] Toggle button accessible
- [ ] Loading spinner shows
- [ ] Buttons appropriately sized
- [ ] Form responsive on different screen sizes

### Chat Screen
- [ ] Header shows app title
- [ ] User email visible in header
- [ ] Logout button visible and styled
- [ ] Message input at bottom
- [ ] Send button aligned correctly
- [ ] Messages scrollable
- [ ] Layout responsive
- [ ] No overlapping elements
- [ ] Safe area respected (notches)

### Color & Styling
- [ ] Login screen looks modern
- [ ] Chat bubbles styled consistently
- [ ] Text contrast is good
- [ ] Buttons are tappable (48px min)
- [ ] Colors are brand-consistent

---

## Error Handling

### Sign Up Errors
- [ ] **Empty Fields**: Error shown
- [ ] **Short Password**: Shows min length error
- [ ] **Password Mismatch**: Shows mismatch error
- [ ] **Invalid Email**: Error shown (if applicable)
- [ ] **Existing Email**: Shows "already registered" error
- [ ] **Network Error**: Handles gracefully
- [ ] **Firebase Down**: Error displayed

### Login Errors
- [ ] **Empty Fields**: Error shown
- [ ] **Wrong Password**: Shows auth error
- [ ] **Non-existent Email**: Shows not found error
- [ ] **Network Error**: Handles gracefully
- [ ] **Multiple Failed Attempts**: Doesn't crash
- [ ] **Error Cleared**: Clears when user retries

---

## Performance Testing

### Loading Times
- [ ] App starts in < 3 seconds
- [ ] Login in < 2 seconds
- [ ] Chat loads in < 2 seconds
- [ ] Messages load smoothly
- [ ] No freezes during typing
- [ ] Smooth scrolling
- [ ] Logout immediate

### Memory Usage
- [ ] No memory leaks on logout
- [ ] No memory leaks on back navigation
- [ ] App doesn't crash with 100+ messages
- [ ] Smooth with slow network
- [ ] Responsive with 10 concurrent users

---

## Security Testing

### Authentication
- [ ] Can't access Chat without login
- [ ] Direct URL navigation blocked
- [ ] Can't see other users' data
- [ ] Logout clears session
- [ ] Passwords never logged
- [ ] Token properly managed
- [ ] Can't craft auth bypass

### Data Privacy
- [ ] Messages encrypted at rest
- [ ] SSL/HTTPS used
- [ ] No sensitive data in logs
- [ ] AsyncStorage data not accessible from other apps
- [ ] No hardcoded secrets in code
- [ ] API keys properly secured

---

## Device Testing

### Screen Sizes
- [ ] Works on small phones (4.5")
- [ ] Works on large phones (6.5"+)
- [ ] Works on tablets (if applicable)
- [ ] Landscape mode works
- [ ] Portrait mode works

### Android Versions
- [ ] Android 8 (API 26)
- [ ] Android 9 (API 28)
- [ ] Android 10 (API 29)
- [ ] Android 11 (API 30)
- [ ] Android 12+ (API 31+)

### Connectivity
- [ ] Works on WiFi
- [ ] Works on 4G/LTE
- [ ] Handles connection loss gracefully
- [ ] Reconnects when network returns
- [ ] Messages sync after reconnect

---

## Edge Cases

### Network Issues
- [ ] [ ] App doesn't crash if Firebase down
- [ ] [ ] Gracefully handles timeout
- [ ] [ ] Retries failed operations
- [ ] [ ] Offline mode (messages queued)
- [ ] [ ] Shows offline indicator

### User Actions
- [ ] Rapidly tapping buttons doesn't cause issues
- [ ] Clicking logout while loading stops gracefully
- [ ] Back button handled correctly
- [ ] Orientation change doesn't crash
- [ ] App pause/resume works
- [ ] Deep links work (if implemented)

### Data Validation
- [ ] Very long emails handled
- [ ] Very long messages handled
- [ ] Special characters in names work
- [ ] Unicode characters supported
- [ ] Spam-like repeated messages allowed
- [ ] Empty message rejected

---

## Integration Testing

### Firebase Integration
- [ ] [ ] Messages persist to Firestore
- [ ] [ ] Auth state updates correctly
- [ ] [ ] Real-time listeners work
- [ ] [ ] User data saves correctly
- [ ] [ ] Can read all messages
- [ ] [ ] No write errors

### Navigation Integration
- [ ] [ ] Auth flow complete
- [ ] [ ] Can navigate between screens
- [ ] [ ] Back navigation works
- [ ] [ ] Logout clears navigation stack
- [ ] [ ] No dead screens

---

## Regression Testing

### After Updates
- [ ] Previous functionality still works
- [ ] No new errors introduced
- [ ] Performance not degraded
- [ ] UI not broken
- [ ] No duplicate features
- [ ] Existing users can still login

---

## Accessibility Testing (Optional)

- [ ] Text size readable (minimum 12sp)
- [ ] Touch targets at least 48x48dp
- [ ] Color contrast sufficient (4.5:1)
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (if implemented)
- [ ] No flashing content > 3x per second

---

## Documentation Verification

- [ ] README accurate
- [ ] AUTHENTICATION.md complete
- [ ] DEVELOPER_GUIDE.md helpful
- [ ] Code comments clear
- [ ] API documented
- [ ] Error codes documented

---

## Final Checks Before Release

- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings (except Firebase info)
- [ ] Code reviewed
- [ ] No hardcoded values
- [ ] No debug flags enabled
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Build APK successfully
- [ ] APK tested on device

---

## Sign-Off

**Tested By**: _____________________

**Date**: _____________________

**Devices Tested**:
- [ ] Emulator
- [ ] Physical Device 1 (Model: _____________)
- [ ] Physical Device 2 (Model: _____________)

**Overall Status**: [ ] ✅ PASS [ ] ⚠️ CONDITIONAL [ ] ❌ FAIL

**Issues Found**:
```
1. ____________________________________
2. ____________________________________
3. ____________________________________
```

**Notes**:
```
_________________________________
_________________________________
```

---

## Test History

| Date | Tester | Status | Notes |
|------|--------|--------|-------|
| 2025-11-24 | - | ⏳ Pending | Initial testing |
| | | | |

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-24
