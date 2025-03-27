
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserRound, BookOpen, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-foreground"
          >
            <BookOpen className="h-7 w-7" />
            <span className="font-semibold text-xl">Teachly</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base transition-all hover:text-primary ${
                  location.pathname === link.path
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300
                ${location.pathname === "/login" 
                  ? "bg-primary text-primary-foreground hover:opacity-90" 
                  : "text-primary hover:bg-secondary"
                }
              `}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-primary text-primary-foreground px-4 py-1.5 text-sm rounded-full hover:opacity-90 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center text-muted-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="glass md:hidden py-4 px-4 mt-2 mx-4 rounded-xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base px-2 py-2 rounded-lg transition-all ${
                  location.pathname === link.path
                    ? "font-medium bg-secondary/50"
                    : "text-muted-foreground hover:bg-secondary/30"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-border pt-4 flex flex-col space-y-2">
              <Link
                to="/login"
                className="flex items-center justify-center py-2 px-4 rounded-lg hover:bg-secondary/30 transition-all"
              >
                <UserRound className="h-4 w-4 mr-2" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:opacity-90 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
