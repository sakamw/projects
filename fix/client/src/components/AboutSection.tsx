import { Users, Target, Award, Heart } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const aboutStats = [
  {
    icon: Users,
    title: "Active Users",
    value: "10,000+",
    description: "Students and staff using our platform",
  },
  {
    icon: Target,
    title: "Issues Resolved",
    value: "50,000+",
    description: "Campus maintenance issues fixed",
  },
  {
    icon: Award,
    title: "Response Time",
    value: "< 24hrs",
    description: "Average time to address reports",
  },
  {
    icon: Heart,
    title: "Satisfaction",
    value: "98%",
    description: "User satisfaction rating",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About CampusFix
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to transform campus maintenance through
            technology, making it easier for everyone to report issues and for
            administrators to resolve them efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-foreground">Our Story</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              CampusFix was born from a simple observation: campus maintenance
              issues were being reported through outdated systems, leading to
              delays and frustration. We built a modern, intelligent platform
              that streamlines the entire process.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Today, we serve thousands of students and staff across multiple
              campuses, helping create better learning environments through
              efficient issue resolution.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {aboutStats.map((stat, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex p-3 bg-accent/10 rounded-lg">
                    <stat.icon className="h-8 w-8 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {stat.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Our Mission
          </h3>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            To empower educational communities with intelligent tools that make
            campus maintenance transparent, efficient, and responsive. We
            believe that every student and staff member deserves a
            well-maintained environment that supports learning and productivity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
