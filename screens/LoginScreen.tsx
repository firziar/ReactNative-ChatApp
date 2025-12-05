import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login, register, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [localError, setLocalError] = useState<string>("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setLocalError("Email dan password tidak boleh kosong");
      return;
    }

    try {
      setLocalError("");
      await login(email, password);
      // Navigation akan otomatis terjadi via App.tsx based on auth state
    } catch (err) {
      setLocalError("Login gagal. Periksa email dan password Anda.");
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setLocalError("Semua field harus diisi");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password minimal 6 karakter");
      return;
    }

    try {
      setLocalError("");
      await register(email, password);
      // Navigation akan otomatis terjadi via App.tsx based on auth state
    } catch (err) {
      setLocalError("Registrasi gagal. Email mungkin sudah terdaftar.");
    }
  };

  const displayError = localError || error;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isSignUp ? "Daftar" : "Masuk"}</Text>

        {displayError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{displayError}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button
              title={isSignUp ? "Daftar" : "Masuk"}
              onPress={isSignUp ? handleSignUp : handleLogin}
            />

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}
              </Text>
              <Button
                title={isSignUp ? "Masuk" : "Daftar"}
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setLocalError("");
                  setConfirmPassword("");
                }}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  errorBox: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  toggleContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
  },
});