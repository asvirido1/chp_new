import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";

interface UserContextValue {
  userId: string;
  isLoading: boolean;
  session: Session | null;
}

const UserContext = createContext<UserContextValue>({
  userId: "",
  isLoading: true,
  session: null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let mounted = true;

    const syncSession = async () => {
      try {
        const {
          data: { session: existingSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        let nextSession = existingSession;
        if (!nextSession) {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            throw error;
          }
          nextSession = data.session;
        }

        if (!mounted) {
          return;
        }

        setSession(nextSession ?? null);
        setUserId(nextSession?.user?.id ?? "");
      } catch {
        if (!mounted) {
          return;
        }
        setSession(null);
        setUserId("");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) {
        return;
      }
      setSession(nextSession);
      setUserId(nextSession?.user?.id ?? "");
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userId, isLoading, session }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
