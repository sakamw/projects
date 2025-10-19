import { Shield, FileText, Lock, Eye } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const LegalSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Legal & Privacy
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy and security are our top priorities. Learn more about
            how we protect your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Privacy Policy */}
          <Card
            id="privacy"
            className="border-border/50 bg-card hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Privacy Policy
                </h3>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We are committed to protecting your privacy and personal
                  information. This policy explains how we collect, use, and
                  safeguard your data.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Data Collection
                  </h4>
                  <p className="text-sm">
                    We only collect information necessary to provide our
                    services, including issue reports, user preferences, and
                    contact information.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Data Usage</h4>
                  <p className="text-sm">
                    Your data is used solely for campus maintenance purposes and
                    improving our platform's functionality.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Data Protection
                  </h4>
                  <p className="text-sm">
                    We implement industry-standard security measures to protect
                    your information from unauthorized access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms of Service */}
          <Card
            id="terms"
            className="border-border/50 bg-card hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Terms of Service
                </h3>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  By using CampusFix, you agree to these terms and conditions.
                  Please read them carefully before using our platform.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Acceptable Use
                  </h4>
                  <p className="text-sm">
                    Use the platform responsibly for legitimate campus
                    maintenance issues only. Misuse may result in account
                    suspension.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    User Responsibilities
                  </h4>
                  <p className="text-sm">
                    Provide accurate information and follow campus guidelines
                    when reporting issues.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Service Availability
                  </h4>
                  <p className="text-sm">
                    We strive for 99.9% uptime but cannot guarantee
                    uninterrupted service availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Features */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Security Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <Lock className="h-6 w-6 text-accent" />
              <span className="text-foreground font-medium">
                End-to-End Encryption
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <Shield className="h-6 w-6 text-accent" />
              <span className="text-foreground font-medium">
                Secure Data Storage
              </span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <Eye className="h-6 w-6 text-accent" />
              <span className="text-foreground font-medium">
                Privacy Controls
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalSection;
