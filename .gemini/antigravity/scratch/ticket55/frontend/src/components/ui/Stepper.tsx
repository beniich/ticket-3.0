import { Check } from 'lucide-react';

interface Step {
    id: string;
    title: string;
    description?: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    onStepChange?: (stepIndex: number) => void;
}

export function Stepper({ steps, currentStep, onStepChange }: StepperProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isClickable = index <= currentStep && onStepChange;

                    return (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center relative z-10 ${isClickable ? 'cursor-pointer' : ''
                                }`}
                            onClick={() => isClickable && onStepChange && onStepChange(index)}
                        >
                            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors
                ${isCompleted ? 'bg-primary text-white' : ''}
                ${isCurrent ? 'bg-primary text-white ring-4 ring-primary/30' : ''}
                ${!isCompleted && !isCurrent ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : ''}
              `}>
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <span className="text-sm font-medium">{index + 1}</span>
                                )}
                            </div>

                            <div className="text-center max-w-[100px]">
                                <p className={`
                  text-sm font-medium truncate
                  ${isCurrent ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}
                `}>
                                    {step.title}
                                </p>
                                {step.description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 truncate">
                                        {step.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
