import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Navigation */}
      <nav className="w-full border-b border-border bg-muted/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">Fix</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/login"
                  className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600 p-2">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden w-full min-h-[100vh] flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center">
            <h1 className="font-hero text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-foreground">
              Report Issues
              <span className="block text-primary">Get Them Fixed</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto">
              Join your community in identifying and resolving campus issues.
              From broken lights to security concerns, we make it easy to report
              problems and track their resolution.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Link to="/register">
                <Button size="lg" className="text-lg px-10 py-5">
                  Start Reporting
                </Button>
              </Link>
              <Link to="/reports">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-10 py-5"
                >
                  View Issues
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-muted w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              How It Works
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
              Simple steps to make your campus better
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            <Card className="text-center bg-card text-card-foreground border shadow-lg">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/30 mb-4">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <CardTitle>1. Report an Issue</CardTitle>
                <CardDescription>
                  Take a photo, add details, and pinpoint the location. It only
                  takes a minute.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center bg-card text-card-foreground border shadow-lg">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 mb-4">
                  <svg
                    className="h-8 w-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardTitle>2. Track Progress</CardTitle>
                <CardDescription>
                  Get updates on your report's status and see when it's being
                  worked on.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center bg-card text-card-foreground border shadow-lg">
              <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/30 mb-4">
                  <svg
                    className="h-8 w-8 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <CardTitle>3. Issue Resolved</CardTitle>
                <CardDescription>
                  Celebrate when your issue gets fixed and your campus becomes
                  better.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-20 bg-background w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              What Can You Report?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
              From infrastructure to safety, we cover all campus concerns
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-8">
            {[
              {
                name: "IT Issues",
                icon: "💻",
                color: "bg-blue-100 text-blue-800",
              },
              {
                name: "Security",
                icon: "🔒",
                color: "bg-red-100 text-red-800",
              },
              {
                name: "Infrastructure",
                icon: "🏗️",
                color: "bg-yellow-100 text-yellow-800",
              },
              {
                name: "Sanitation",
                icon: "🧹",
                color: "bg-green-100 text-green-800",
              },
              {
                name: "Electrical",
                icon: "⚡",
                color: "bg-purple-100 text-purple-800",
              },
              { name: "Water", icon: "💧", color: "bg-cyan-100 text-cyan-800" },
              {
                name: "Accessibility",
                icon: "♿",
                color: "bg-pink-100 text-pink-800",
              },
              { name: "Other", icon: "📝", color: "bg-gray-100 text-gray-800" },
            ].map((category) => (
              <div key={category.name} className="text-center">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${category.color} mb-3`}
                >
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-sm font-medium text-foreground">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 bg-blue-700 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="text-blue-100">Issues Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">85%</div>
              <div className="text-blue-100">Resolution Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">24h</div>
              <div className="text-blue-100">Avg Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">1000+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-muted w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and staff who are already making their
            campus better. Every report counts towards a safer, more functional
            environment.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Fix</h3>
              <p className="text-gray-400 text-sm">
                Making campus issues visible and trackable for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="hover:text-white">
                    Browse Reports
                  </Link>
                </li>
                <li>
                  <Link to="/reports/new" className="hover:text-white">
                    Report Issue
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-white">
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Fix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
