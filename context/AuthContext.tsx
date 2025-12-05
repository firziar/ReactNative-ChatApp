import React, { createContext, useEffect, useState, ReactNode } from "react";
import { auth, onAuthStateChanged, registerUser as firebaseRegister, loginUser as firebaseLogin, logoutUser as firebaseLogout } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session and auto-login on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, check Firebase auth state (might still be in memory)
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            // User is already logged in (session from memory or Firebase)
            setUser(currentUser);
          } else {
            // No current Firebase session, check AsyncStorage for saved credentials
            try {
              const savedSession = await AsyncStorage.getItem("@chat_session");
              if (savedSession) {
                const { email, password } = JSON.parse(savedSession);
                // Try to auto-login with saved credentials
                try {
                  await firebaseLogin(email, password);
                  // If successful, onAuthStateChanged will fire and update user state
                } catch (loginErr) {
                  // Saved credentials invalid, clear them
                  console.warn("Auto-login failed, clearing saved session");
                  await AsyncStorage.removeItem("@chat_session");
                  setUser(null);
                }
              }
            } catch (err) {
              console.error("Failed to check saved session:", err);
            }
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Auth initialization error:", err);
        setLoading(false);
      }
    };

    const unsubscribe = initializeAuth();
    return () => {
      if (unsubscribe) unsubscribe.then(fn => fn?.());
    };
  }, []);

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      await firebaseRegister(email, password);
      // Save credentials for auto-login
      await AsyncStorage.setItem(
        "@chat_session",
        JSON.stringify({ email, password })
      );
    } catch (err: any) {
      const errorMessage = err.message || "Registrasi gagal";
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await firebaseLogin(email, password);
      // Save credentials for auto-login
      await AsyncStorage.setItem(
        "@chat_session",
        JSON.stringify({ email, password })
      );
    } catch (err: any) {
      const errorMessage = err.message || "Login gagal";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      // First clear AsyncStorage session
      await AsyncStorage.removeItem("@chat_session");
      // Then sign out from Firebase - this will trigger onAuthStateChanged
      await firebaseLogout();
      // Explicitly set user to null for immediate state update
      setUser(null);
      console.log("Logout successful, user cleared");
    } catch (err: any) {
      const errorMessage = err.message || "Logout gagal";
      setError(errorMessage);
      console.error("Logout error:", err);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
