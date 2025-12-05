import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "../firebase";
import { messagesCollection } from "../firebase";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type MessageType = {
  id: string;
  text: string;
  user: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  synced?: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ route }: Props) {
  const { user, logout } = useAuth();

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // --------------------------------------------------
  // Load messages from AsyncStorage (offline cache)
  // --------------------------------------------------
  const loadCachedMessages = async () => {
    try {
      const cached = await AsyncStorage.getItem(`@messages_${user?.email}`);
      if (cached) {
        const cachedMessages = JSON.parse(cached);
        setMessages(cachedMessages);
        console.log("Loaded cached messages:", cachedMessages.length);
      }
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

  // --------------------------------------------------
  // Save messages to AsyncStorage (cache)
  // --------------------------------------------------
  const saveCachedMessages = async (msgs: MessageType[]) => {
    try {
      await AsyncStorage.setItem(
        `@messages_${user?.email}`,
        JSON.stringify(msgs)
      );
      console.log("Cached messages saved:", msgs.length);
    } catch (error) {
      console.error("Error caching messages:", error);
    }
  };

  // --------------------------------------------------
  // Load messages (Realtime listener)
  // --------------------------------------------------
  useEffect(() => {
    if (!user?.email) {
      console.log("No user email, skipping listener setup");
      return;
    }

    // First load cached messages
    loadCachedMessages();

    console.log("Setting up message listener for user:", user?.email);
    
    const q = query(messagesCollection, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: MessageType[] = [];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...(doc.data() as Omit<MessageType, "id">),
            synced: true,
          });
        });

        setMessages(list);
        saveCachedMessages(list);
        setIsOnline(true);
        console.log("Messages updated:", list.length, "messages");
      },
      (error) => {
        console.error("Error listening to messages:", error);
        setIsOnline(false);
        // If offline, load from cache
        loadCachedMessages();
      }
    );

    return () => {
      console.log("Cleaning up message listener");
      unsub();
    };
  }, [user?.email]);

  // --------------------------------------------------
  // Send message (with offline support)
  // --------------------------------------------------
  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: MessageType = {
      id: `offline_${Date.now()}`,
      text: message,
      user: user?.email || "Anonymous",
      createdAt: null,
      synced: false,
    };

    try {
      if (isOnline) {
        // Send to Firebase
        await addDoc(messagesCollection, {
          text: message,
          user: user?.email || "Anonymous",
          createdAt: serverTimestamp(),
        });
        console.log("Message sent to Firebase:", user?.email);
      } else {
        // Save offline message to local storage
        const offlineMessages = await AsyncStorage.getItem(
          `@pending_messages_${user?.email}`
        );
        const pending = offlineMessages ? JSON.parse(offlineMessages) : [];
        pending.push(newMessage);
        await AsyncStorage.setItem(
          `@pending_messages_${user?.email}`,
          JSON.stringify(pending)
        );
        console.log("Message saved for offline sync");
      }

      // Update UI immediately
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      saveCachedMessages(updatedMessages);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Gagal mengirim pesan");
    }
  };

  // --------------------------------------------------
  // Logout handler
  // --------------------------------------------------
  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", onPress: () => {} },
      {
        text: "Keluar",
        onPress: async () => {
          try {
            await logout();
            // Navigation akan otomatis ke LoginScreen saat user state berubah
          } catch (err) {
            Alert.alert("Error", "Gagal logout");
          }
        },
        style: "destructive",
      },
    ]);
  };

  // --------------------------------------------------
  // Render individual chat bubble
  // --------------------------------------------------
  const renderItem = ({ item }: { item: MessageType }) => (
    <View
      style={[
        styles.msgBox,
        item.user === user?.email ? styles.myMsg : styles.otherMsg,
      ]}
    >
      <Text style={styles.sender}>{item.user}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <Text style={{ flex: 1 }}>{item.text}</Text>
        {/* Delivery Status - hanya untuk pesan user sendiri */}
        {item.user === user?.email && (
          <Text style={styles.deliveryStatus}>
            {item.synced ? "✓✓" : "⏳"}
          </Text>
        )}
      </View>
    </View>
  );

  // --------------------------------------------------
  // UI Layout
  // --------------------------------------------------
  return (
    <View style={{ flex: 1 }}>
      {/* Header dengan info user */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Global Chat Room</Text>
          <Text style={styles.userEmail}>👤 {user?.email}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          {/* Status Indicator */}
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isOnline ? "#4CAF50" : "#FF6B6B" },
            ]}
          >
            <Text style={styles.statusText}>
              {isOnline ? "🟢" : "🔴"}
            </Text>
          </View>
          <Button title="Keluar" onPress={handleLogout} color="#f44336" />
        </View>
      </View>

      {/* Offline Mode Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            📡 Offline - Messages akan disync saat online
          </Text>
        </View>
      )}

      {/* Messages list */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Kirim" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2196f3",
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  userEmail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  statusIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
  },
  offlineBanner: {
    backgroundColor: "#FFF3CD",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FF6B6B",
  },
  offlineText: {
    fontSize: 12,
    color: "#856404",
    fontWeight: "500",
  },
  msgBox: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    maxWidth: "80%",
  },
  myMsg: {
    backgroundColor: "#d1f0ff",
    alignSelf: "flex-end",
  },
  otherMsg: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 12,
  },
  deliveryStatus: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2196f3",
    marginLeft: 4,
    flexShrink: 0,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
  },
});