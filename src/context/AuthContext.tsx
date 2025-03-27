
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  courses?: string[];
  progress?: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  approveTeacher: (teacherId: string) => Promise<void>;
  updateUserProfile: (userId: string, data: Partial<User>) => Promise<void>;
  getUsers: (role?: string) => User[];
}

// Mock database
const USERS_KEY = "teachly_users";
const COURSES_KEY = "teachly_courses";
const QUESTIONS_KEY = "teachly_questions";
const ATTEMPTS_KEY = "teachly_attempts";

interface Course {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  questions: string[];
}

interface Question {
  id: string;
  courseId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

interface Attempt {
  id: string;
  userId: string;
  courseId: string;
  questionId: string;
  answer: number;
  isCorrect: boolean;
  timestamp: number;
}

// Initialize mock database if it doesn't exist
const initializeDatabase = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    // Create default admin user
    const adminUser = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@teachly.com",
      role: "admin",
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
  }
  
  if (!localStorage.getItem(COURSES_KEY)) {
    localStorage.setItem(COURSES_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(QUESTIONS_KEY)) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(ATTEMPTS_KEY)) {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify([]));
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the database
  useEffect(() => {
    initializeDatabase();
  }, []);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("current_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Get all users with optional role filter
  const getUsers = (role?: string): User[] => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (role) {
      return users.filter((u: User) => u.role === role);
    }
    return users;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get all users from our mock database
      const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      
      // Find user with matching email
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // In a real app, we would check password hash
      // For this demo, we'll just simulate success
      
      // For teachers, check if they're approved
      if (user.role === "teacher" && user.status !== "approved") {
        throw new Error("Your teacher account is pending approval.");
      }
      
      // Set the current user
      setUser(user);
      localStorage.setItem("current_user", JSON.stringify(user));
      toast.success(`Welcome ${user.name || user.email}!`);
      
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
      toast.error(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current users
      const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already in use");
      }
      
      // Create new user object
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        // For teachers, set status as pending approval
        ...(role === "teacher" ? { status: "pending" } : {}),
        // Initialize empty arrays/objects for tracking
        courses: [],
        progress: {},
      };
      
      // Add to users array
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // If it's a student or admin, log them in directly
      // If it's a teacher, show pending approval message
      if (role !== "teacher") {
        setUser(newUser);
        localStorage.setItem("current_user", JSON.stringify(newUser));
        toast.success("Account created successfully!");
      } else {
        toast.success("Your teacher application has been submitted for approval!");
      }
      
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
      toast.error(err.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
    toast.success("You have been logged out");
  };

  // Admin function to approve teacher account
  const approveTeacher = async (teacherId: string) => {
    setIsLoading(true);
    try {
      const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const updatedUsers = users.map(u => {
        if (u.id === teacherId && u.role === "teacher") {
          return { ...u, status: "approved" };
        }
        return u;
      });
      
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      toast.success("Teacher approved successfully");
    } catch (error) {
      toast.error("Failed to approve teacher");
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile data
  const updateUserProfile = async (userId: string, data: Partial<User>) => {
    setIsLoading(true);
    try {
      const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { ...u, ...data };
        }
        return u;
      });
      
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      
      // If current user was updated, update the state and localStorage
      if (user && user.id === userId) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("current_user", JSON.stringify(updatedUser));
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      error, 
      approveTeacher,
      updateUserProfile,
      getUsers
    }}>
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
