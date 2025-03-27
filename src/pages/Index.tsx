
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap, BarChart, Users, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";

const Index = () => {
  // Add animation on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
      el.classList.remove("fade-in");
      // Fix: Cast the element to HTMLElement before accessing style property
      (el as HTMLElement).style.opacity = "0";
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="flex flex-col min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Introducing Teachly AI
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              The Future of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Education
              </span>{" "}
              is Here
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              An AI-powered learning platform that adapts to your needs, providing personalized education for students, teachers, and administrators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="font-medium">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Featured section */}
          <div className="mt-16 md:mt-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
            <div className="relative z-20 bg-card border border-border shadow-lg rounded-xl overflow-hidden mx-auto max-w-5xl">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-1">
                <div className="h-8 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-1">For Students</h3>
                    <p className="text-sm text-muted-foreground">
                      Personalized learning paths and adaptive quizzes
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-1">For Teachers</h3>
                    <p className="text-sm text-muted-foreground">
                      Powerful course creation tools and student insights
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                      <BarChart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-1">For Admins</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive analytics and management tools
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary">
                Platform Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Designed for modern education
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform combines AI-powered insights with intuitive design to create a seamless educational experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="animate-on-scroll" 
                  hoverable 
                >
                  <div className="flex flex-col space-y-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="relative z-10 px-6 py-12 md:p-12 lg:p-16 text-center">
                <div className="animate-on-scroll">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to transform your educational journey?
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Join thousands of students, teachers, and institutions who are already using Teachly to enhance their learning experience.
                  </p>
                  <Link to="/register">
                    <Button size="lg" className="font-medium">
                      Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

// Feature data
const features = [
  {
    title: "AI-Powered Analytics",
    description: "Our platform uses advanced AI to identify learning patterns and provide personalized insights.",
    icon: BarChart,
  },
  {
    title: "Interactive Courses",
    description: "Create and take engaging courses with multimedia content and interactive quizzes.",
    icon: BookOpen,
  },
  {
    title: "Progress Tracking",
    description: "Monitor student progress with detailed analytics and performance metrics.",
    icon: CheckCircle,
  },
  {
    title: "Multiple User Roles",
    description: "Different interfaces for students, teachers, and administrators with role-specific features.",
    icon: Users,
  },
  {
    title: "Personalized Learning",
    description: "Adaptive learning paths that adjust to each student's pace and learning style.",
    icon: GraduationCap,
  },
  {
    title: "Comprehensive Dashboard",
    description: "All-in-one dashboard for managing courses, exams, and educational resources.",
    icon: BarChart,
  },
];

export default Index;
