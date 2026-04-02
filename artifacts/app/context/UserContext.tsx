import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const USER_ID_KEY = "chpok_user_id";

interface UserContextValue {
  userId: string;
  isLoading: boolean;
}

const UserContext = createContext<UserContextValue>({
  userId: "",
  isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let id = await AsyncStorage.getItem(USER_ID_KEY);
        if (!id) {
          id =
            "user_" +
            Date.now().toString() +
            Math.random().toString(36).substr(2, 6);
          await AsyncStorage.setItem(USER_ID_KEY, id);
        }
        setUserId(id);
      } catch {
        setUserId("user_anonymous");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ userId, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
