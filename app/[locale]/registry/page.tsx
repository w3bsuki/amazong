import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Search, UserPlus } from "lucide-react"
import Link from "next/link"

export default function RegistryPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-[#002f36] text-white py-16 px-4">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between">
                    <div className="space-y-6 max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-bold">
                            Celebrate every milestone with Amazon Registry
                        </h1>
                        <p className="text-lg text-gray-200">
                            From weddings and babies to birthdays and new homes, create a registry for any occasion.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-[#febd69] hover:bg-[#f3a847] text-black font-bold h-12 px-8 rounded-sm">
                                Create a Registry
                            </Button>
                            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-bold h-12 px-8 rounded-sm">
                                Find a Registry
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Gift className="w-64 h-64 text-[#febd69] opacity-90" />
                    </div>
                </div>
            </div>

            {/* Registry Types */}
            <div className="container mx-auto max-w-6xl py-12 px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Whatever you're celebrating, we've got you covered</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Gift className="w-8 h-8 text-pink-600" />
                            </div>
                            <CardTitle>Wedding Registry</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-gray-600">
                            Start your new life together with gifts you'll love.
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <UserPlus className="w-8 h-8 text-blue-600" />
                            </div>
                            <CardTitle>Baby Registry</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-gray-600">
                            Everything you need for your new arrival.
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none shadow-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Gift className="w-8 h-8 text-purple-600" />
                            </div>
                            <CardTitle>Birthday Gift List</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-gray-600">
                            Make their birthday wishes come true.
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gray-50 py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Why create a registry on Amazon?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">Earth's Biggest Selection</h3>
                            <p className="text-sm text-gray-600">Add items from Amazon's massive inventory.</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">Easy Returns</h3>
                            <p className="text-sm text-gray-600">90-day returns on most items.</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">Universal Registry</h3>
                            <p className="text-sm text-gray-600">Add items from other websites.</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">Group Gifting</h3>
                            <p className="text-sm text-gray-600">Allow friends to chip in on big gifts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
