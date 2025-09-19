import { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface LoadingProgressProps {
  isVisible: boolean;
  request: string;
}

const LoadingProgress = ({ isVisible, request }: LoadingProgressProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 0,
      icon: <Sparkles className="w-6 h-6" />,
      title: "Understanding your travel dreams",
      description: "Analyzing your request for the perfect trip",
      duration: 2000,
    },
    {
      id: 1,
      icon: <MapPin className="w-6 h-6" />,
      title: "Discovering amazing destinations",
      description: "Finding the best spots for your adventure",
      duration: 2500,
    },
    {
      id: 2,
      icon: <Plane className="w-6 h-6" />,
      title: "Searching for perfect flights",
      description: "Matching you with ideal travel options",
      duration: 2000,
    },
    {
      id: 3,
      icon: <Calendar className="w-6 h-6" />,
      title: "Crafting your daily itinerary",
      description: "Planning each day with exciting activities",
      duration: 3000,
    },
    {
      id: 4,
      icon: <Sparkles className="w-6 h-6" />,
      title: "Adding surprise experiences",
      description: "Sprinkling in some delightful surprises",
      duration: 1500,
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    let timeouts: NodeJS.Timeout[] = [];
    let accumulatedTime = 0;

    steps.forEach((step, index) => {
      // Mark step as current
      const currentTimeout = setTimeout(() => {
        setCurrentStep(index);
      }, accumulatedTime);
      timeouts.push(currentTimeout);

      // Mark step as completed
      const completedTimeout = setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
        if (index < steps.length - 1) {
          setCurrentStep(index + 1);
        }
      }, accumulatedTime + step.duration);
      timeouts.push(completedTimeout);

      accumulatedTime += step.duration;
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 mx-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-white animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Creating Your Perfect Trip
          </h2>
          <p className="text-gray-600 text-sm">
            "{request.length > 50 ? request.substring(0, 50) + '...' : request}"
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isPending = index > currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-green-50 border border-green-200' 
                    : isCurrent 
                    ? 'bg-blue-50 border border-blue-200 shadow-md' 
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm transition-colors duration-300 ${
                    isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs transition-colors duration-300 ${
                    isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>

                {/* Loading indicator for current step */}
                {isCurrent && !isCompleted && (
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(((completedSteps.length) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((completedSteps.length + (currentStep < steps.length ? 0.5 : 0)) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Fun fact */}
        <div className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <p className="text-xs text-purple-700">
              <span className="font-semibold">Fun fact:</span> We're processing over 50 travel data points to create your perfect itinerary!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress;