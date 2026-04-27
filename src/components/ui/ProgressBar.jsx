import { cn } from '@/lib/utils'

export default function ProgressBar({ currentStep, totalSteps = 3 }) {
  return (
    <div className="flex items-center gap-2 w-full max-w-xs mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex-1 flex items-center gap-2">
          <div
            className={cn(
              'h-1.5 rounded-full flex-1 transition-all duration-300',
              i < currentStep ? 'bg-primary' : 'bg-gray-200',
            )}
          />
        </div>
      ))}
    </div>
  )
}
