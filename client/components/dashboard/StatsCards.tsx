import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export default function StatsCards({
  title,
  value,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card className="p-6 border-border/50 hover:border-primary/30 transition-colors rounded-xl">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-3xl font-heading font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </Card>
  );
}
