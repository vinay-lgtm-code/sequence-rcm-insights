import { Card, CardContent } from "@/components/ui/card";
import { Clock, XCircle, CheckCircle2, DollarSign } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Days in A/R",
    description: "Track how long claims take to get paid and identify slow payers.",
  },
  {
    icon: XCircle,
    title: "Denial Rate",
    description: "See denial patterns by payer, code, and reason.",
  },
  {
    icon: CheckCircle2,
    title: "Clean Claim Rate",
    description: "Measure how many claims get paid on first submission.",
  },
  {
    icon: DollarSign,
    title: "Collection Rate",
    description: "Compare what you charge versus what you actually collect.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-navy-500">
            The Metrics That Matter
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Four key indicators that determine your revenue cycle health.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-5 inline-flex rounded-xl bg-gray-100 p-3">
                    <Icon className="h-6 w-6 text-navy-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-navy-500">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
