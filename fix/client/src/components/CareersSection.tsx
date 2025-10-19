import { Users, MapPin, Clock, Briefcase } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const openPositions = [
  {
    title: "Frontend Developer",
    location: "Remote / Campus City",
    type: "Full-time",
    description:
      "Build beautiful, responsive user interfaces for our campus management platform.",
  },
  {
    title: "Backend Developer",
    location: "Remote / Campus City",
    type: "Full-time",
    description:
      "Develop robust APIs and scalable backend systems to power our platform.",
  },
  {
    title: "UX Designer",
    location: "Campus City",
    type: "Full-time",
    description:
      "Design intuitive user experiences that make campus maintenance effortless.",
  },
  {
    title: "Customer Success Manager",
    location: "Remote",
    type: "Full-time",
    description:
      "Help universities get the most value from our platform and grow our community.",
  },
];

const benefits = [
  {
    icon: Users,
    title: "Collaborative Team",
    description: "Work with passionate people who care about education",
  },
  {
    icon: MapPin,
    title: "Flexible Location",
    description: "Remote-first culture with optional office space",
  },
  {
    icon: Clock,
    title: "Work-Life Balance",
    description: "Flexible hours and unlimited PTO policy",
  },
  {
    icon: Briefcase,
    title: "Growth Opportunities",
    description: "Professional development budget and mentorship",
  },
];

const CareersSection = () => {
  return (
    <section id="careers" className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Join Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us build the future of campus management. We're looking for
            passionate individuals who want to make a difference in education.
          </p>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Open Positions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {openPositions.map((position, index) => (
              <Card
                key={index}
                className="border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-bold text-foreground">
                      {position.title}
                    </h4>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      {position.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{position.location}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {position.description}
                  </p>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Why Work With Us
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex p-3 bg-accent/10 rounded-lg">
                    <benefit.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-primary/10 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Don't See Your Role?
          </h3>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our mission.
            Send us your resume and let us know how you'd like to contribute.
          </p>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3">
            Send Us Your Resume
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;
