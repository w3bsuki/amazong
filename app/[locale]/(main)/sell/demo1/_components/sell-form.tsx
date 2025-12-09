"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sellFormSchema, type SellFormData, STEPS } from "./schema"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BasicsStep } from "./steps/basics-step"
import { CategoryStep } from "./steps/category-step"
import { AttributesStep } from "./steps/attributes-step"
import { PriceStep } from "./steps/price-step"
import { Check } from "@phosphor-icons/react"

export function SellForm() {
  const [currentStep, setCurrentStep] = useState(0)
  
  const form = useForm<SellFormData>({
    resolver: zodResolver(sellFormSchema),
    mode: "onChange",
    defaultValues: {
      images: [],
      shippingOption: "calculated",
    }
  })

  const { trigger, handleSubmit } = form

  const next = async () => {
    const fields = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fields)
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
      window.scrollTo(0, 0)
    }
  }

  const back = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const onSubmit = (data: SellFormData) => {
    console.log("Form submitted:", data)
    alert("Listing created! (Demo)")
  }

  const getFieldsForStep = (step: number): (keyof SellFormData)[] => {
    switch (step) {
      case 0: return ["images", "title", "description", "condition", "brand"]
      case 1: return ["categoryId"]
      case 2: return ["attributes"]
      case 3: return ["price", "shippingOption", "shippingCost"]
      default: return []
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Stepper */}
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            
            return (
              <li key={step.id} className={cn(
                "relative flex items-center",
                index !== STEPS.length - 1 && "flex-1"
              )}>
                <div className="group flex items-center">
                  <span className="flex items-center">
                    <span className={cn(
                      "flex size-8 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                      isCompleted ? "border-emerald-600 bg-emerald-600 text-white" :
                      isCurrent ? "border-gray-900 bg-white text-gray-900 ring-2 ring-gray-900/10 ring-offset-2" :
                      "border-gray-300 bg-white text-gray-500"
                    )}>
                      {isCompleted ? <Check className="size-4" /> : index + 1}
                    </span>
                    <span className={cn(
                      "ml-3 text-sm font-medium hidden sm:block",
                      isCompleted ? "text-gray-900" :
                      isCurrent ? "text-gray-900" :
                      "text-gray-500"
                    )}>
                      {step.title}
                    </span>
                  </span>
                </div>
                {index !== STEPS.length - 1 && (
                  <div className="ml-4 flex-1 h-px bg-gray-200 mx-4 hidden sm:block" />
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Form Content */}
      <div className="bg-white rounded-sm border border-gray-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === 0 && <BasicsStep form={form} />}
          {currentStep === 1 && <CategoryStep form={form} />}
          {currentStep === 2 && <AttributesStep form={form} />}
          {currentStep === 3 && <PriceStep form={form} />}

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={currentStep === 0}
              className="text-gray-600"
            >
              Back
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                List Item
              </Button>
            ) : (
              <Button type="button" onClick={next} className="px-8">
                Continue
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
