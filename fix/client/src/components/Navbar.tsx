import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Wrench } from "lucide-react";

const Navbar = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-secondary/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 group"
          >
            <Wrench className="h-6 w-6 text-accent transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold text-primary-foreground">
              CampusFix
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                const featuresSection = document.getElementById("features");
                featuresSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => {
                const howItWorksSection =
                  document.getElementById("how-it-works");
                howItWorksSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                const aboutSection = document.getElementById("about");
                aboutSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              About
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-secondary/20"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
