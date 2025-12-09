import { SellForm } from "./_components/sell-form"

export default function SellDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">List an item</h1>
          <p className="mt-1 text-sm text-gray-500">Tell us what you're selling and we'll help you list it.</p>
        </div>
        <SellForm />
      </div>
    </div>
  )
}
