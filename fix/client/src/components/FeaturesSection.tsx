import { AlertCircle, BarChart3, Bell, Image, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: Zap,
    title: "Quick Reporting",
    description:
      "Report issues in seconds with our intuitive interface and smart forms",
  },
  {
    icon: Image,
    title: "Photo Evidence",
    description:
      "Attach photos to your reports for better context and faster resolution",
  },
  {
    icon: Bell,
    title: "Real-time Updates",
    description:
      "Get instant notifications when your reported issues are being addressed",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is protected with enterprise-grade security and privacy controls",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track trends and insights with comprehensive reporting tools",
  },
  {
    icon: AlertCircle,
    title: "Smart Prioritization",
    description: "AI-powered system automatically prioritizes critical issues",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage campus maintenance efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
