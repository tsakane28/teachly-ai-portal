
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  const navigate = useNavigate();
  
  const handleLogin = async (data: any) => {
    try {
      // Simulate API call
      console.log("Login data:", data);
      
      // For demo purposes, simulate success
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify({
          id: "user-1",
          email: data.email,
          role: data.email.includes("admin") ? "admin" : 
                data.email.includes("teacher") ? "teacher" : "student"
        }));
        
        toast.success("Successfully logged in");
        navigate("/dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials.");
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="hidden lg:block">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">Welcome back to Teachly</h1>
                <p className="text-muted-foreground">
                  Sign in to your account to continue your educational journey with us.
                </p>
                <div className="space-y-6 pt-4">
                  <FeatureItem 
                    title="Track Your Progress" 
                    description="Monitor your learning journey and see your achievements over time." 
                  />
                  <FeatureItem 
                    title="Access All Courses" 
                    description="Get instant access to all your enrolled courses and materials." 
                  />
                  <FeatureItem 
                    title="Personalized Experience" 
                    description="Enjoy recommendations tailored to your learning style and interests." 
                  />
                </div>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto">
              <AuthForm type="login" onSubmit={handleLogin} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const FeatureItem = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0 mt-1">
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
        </div>
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Login;
