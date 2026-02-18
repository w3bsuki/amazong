import { useEffect, useState } from "react"

const HOME_CITY_STORAGE_KEY = "treido_user_city"

export function useHomeCityStorage(city: string | null, setCity: (nextCity: string) => void): boolean {
  const [cityHydrated, setCityHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const savedCity = localStorage.getItem(HOME_CITY_STORAGE_KEY)
      if (savedCity && savedCity.length > 0) {
        setCity(savedCity)
      }
    } catch {
      return
    } finally {
      setCityHydrated(true)
    }
  }, [setCity])

  useEffect(() => {
    if (!cityHydrated || typeof window === "undefined") return
    try {
      if (city) {
        localStorage.setItem(HOME_CITY_STORAGE_KEY, city)
      } else {
        localStorage.removeItem(HOME_CITY_STORAGE_KEY)
      }
    } catch {
      return
    }
  }, [city, cityHydrated])

  return cityHydrated
}
