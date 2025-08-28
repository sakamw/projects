import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, _password: string): Promise<void> => {
    setLoading(true);
    try {
      // Mock authentication - replace with actual API call
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: email.includes("admin") ? "admin" : "user",
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    _password: string,
    name: string
  ): Promise<void> => {
    setLoading(true);
    try {
      // Mock registration - replace with actual API call
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: "user",
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
