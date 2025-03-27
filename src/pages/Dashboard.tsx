
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Book, 
  Users, 
  BarChart, 
  Settings, 
  LogOut, 
  ChevronDown, 
  User,
  GraduationCap,
  Clock,
  FileText
} from "lucide-react";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";

interface UserData {
  id: string;
  name?: string;
  email: string;
  role: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  
  if (!user) return null;
  
  return (
    <div className="flex h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Book className="h-6 w-6" />
            <span className="font-semibold text-lg">Teachly</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem 
            icon={Home} 
            text="Overview" 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
          />
          
          {user.role === "admin" && (
            <>
              <SidebarItem 
                icon={Users} 
                text="Teachers" 
                active={activeTab === "teachers"} 
                onClick={() => setActiveTab("teachers")} 
              />
              <SidebarItem 
                icon={GraduationCap} 
                text="Students" 
                active={activeTab === "students"} 
                onClick={() => setActiveTab("students")} 
              />
            </>
          )}
          
          {(user.role === "admin" || user.role === "teacher") && (
            <SidebarItem 
              icon={Book} 
              text="Courses" 
              active={activeTab === "courses"} 
              onClick={() => setActiveTab("courses")} 
            />
          )}
          
          {user.role === "student" && (
            <SidebarItem 
              icon={FileText} 
              text="My Exams" 
              active={activeTab === "exams"} 
              onClick={() => setActiveTab("exams")} 
            />
          )}
          
          <SidebarItem 
            icon={BarChart} 
            text="Analytics" 
            active={activeTab === "analytics"} 
            onClick={() => setActiveTab("analytics")} 
          />
          
          <SidebarItem 
            icon={Settings} 
            text="Settings" 
            active={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")} 
          />
        </nav>
        
        <div className="p-4 border-t border-border">
          <Button variant="outline" fullWidth onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Log Out
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2 bg-secondary/50 px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{user.name || user.email}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "overview" && <OverviewTab userRole={user.role} />}
          {activeTab === "teachers" && <TeachersTab />}
          {activeTab === "students" && <StudentsTab />}
          {activeTab === "courses" && <CoursesTab userRole={user.role} />}
          {activeTab === "exams" && <ExamsTab />}
          {activeTab === "analytics" && <AnalyticsTab userRole={user.role} />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ 
  icon: Icon, 
  text, 
  active, 
  onClick 
}: { 
  icon: any; 
  text: string; 
  active: boolean; 
  onClick: () => void;
}) => {
  return (
    <button
      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{text}</span>
    </button>
  );
};

// Dashboard Tab Components
const OverviewTab = ({ userRole }: { userRole: string }) => {
  // Sample data
  const stats = [
    { 
      title: "Total Students", 
      value: "456", 
      icon: Users,
      change: "+12% from last month",
      color: "bg-blue-500/10 text-blue-500",
    },
    { 
      title: "Active Courses", 
      value: "24", 
      icon: Book,
      change: "+3 new courses",
      color: "bg-green-500/10 text-green-500",
    },
    { 
      title: "Exams Created", 
      value: "128", 
      icon: FileText,
      change: "+8 this week",
      color: "bg-violet-500/10 text-violet-500",
    },
    { 
      title: "Avg. Completion", 
      value: "87%", 
      icon: BarChart,
      change: "+2% improvement",
      color: "bg-amber-500/10 text-amber-500",
    },
  ];
  
  const recentActivity = [
    { id: 1, action: "New student enrolled", course: "Advanced Mathematics", time: "10 minutes ago" },
    { id: 2, action: "Quiz submitted", course: "Introduction to Biology", time: "25 minutes ago" },
    { id: 3, action: "Course updated", course: "History 101", time: "1 hour ago" },
    { id: 4, action: "New question added", course: "Physics Fundamentals", time: "2 hours ago" },
    { id: 5, action: "Exam completed", course: "Computer Science Basics", time: "3 hours ago" },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Welcome to your {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your educational platform today.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-on-scroll">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Recent Activity</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.course}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">AI Insights</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <h4 className="text-sm font-medium text-blue-500">Learning Pattern</h4>
              <p className="text-xs mt-1">
                Students perform better with 25-minute study sessions followed by 5-minute breaks.
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <h4 className="text-sm font-medium text-green-500">Course Suggestion</h4>
              <p className="text-xs mt-1">
                Based on engagement data, consider adding more visual elements to Biology 101.
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <h4 className="text-sm font-medium text-amber-500">Exam Analysis</h4>
              <p className="text-xs mt-1">
                Question 7 in Physics Final has a 23% success rate - consider revision.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" fullWidth>
              View All Insights
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const TeachersTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Teachers</h2>
        <Button>Add New Teacher</Button>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Courses</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">Dr. John Smith</td>
                  <td className="py-3 px-4">john.smith@example.com</td>
                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500">
                      Approved
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-sm text-primary hover:underline">Edit</button>
                      <button className="text-sm text-destructive hover:underline">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const StudentsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Students</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Add New Student</Button>
        </div>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Courses Enrolled</th>
                <th className="text-left py-3 px-4 font-medium">Avg. Score</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-b border-border last:border-0">
                  <td className="py-3 px-4">Alice Johnson</td>
                  <td className="py-3 px-4">alice@example.com</td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">92%</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-sm text-primary hover:underline">View</button>
                      <button className="text-sm text-primary hover:underline">Edit</button>
                      <button className="text-sm text-destructive hover:underline">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const CoursesTab = ({ userRole }: { userRole: string }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Courses</h2>
        <Button>Create New Course</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="overflow-hidden hover-scale">
            <div className="h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
              <Book className="h-12 w-12 text-primary/60" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Introduction to Biology</h3>
                  <p className="text-muted-foreground text-sm mt-1">12 lessons • 8 quizzes</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500">
                  Active
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">Students: </span>
                  <span className="font-medium">42</span>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ExamsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Exams</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="hover-scale">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Biology Final Exam</h3>
                <p className="text-muted-foreground text-sm mt-1">25 questions • 60 minutes</p>
              </div>
              <div className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 h-fit">
                Available
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Best Score:</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">Attempts:</span>
                <span className="font-medium">2</span>
              </div>
              <Button fullWidth>Start Exam</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AnalyticsTab = ({ userRole }: { userRole: string }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="font-medium mb-4">Performance Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-secondary/50 rounded-lg">
            <p className="text-muted-foreground">Chart Placeholder</p>
          </div>
        </Card>
        
        <Card>
          <h3 className="font-medium mb-4">Completion Rate</h3>
          <div className="h-64 flex items-center justify-center bg-secondary/50 rounded-lg">
            <p className="text-muted-foreground">Chart Placeholder</p>
          </div>
        </Card>
      </div>
      
      <Card>
        <h3 className="font-medium mb-4">AI Insights & Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium">Learning Pattern Analysis</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Based on engagement data, we've identified that most students perform better when taking breaks every 25 minutes. Consider structuring your course content around this pattern.
            </p>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium">Content Improvement Suggestions</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Questions about photosynthesis in Biology 101 have a lower success rate. Consider adding more visual explanations and examples to this section.
            </p>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <h4 className="font-medium">Student Engagement Optimization</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Students who complete practice quizzes show a 34% higher course completion rate. Consider adding more optional practice quizzes throughout your courses.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Settings</h2>
      
      <Card>
        <h3 className="font-medium mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-background border border-input rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-background border border-input rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue="john.doe@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-1">Bio</label>
            <textarea 
              className="w-full bg-background border border-input rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              defaultValue="Professor of Biology with 10+ years of teaching experience. Specializing in molecular biology and genetics."
            />
          </div>
          
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="font-medium mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Current Password</label>
            <input 
              type="password" 
              className="w-full bg-background border border-input rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">New Password</label>
            <input 
              type="password" 
              className="w-full bg-background border border-input rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Confirm New Password</label>
            <input 
              type="password" 
              className="w-full bg-background border border-input rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex justify-end">
            <Button>Update Password</Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="font-medium mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive email updates about your account activity</p>
            </div>
            <div>
              <input type="checkbox" id="email-notifications" className="toggle" defaultChecked />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Course Updates</p>
              <p className="text-sm text-muted-foreground">Get notified when courses are updated</p>
            </div>
            <div>
              <input type="checkbox" id="course-updates" className="toggle" defaultChecked />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Exam Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified when new exams are available</p>
            </div>
            <div>
              <input type="checkbox" id="exam-notifications" className="toggle" defaultChecked />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button>Save Preferences</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
