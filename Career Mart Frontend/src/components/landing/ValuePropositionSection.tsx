import { Building2, Bookmark, RefreshCw } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-background rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300 border border-border/50">
      <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export function ValuePropositionSection() {
  const features = [
    {
      icon: <Building2 className="h-6 w-6 text-white" />,
      title: "Real jobs from verified companies",
      description: "Every listing is verified and sourced directly from company career pages, ensuring legitimate opportunities."
    },
    {
      icon: <Bookmark className="h-6 w-6 text-white" />,
      title: "Bookmark & apply with one click",
      description: "Save jobs you're interested in and apply seamlessly without leaving the platform."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-white" />,
      title: "Updated daily for top openings",
      description: "Our platform refreshes daily to bring you the latest opportunities from leading companies."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Career Mart Works</h2>
          <p className="text-muted-foreground text-lg">
            We've reimagined the job search experience to help you find opportunities that truly match your skills and aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}