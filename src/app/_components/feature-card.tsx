import { type LucideProps } from "lucide-react";
import { type ComponentType } from "react";

interface FeatureCardProps {
  icon: ComponentType<LucideProps>;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-muted">
        <Icon size={17} className="text-foreground" />
      </div>
      <p className="mb-1 text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
