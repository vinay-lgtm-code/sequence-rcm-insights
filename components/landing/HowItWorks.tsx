import { Upload, Cpu, Mail } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: 1,
    title: "Upload",
    description: "Drag and drop your claims Excel file.",
  },
  {
    icon: Cpu,
    step: 2,
    title: "Analyze",
    description: "AI calculates metrics and identifies patterns.",
  },
  {
    icon: Mail,
    step: 3,
    title: "Receive",
    description: "Get a detailed report in your inbox.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-navy-500">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Three steps to understand your revenue cycle health.
          </p>
        </div>

        <div className="grid gap-12 sm:grid-cols-3 max-w-3xl mx-auto">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-navy-500 text-white">
                  <span className="text-lg font-medium">{step.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-medium text-navy-500">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
