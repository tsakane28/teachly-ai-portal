
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Users, BarChart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getCourses, getQuestions, getStudentWeakAreas, getTeacherInsights, getAdminAIOverview, getUserAttempts, getStudentRecommendations } from "@/lib/dataService";
import { analyzeStudentPerformance, generateTeacherInsights } from "@/lib/aiService";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>({});
  const [insights, setInsights] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load basic stats based on user role
        if (user.role === "admin") {
          const allCourses = getCourses();
          const allQuestions = getQuestions();
          const users = JSON.parse(localStorage.getItem("teachly_users") || "[]");
          const teachers = users.filter((u: any) => u.role === "teacher");
          const students = users.filter((u: any) => u.role === "student");
          
          setStats({
            courses: allCourses.length,
            questions: allQuestions.length,
            teachers: teachers.length,
            students: students.length
          });
          
          // Get AI insights for admin
          const adminInsights = await getAdminAIOverview();
          setInsights(adminInsights);
        } 
        else if (user.role === "teacher") {
          const teacherCourses = getCourses(user.id, "teacher");
          const courseIds = teacherCourses.map(course => course.id);
          const questionsCount = getQuestions().filter(q => 
            courseIds.includes(q.courseId)
          ).length;
          
          // Calculate total students who have attempted teacher's courses
          const studentIds = new Set();
          const attempts = JSON.parse(localStorage.getItem("teachly_attempts") || "[]");
          
          attempts.forEach((attempt: any) => {
            if (courseIds.includes(attempt.courseId)) {
              studentIds.add(attempt.userId);
            }
          });
          
          setStats({
            courses: teacherCourses.length,
            questions: questionsCount,
            students: studentIds.size,
          });
          
          // Get AI insights for teacher
          const teacherInsights = await generateTeacherInsights(user.id);
          setInsights(teacherInsights);
        } 
        else if (user.role === "student") {
          const allCourses = getCourses();
          const userAttempts = getUserAttempts(user.id);
          
          // Get unique courses the student has attempted
          const attemptedCourseIds = new Set(userAttempts.map(a => a.courseId));
          const attemptedCourses = allCourses.filter(c => attemptedCourseIds.has(c.id));
          
          // Calculate correct answers
          const correctAttempts = userAttempts.filter(a => a.isCorrect).length;
          
          setStats({
            availableCourses: allCourses.length,
            attemptedCourses: attemptedCourses.length,
            totalAttempts: userAttempts.length,
            correctAnswers: correctAttempts,
            accuracy: userAttempts.length > 0 
              ? Math.round((correctAttempts / userAttempts.length) * 100) 
              : 0
          });
          
          // Get AI insights for student
          const studentInsights = await analyzeStudentPerformance(user.id);
          setInsights(studentInsights);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Teachly Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{user.name || user.email}</span>
            </span>
            <button 
              onClick={logout}
              className="px-3 py-1 text-sm rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Role Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {user.role === "admin" ? "Administrator" : user.role === "teacher" ? "Teacher" : "Student"}
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
                <div className="h-6 w-20 bg-muted rounded mb-2"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            {user.role === "admin" && (
              <>
                <StatCard
                  title="Total Courses"
                  value={stats.courses}
                  icon={<BookOpen className="h-6 w-6" />}
                  color="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                />
                <StatCard
                  title="Total Questions"
                  value={stats.questions}
                  icon={<GraduationCap className="h-6 w-6" />}
                  color="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                />
                <StatCard
                  title="Teachers"
                  value={stats.teachers}
                  icon={<Users className="h-6 w-6" />}
                  color="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                />
                <StatCard
                  title="Students"
                  value={stats.students}
                  icon={<Users className="h-6 w-6" />}
                  color="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                />
              </>
            )}

            {user.role === "teacher" && (
              <>
                <StatCard
                  title="My Courses"
                  value={stats.courses}
                  icon={<BookOpen className="h-6 w-6" />}
                  color="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                />
                <StatCard
                  title="My Questions"
                  value={stats.questions}
                  icon={<GraduationCap className="h-6 w-6" />}
                  color="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                />
                <StatCard
                  title="Students"
                  value={stats.students}
                  icon={<Users className="h-6 w-6" />}
                  color="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                />
              </>
            )}

            {user.role === "student" && (
              <>
                <StatCard
                  title="Available Courses"
                  value={stats.availableCourses}
                  icon={<BookOpen className="h-6 w-6" />}
                  color="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                />
                <StatCard
                  title="Courses Started"
                  value={stats.attemptedCourses}
                  icon={<GraduationCap className="h-6 w-6" />}
                  color="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                />
                <StatCard
                  title="Total Attempts"
                  value={stats.totalAttempts}
                  icon={<BarChart className="h-6 w-6" />}
                  color="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                />
                <StatCard
                  title="Accuracy"
                  value={`${stats.accuracy}%`}
                  icon={<BarChart className="h-6 w-6" />}
                  color="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                />
              </>
            )}
          </div>
        )}

        {/* AI Insights Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
            AI-Powered Insights
          </h2>

          <div className="bg-card border border-border rounded-lg p-6">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Admin Insights */}
                {user.role === "admin" && insights.platformInsights && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Platform Overview</h3>
                      <ul className="space-y-2">
                        {insights.platformInsights.map((insight: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="ml-2">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                      <ul className="space-y-2">
                        {insights.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="ml-2">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Teacher Insights */}
                {user.role === "teacher" && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Teaching Strategies</h3>
                      <ul className="space-y-2">
                        {insights.teachingStrategies?.map((strategy: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="ml-2">{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {insights.lowPerformanceCourses?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Courses Needing Attention
                        </h3>
                        <div className="space-y-2">
                          {insights.lowPerformanceCourses.map((course: any) => (
                            <div 
                              key={course.courseId}
                              className="p-3 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-950 dark:border-amber-900"
                            >
                              <p className="font-medium">{course.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Avg. Score: {Math.round(course.avgScore)}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                      <ul className="space-y-2">
                        {insights.recommendations?.map((rec: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="ml-2">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Student Insights */}
                {user.role === "student" && (
                  <>
                    {insights.weakAreas?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Areas to Focus On</h3>
                        <div className="space-y-2">
                          {insights.weakAreas.map((area: any) => (
                            <div 
                              key={area.courseId}
                              className="p-3 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-950 dark:border-amber-900"
                            >
                              <p className="font-medium">{area.courseName}</p>
                              <p className="text-sm text-muted-foreground">
                                Your Performance: {Math.round(area.performance)}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Performance Insights</h3>
                      <ul className="space-y-2">
                        {insights.performanceInsights?.map((insight: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="ml-2">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                      <ul className="space-y-2">
                        {insights.recommendations?.map((rec: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <div className="h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="ml-2">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.role === "admin" && (
              <>
                <ActionCard 
                  title="Manage Courses" 
                  description="Add, edit, or remove courses" 
                  buttonText="Manage Courses"
                  onClick={() => navigate("/courses")}
                />
                <ActionCard 
                  title="Manage Teachers" 
                  description="Review and approve teacher applications" 
                  buttonText="Manage Teachers"
                  onClick={() => navigate("/teachers")}
                />
                <ActionCard 
                  title="View Students" 
                  description="Monitor student performance and progress" 
                  buttonText="View Students"
                  onClick={() => navigate("/students")}
                />
              </>
            )}

            {user.role === "teacher" && (
              <>
                <ActionCard 
                  title="My Courses" 
                  description="Create and manage your courses" 
                  buttonText="View Courses"
                  onClick={() => navigate("/my-courses")}
                />
                <ActionCard 
                  title="Create Quiz" 
                  description="Add new questions to your courses" 
                  buttonText="Create Quiz"
                  onClick={() => navigate("/create-quiz")}
                />
                <ActionCard 
                  title="Student Progress" 
                  description="View detailed student performance data" 
                  buttonText="View Progress"
                  onClick={() => navigate("/student-progress")}
                />
              </>
            )}

            {user.role === "student" && (
              <>
                <ActionCard 
                  title="Available Courses" 
                  description="Browse and enroll in courses" 
                  buttonText="Browse Courses"
                  onClick={() => navigate("/courses")}
                />
                <ActionCard 
                  title="My Progress" 
                  description="View your performance across all courses" 
                  buttonText="View Progress"
                  onClick={() => navigate("/my-progress")}
                />
                <ActionCard 
                  title="Take a Quiz" 
                  description="Test your knowledge and track improvement" 
                  buttonText="Take Quiz"
                  onClick={() => navigate("/quizzes")}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-muted-foreground">{title}</p>
    </div>
  );
};

const ActionCard = ({ 
  title, 
  description, 
  buttonText, 
  onClick 
}: { 
  title: string; 
  description: string; 
  buttonText: string; 
  onClick: () => void 
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <button
        onClick={onClick}
        className="w-full py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Dashboard;
