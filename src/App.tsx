
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/teachers" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>Teachers Management Page</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <div>Students Management Page</div>
                </ProtectedRoute>
              } 
            />
            
            {/* Teacher Routes */}
            <Route 
              path="/my-courses" 
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <div>Teacher Courses Page</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-quiz" 
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <div>Create Quiz Page</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-progress" 
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <div>Student Progress Page</div>
                </ProtectedRoute>
              } 
            />
            
            {/* Student Routes */}
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <div>Available Courses Page</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-progress" 
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <div>My Progress Page</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <div>Take Quiz Page</div>
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
