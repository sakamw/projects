import { Camera, CheckCircle, FileText } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Report the Issue",
    description: "Take a photo and describe the problem in just a few seconds"
  },
  {
    icon: FileText,
    title: "Track Progress",
    description: "Monitor the status of your report in real-time through your dashboard"
  },
  {
    icon: CheckCircle,
    title: "Issue Resolved",
    description: "Get notified when the issue is fixed and provide feedback"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to a better campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="mb-6 inline-flex p-6 bg-accent rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <step.icon className="h-12 w-12 text-accent-foreground" />
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-accent/30" />
              )}

              <div className="space-y-2">
                <div className="text-lg font-semibold text-accent mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
