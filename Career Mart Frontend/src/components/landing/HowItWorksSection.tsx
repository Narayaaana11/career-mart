import { Search, Bookmark, Send } from "lucide-react";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

function Step({ icon, title, description, step }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-primary flex items-center justify-center text-xs font-bold">
          {step}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-xs mx-auto">{description}</p>
    </div>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-white" />,
      title: "Search",
      description: "Filter through thousands of verified job listings to find your perfect match.",
      step: 1
    },
    {
      icon: <Bookmark className="h-8 w-8 text-white" />,
      title: "Bookmark",
      description: "Save interesting opportunities to your profile for later comparison and review.",
      step: 2
    },
    {
      icon: <Send className="h-8 w-8 text-white" />,
      title: "Apply",
      description: "Submit your application directly through our platform with just one click.",
      step: 3
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Finding your dream job has never been easier with our streamlined process.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-primary hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <Step
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                step={step.step}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}