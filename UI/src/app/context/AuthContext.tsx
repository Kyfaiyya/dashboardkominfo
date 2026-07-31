import React, { createContext, useContext, useState } from "react";

interface UserProfile {
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginSuccess: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Read persisted auth from localStorage synchronously during initial render.
 * This prevents the "flash of unauthenticated state" that causes downstream
 * components to briefly think the user is logged out.
 */
function readPersistedAuth(): { token: string | null; user: UserProfile | null } {
  try {
    const savedToken = localStorage.getItem("kominfo_admin_token");
    const savedUser = localStorage.getItem("kominfo_admin_user");
    if (savedToken && savedUser) {
      const parsed = JSON.parse(savedUser) as UserProfile;
      // Basic shape validation – if the stored object is garbage, discard it
      if (parsed && typeof parsed.username === "string" && typeof parsed.role === "string") {
        return { token: savedToken, user: parsed };
      }
    }
  } catch {
    // Corrupt data → clean up silently
    localStorage.removeItem("kominfo_admin_token");
    localStorage.removeItem("kominfo_admin_user");
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializers run synchronously on first render — no useEffect delay
  const [token, setToken] = useState<string | null>(() => readPersistedAuth().token);
  const [user, setUser] = useState<UserProfile | null>(() => readPersistedAuth().user);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginSuccess = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem("kominfo_admin_token", newToken);
    localStorage.setItem("kominfo_admin_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("kominfo_admin_token");
    localStorage.removeItem("kominfo_admin_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoggedIn: !!token,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
