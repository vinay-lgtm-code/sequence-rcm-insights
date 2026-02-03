import { Card, CardContent } from "@/components/ui/card";
import { Clock, XCircle, CheckCircle2, DollarSign } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Days in A/R",
    description: "Track how long claims take to get paid. Identify slow payers and aging receivables before they become write-offs.",
    metric: "< 30 days",
    metricLabel: "Industry Target",
    color: "primary",
  },
  {
    icon: XCircle,
    title: "Denial Rate",
    description: "See your denial rate by payer, code, and reason. Stop revenue leaks by fixing the root causes.",
    metric: "< 5%",
    metricLabel: "Industry Target",
    color: "red",
  },
  {
    icon: CheckCircle2,
    title: "Clean Claim Rate",
    description: "Measure how many claims get paid on first submission. Higher rates mean faster cash flow.",
    metric: "> 95%",
    metricLabel: "Industry Target",
    color: "teal",
  },
  {
    icon: DollarSign,
    title: "Collection Rate",
    description: "Compare what you charge versus what you collect. Understand your true revenue capture by payer.",
    metric: "Varies",
    metricLabel: "By Specialty",
    color: "green",
  },
];

const iconColors = {
  primary: "bg-primary-100 text-primary-600",
  red: "bg-red-100 text-red-600",
  teal: "bg-teal-100 text-teal-600",
  green: "bg-green-100 text-green-600",
};

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-navy-500 sm:text-4xl">
            The Metrics That Matter
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Focus on the four key indicators that determine your revenue cycle health.
            Sequence analyzes each one and shows you exactly where to improve.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-6">
                  <div className={`mb-4 inline-flex rounded-lg p-3 ${iconColors[feature.color as keyof typeof iconColors]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-navy-500">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {feature.description}
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-2xl font-bold text-navy-500 font-mono">
                      {feature.metric}
                    </p>
                    <p className="text-xs text-gray-500">{feature.metricLabel}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
