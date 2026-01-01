/**
 * Bulgarian Cities List
 * Used for seller location in listings and user profiles
 * 
 * Major cities ordered by population, plus "Other" option
 */

export interface BulgarianCity {
  value: string;
  label: string;
  labelBg: string;
  region: string | null;
  population?: number; // For sorting reference
}

/**
 * Major Bulgarian cities - top 20 by population plus "Other"
 * Cities are ordered by population for better UX (most likely choices first)
 */
export const BULGARIAN_CITIES: readonly BulgarianCity[] = [
  { value: "sofia", label: "Sofia", labelBg: "София", region: "Sofia City", population: 1307000 },
  { value: "plovdiv", label: "Plovdiv", labelBg: "Пловдив", region: "South Central", population: 346000 },
  { value: "varna", label: "Varna", labelBg: "Варна", region: "Northeast", population: 336000 },
  { value: "burgas", label: "Burgas", labelBg: "Бургас", region: "Southeast", population: 211000 },
  { value: "ruse", label: "Ruse", labelBg: "Русе", region: "North Central", population: 144000 },
  { value: "stara-zagora", label: "Stara Zagora", labelBg: "Стара Загора", region: "South Central", population: 137000 },
  { value: "pleven", label: "Pleven", labelBg: "Плевен", region: "Northwest", population: 101000 },
  { value: "sliven", label: "Sliven", labelBg: "Сливен", region: "Southeast", population: 89000 },
  { value: "dobrich", label: "Dobrich", labelBg: "Добрич", region: "Northeast", population: 86000 },
  { value: "shumen", label: "Shumen", labelBg: "Шумен", region: "Northeast", population: 82000 },
  { value: "pernik", label: "Pernik", labelBg: "Перник", region: "Southwest", population: 76000 },
  { value: "haskovo", label: "Haskovo", labelBg: "Хасково", region: "South Central", population: 73000 },
  { value: "yambol", label: "Yambol", labelBg: "Ямбол", region: "Southeast", population: 70000 },
  { value: "pazardzhik", label: "Pazardzhik", labelBg: "Пазарджик", region: "South Central", population: 68000 },
  { value: "blagoevgrad", label: "Blagoevgrad", labelBg: "Благоевград", region: "Southwest", population: 67000 },
  { value: "veliko-tarnovo", label: "Veliko Tarnovo", labelBg: "Велико Търново", region: "North Central", population: 66000 },
  { value: "vratsa", label: "Vratsa", labelBg: "Враца", region: "Northwest", population: 56000 },
  { value: "gabrovo", label: "Gabrovo", labelBg: "Габрово", region: "North Central", population: 53000 },
  { value: "asenovgrad", label: "Asenovgrad", labelBg: "Асеновград", region: "South Central", population: 50000 },
  { value: "vidin", label: "Vidin", labelBg: "Видин", region: "Northwest", population: 43000 },
  { value: "kazanlak", label: "Kazanlak", labelBg: "Казанлък", region: "South Central", population: 42000 },
  { value: "kyustendil", label: "Kyustendil", labelBg: "Кюстендил", region: "Southwest", population: 40000 },
  { value: "kardzhali", label: "Kardzhali", labelBg: "Кърджали", region: "South Central", population: 39000 },
  { value: "montana", label: "Montana", labelBg: "Монтана", region: "Northwest", population: 38000 },
  { value: "targovishte", label: "Targovishte", labelBg: "Търговище", region: "Northeast", population: 35000 },
  { value: "dimitrovgrad", label: "Dimitrovgrad", labelBg: "Димитровград", region: "South Central", population: 33000 },
  { value: "lovech", label: "Lovech", labelBg: "Ловеч", region: "Northwest", population: 32000 },
  { value: "silistra", label: "Silistra", labelBg: "Силистра", region: "Northeast", population: 31000 },
  { value: "razgrad", label: "Razgrad", labelBg: "Разград", region: "Northeast", population: 29000 },
  { value: "gorna-oryahovitsa", label: "Gorna Oryahovitsa", labelBg: "Горна Оряховица", region: "North Central", population: 28000 },
  // Resort & Black Sea towns (important for marketplace)
  { value: "sunny-beach", label: "Sunny Beach", labelBg: "Слънчев бряг", region: "Southeast", population: 3000 },
  { value: "golden-sands", label: "Golden Sands", labelBg: "Златни пясъци", region: "Northeast", population: 2000 },
  { value: "bansko", label: "Bansko", labelBg: "Банско", region: "Southwest", population: 9000 },
  { value: "pamporovo", label: "Pamporovo", labelBg: "Пампорово", region: "South Central", population: 500 },
  { value: "borovets", label: "Borovets", labelBg: "Боровец", region: "Sofia Region", population: 300 },
  // Other option for smaller towns/villages
  { value: "other", label: "Other City/Village", labelBg: "Друг град/село", region: null },
] as const;

/**
 * Get city by value
 */
export function getCityByValue(value: string): BulgarianCity | undefined {
  return BULGARIAN_CITIES.find(city => city.value === value);
}

/**
 * Get city label (localized)
 */
export function getCityLabel(value: string, locale: string = 'en'): string {
  const city = getCityByValue(value);
  if (!city) return value;
  return locale === 'bg' ? city.labelBg : city.label;
}

/**
 * City values for Zod enum validation
 */
const CITY_VALUES = BULGARIAN_CITIES.map(c => c.value) as [string, ...string[]];

/**
 * Quick lookup map for validation
 */
export const CITY_VALUE_SET = new Set(BULGARIAN_CITIES.map(c => c.value));

/**
 * Validate if a value is a valid city
 */
function isValidCity(value: string): boolean {
  return CITY_VALUE_SET.has(value);
}
