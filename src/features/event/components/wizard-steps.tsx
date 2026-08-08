"use client";

import { Check } from "lucide-react";

interface WizardStepsProps {
  currentStep: number;
}

export function WizardSteps({ currentStep }: WizardStepsProps) {
  const stepsList = ["Event Details", "Guest List", "Email Template", "Preview & Send"];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {stepsList.map(function RenderStepItem(stepName, index) {
          const stepNumber = index + 1;
          const isActiveStep = stepNumber === currentStep;
          const isCompletedStep = stepNumber < currentStep;

          return (
            <div key={stepName} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    isActiveStep
                      ? "bg-gradient-to-br from-seal to-seal-hover text-white shadow-lg scale-105"
                      : isCompletedStep
                      ? "bg-emerald text-white"
                      : "bg-paper-raised border border-hairline text-muted"
                  }`}
                >
                  {isCompletedStep ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline-block ${
                    isActiveStep ? "text-seal font-semibold" : isCompletedStep ? "text-emerald" : "text-muted"
                  }`}
                >
                  {stepName}
                </span>
              </div>
              {index < stepsList.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors duration-300 ${
                    isCompletedStep ? "bg-emerald" : "bg-hairline"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
