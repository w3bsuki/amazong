/**
 * Bulgarian Cities List
 * Used for seller location in listings and user profiles
 * 
 * Major cities ordered by population, plus "Other" option
 */

interface BulgarianCity {
  value: string;
  label: string;
  labelBg: string;
  region: string | null;
  population?: number; // For sorting reference
}

const REGIONS = {
  SOFIA_CITY: "Sofia City",
  SOUTH_CENTRAL: "South Central",
  NORTHEAST: "Northeast",
  SOUTHEAST: "Southeast",
  NORTH_CENTRAL: "North Central",
  NORTHWEST: "Northwest",
  SOUTHWEST: "Southwest",
  SOFIA_REGION: "Sofia Region",
} as const

/**
 * Major Bulgarian cities - top 20 by population plus "Other"
 * Cities are ordered by population for better UX (most likely choices first)
 */
export const BULGARIAN_CITIES: readonly BulgarianCity[] = [
  { value: "sofia", label: "Sofia", labelBg: "София", region: REGIONS.SOFIA_CITY, population: 1307000 },
  { value: "plovdiv", label: "Plovdiv", labelBg: "Пловдив", region: REGIONS.SOUTH_CENTRAL, population: 346000 },
  { value: "varna", label: "Varna", labelBg: "Варна", region: REGIONS.NORTHEAST, population: 336000 },
  { value: "burgas", label: "Burgas", labelBg: "Бургас", region: REGIONS.SOUTHEAST, population: 211000 },
  { value: "ruse", label: "Ruse", labelBg: "Русе", region: REGIONS.NORTH_CENTRAL, population: 144000 },
  { value: "stara-zagora", label: "Stara Zagora", labelBg: "Стара Загора", region: REGIONS.SOUTH_CENTRAL, population: 137000 },
  { value: "pleven", label: "Pleven", labelBg: "Плевен", region: REGIONS.NORTHWEST, population: 101000 },
  { value: "sliven", label: "Sliven", labelBg: "Сливен", region: REGIONS.SOUTHEAST, population: 89000 },
  { value: "dobrich", label: "Dobrich", labelBg: "Добрич", region: REGIONS.NORTHEAST, population: 86000 },
  { value: "shumen", label: "Shumen", labelBg: "Шумен", region: REGIONS.NORTHEAST, population: 82000 },
  { value: "pernik", label: "Pernik", labelBg: "Перник", region: REGIONS.SOUTHWEST, population: 76000 },
  { value: "haskovo", label: "Haskovo", labelBg: "Хасково", region: REGIONS.SOUTH_CENTRAL, population: 73000 },
  { value: "yambol", label: "Yambol", labelBg: "Ямбол", region: REGIONS.SOUTHEAST, population: 70000 },
  { value: "pazardzhik", label: "Pazardzhik", labelBg: "Пазарджик", region: REGIONS.SOUTH_CENTRAL, population: 68000 },
  { value: "blagoevgrad", label: "Blagoevgrad", labelBg: "Благоевград", region: REGIONS.SOUTHWEST, population: 67000 },
  { value: "veliko-tarnovo", label: "Veliko Tarnovo", labelBg: "Велико Търново", region: REGIONS.NORTH_CENTRAL, population: 66000 },
  { value: "vratsa", label: "Vratsa", labelBg: "Враца", region: REGIONS.NORTHWEST, population: 56000 },
  { value: "gabrovo", label: "Gabrovo", labelBg: "Габрово", region: REGIONS.NORTH_CENTRAL, population: 53000 },
  { value: "asenovgrad", label: "Asenovgrad", labelBg: "Асеновград", region: REGIONS.SOUTH_CENTRAL, population: 50000 },
  { value: "vidin", label: "Vidin", labelBg: "Видин", region: REGIONS.NORTHWEST, population: 43000 },
  { value: "kazanlak", label: "Kazanlak", labelBg: "Казанлък", region: REGIONS.SOUTH_CENTRAL, population: 42000 },
  { value: "kyustendil", label: "Kyustendil", labelBg: "Кюстендил", region: REGIONS.SOUTHWEST, population: 40000 },
  { value: "kardzhali", label: "Kardzhali", labelBg: "Кърджали", region: REGIONS.SOUTH_CENTRAL, population: 39000 },
  { value: "montana", label: "Montana", labelBg: "Монтана", region: REGIONS.NORTHWEST, population: 38000 },
  { value: "targovishte", label: "Targovishte", labelBg: "Търговище", region: REGIONS.NORTHEAST, population: 35000 },
  { value: "dimitrovgrad", label: "Dimitrovgrad", labelBg: "Димитровград", region: REGIONS.SOUTH_CENTRAL, population: 33000 },
  { value: "lovech", label: "Lovech", labelBg: "Ловеч", region: REGIONS.NORTHWEST, population: 32000 },
  { value: "silistra", label: "Silistra", labelBg: "Силистра", region: REGIONS.NORTHEAST, population: 31000 },
  { value: "razgrad", label: "Razgrad", labelBg: "Разград", region: REGIONS.NORTHEAST, population: 29000 },
  { value: "gorna-oryahovitsa", label: "Gorna Oryahovitsa", labelBg: "Горна Оряховица", region: REGIONS.NORTH_CENTRAL, population: 28000 },
  // Resort & Black Sea towns (important for marketplace)
  { value: "sunny-beach", label: "Sunny Beach", labelBg: "Слънчев бряг", region: REGIONS.SOUTHEAST, population: 3000 },
  { value: "golden-sands", label: "Golden Sands", labelBg: "Златни пясъци", region: REGIONS.NORTHEAST, population: 2000 },
  { value: "bansko", label: "Bansko", labelBg: "Банско", region: REGIONS.SOUTHWEST, population: 9000 },
  { value: "pamporovo", label: "Pamporovo", labelBg: "Пампорово", region: REGIONS.SOUTH_CENTRAL, population: 500 },
  { value: "borovets", label: "Borovets", labelBg: "Боровец", region: REGIONS.SOFIA_REGION, population: 300 },
  // Other option for smaller towns/villages
  { value: "other", label: "Other City/Village", labelBg: "Друг град/село", region: null },
] as const;
