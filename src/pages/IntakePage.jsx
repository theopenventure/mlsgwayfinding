import { useState } from 'react'
import { useNavigate } from 'react-router'
import ProgressBar from '@/components/ui/ProgressBar'
import SelectionCard from '@/components/ui/SelectionCard'
import PillSelector from '@/components/ui/PillSelector'
import LocationSearch from '@/components/intake/LocationSearch'
import { serviceTypes, notSureOption } from '@/data/services'
import { ageGroups } from '@/data/ageGroups'
import { cn } from '@/lib/utils'

export default function IntakePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState('forward')
  const [serviceType, setServiceType] = useState(null)
  const [showNotSureInfo, setShowNotSureInfo] = useState(false)
  const [ageGroup, setAgeGroup] = useState(null)
  const [location, setLocation] = useState(null)

  function nextStep() {
    setDirection('forward')
    setStep(s => s + 1)
  }

  function prevStep() {
    setDirection('back')
    if (step === 2 && showNotSureInfo) {
      setShowNotSureInfo(false)
      return
    }
    setStep(s => s - 1)
  }

  function handleServiceSelect(id) {
    if (id === 'not-sure') {
      setServiceType(null)
      setShowNotSureInfo(true)
    } else {
      setServiceType(id)
      setShowNotSureInfo(false)
      setDirection('forward')
      setStep(2)
    }
  }

  function handleNotSureSelect(id) {
    setServiceType(id)
    setShowNotSureInfo(false)
    setDirection('forward')
    setStep(2)
  }

  function handleAgeSelect(id) {
    setAgeGroup(id)
    setDirection('forward')
    setStep(3)
  }

  function handleFindServices() {
    const params = new URLSearchParams()
    if (serviceType) params.set('type', serviceType)
    if (ageGroup) params.set('age', ageGroup)
    if (location) {
      params.set('postal', location.postalCode)
      params.set('location', location.label)
      params.set('lat', location.lat)
      params.set('lng', location.lng)
    }
    navigate(`/services/results?${params.toString()}`)
  }

  function handleSkipAll() {
    navigate('/services/results')
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      {/* Header */}
      <div className="pt-8 pb-4 px-4">
        <div className="max-w-[640px] mx-auto">
          <div className="text-center mb-2">
            <span className="text-sm font-semibold tracking-wide text-primary uppercase">mindline.sg</span>
          </div>
          <ProgressBar currentStep={step} totalSteps={3} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-[640px]">
          {/* Back button */}
          {(step > 1 || showNotSureInfo) && (
            <button
              onClick={prevStep}
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-heading mb-6 transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          )}

          {/* Step 1: Service type */}
          {step === 1 && !showNotSureInfo && (
            <div key="step1" className={cn('animate-fade-in', direction === 'forward' ? 'animate-slide-left' : 'animate-slide-right')}>
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-heading mb-2">
                  What kind of support are you looking for?
                </h1>
                <p className="text-muted text-sm">
                  Choose what feels closest. You can always change this later.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {serviceTypes.map(service => (
                  <SelectionCard
                    key={service.id}
                    icon={service.icon}
                    title={service.title}
                    subtitle={service.subtitle}
                    selected={serviceType === service.id}
                    onClick={() => handleServiceSelect(service.id)}
                  />
                ))}
                <SelectionCard
                  icon={notSureOption.icon}
                  title={notSureOption.title}
                  subtitle={notSureOption.subtitle}
                  selected={false}
                  onClick={() => handleServiceSelect('not-sure')}
                  variant="outlined"
                />
              </div>

              <div className="text-center">
                <button
                  onClick={handleSkipAll}
                  className="text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer underline underline-offset-2"
                >
                  Skip &mdash; show me all services
                </button>
              </div>
            </div>
          )}

          {/* "I'm not sure" info panel */}
          {step === 1 && showNotSureInfo && (
            <div key="notsure" className="animate-slide-left">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-heading mb-2">
                  Here are the types of support available
                </h1>
                <p className="text-muted text-sm">
                  Read through these and choose what feels closest to what you need.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {serviceTypes.map(service => (
                  <button
                    key={service.id}
                    onClick={() => handleNotSureSelect(service.id)}
                    className="w-full text-left rounded-xl bg-white p-5 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/30"
                  >
                    <h3 className="text-base font-semibold text-heading mb-1">{service.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{service.description}</p>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={handleSkipAll}
                  className="text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer underline underline-offset-2"
                >
                  Still unsure? That's okay &mdash; we'll show you all available services
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Age group */}
          {step === 2 && (
            <div key="step2" className={cn(direction === 'forward' ? 'animate-slide-left' : 'animate-slide-right')}>
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-heading mb-2">
                  How old are you?
                </h1>
                <p className="text-muted text-sm">
                  This helps us show services available for your age group.
                </p>
              </div>

              <PillSelector
                options={ageGroups}
                selected={ageGroup}
                onChange={handleAgeSelect}
              />
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div key="step3" className={cn(direction === 'forward' ? 'animate-slide-left' : 'animate-slide-right')}>
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-heading mb-2">
                  Where are you located?
                </h1>
                <p className="text-muted text-sm">
                  We'll show services near you. Your location is not stored.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                <LocationSearch value={location} onChange={setLocation} />

                <button
                  onClick={handleFindServices}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary-dark transition-colors cursor-pointer shadow-card hover:shadow-card-hover"
                >
                  Find services
                </button>

                <div className="text-center">
                  <button
                    onClick={handleFindServices}
                    className="text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Skip &mdash; show all locations
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
