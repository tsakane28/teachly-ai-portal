
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";

const Register = () => {
  const navigate = useNavigate();
  
  const handleRegister = async (data: any) => {
    try {
      // Simulate API call
      console.log("Registration data:", data);
      
      // For demo purposes, simulate success with delay
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify({
          id: "user-" + Math.floor(Math.random() * 1000),
          name: data.name,
          email: data.email,
          role: data.role
        }));
        
        toast.success("Account created successfully");
        navigate("/dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to create account. Please try again later.");
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
                <h1 className="text-3xl font-bold">Join Teachly today</h1>
                <p className="text-muted-foreground">
                  Create your account to unlock the full potential of our AI-powered educational platform.
                </p>
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-medium text-lg mb-2">For Students</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <div className="h-5 w-5 flex-shrink-0 text-primary mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-2">Access personalized learning paths</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 flex-shrink-0 text-primary mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-2">Take interactive quizzes and exams</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 flex-shrink-0 text-primary mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-2">Track progress across all courses</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="font-medium text-lg mb-2">For Teachers</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <div className="h-5 w-5 flex-shrink-0 text-primary mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-2">Create and manage courses with ease</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 flex-shrink-0 text-primary mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-2">Access AI-powered teaching insights</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 flex-shrink-0 text-primary mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-2">Track student performance and engagement</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto">
              <AuthForm type="register" onSubmit={handleRegister} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Register;
