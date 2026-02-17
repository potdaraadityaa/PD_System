import { Users, ShieldCheck, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function Home() {
  const stats = [
    {
      label: "Total Users",
      value: "1,234",
      icon: Users,
      trend: "+12% from last month",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Active Policies",
      value: "42",
      icon: ShieldCheck,
      trend: "All systems operational",
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "24h Requests",
      value: "84.2k",
      icon: Activity,
      trend: "+5% spike detected",
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-white/50">Overview of the system status and recent activities.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.color} border border-white/5`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-white/40">{stat.trend}</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-sm text-white/50 font-medium">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
