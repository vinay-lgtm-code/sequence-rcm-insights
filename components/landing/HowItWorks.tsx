import { Upload, Cpu, Mail } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Data",
    description: "Drag and drop your claims Excel file. We support standard .xlsx exports from most practice management systems.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes Everything",
    description: "Our AI engine calculates key metrics, identifies patterns, and generates actionable insights—all in under a minute.",
  },
  {
    icon: Mail,
    step: "03",
    title: "Get Your Report",
    description: "Receive a detailed executive summary in your inbox with specific recommendations your team can act on today.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-navy-500 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Three simple steps to understand your revenue cycle health.
            No software to install. No complex setup.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary-200 via-teal-200 to-primary-200 lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={step.step} className="relative lg:flex lg:items-center lg:justify-center">
                  {/* Step content */}
                  <div className={`lg:w-5/12 ${isEven ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:order-2"}`}>
                    <div className={`inline-flex items-center gap-4 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-teal-500 text-white shadow-lg">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-sm font-bold text-primary-500">
                        STEP {step.step}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-navy-500">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {step.description}
                    </p>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 top-7 hidden h-4 w-4 -translate-x-1/2 rounded-full bg-white border-4 border-primary-500 lg:block" />

                  {/* Spacer for layout */}
                  <div className={`hidden lg:block lg:w-5/12 ${isEven ? "lg:order-2" : ""}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
