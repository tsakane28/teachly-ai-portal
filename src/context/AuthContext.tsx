
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo, we'll use a simplified login
      // In a real app, this would call an API
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple role determination based on email (for demo)
      const role = email.includes("admin") ? "admin" : 
                 email.includes("teacher") ? "teacher" : "student";
      
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        role
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo, we'll use a simplified registration
      // In a real app, this would call an API
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
    } catch (err) {
      setError("Failed to register. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
