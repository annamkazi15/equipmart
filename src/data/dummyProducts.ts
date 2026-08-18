import type { Product } from '../types'
import { img } from './images'
import { fromLegacyProduct } from './normalize'

type LegacyProduct = Omit<Product, 'cardFields' | 'sections'> & {
  customFields: { label: string; value: string }[]
}

const SCAFFOLDING_NAMES = [
  'Cuplock Scaffolding System Rental',
  'H-Frame Scaffolding Rental',
  'Ring Lock Scaffolding Rental',
  'Tube & Coupler Scaffolding Rental',
  'Suspended Scaffolding Rental',
  'Mobile Tower Scaffold Rental',
  'Facade Access Scaffold Rental',
  'Industrial Pipe Scaffold Rental',
  'Modular Scaffold Platform Rental',
  'Stair Tower Scaffold Rental',
]

const COMPANIES = [
  'SkyFrame Scaffold Rentals',
  'BuildSafe Rentals',
  'HeightWorks India',
  'Metro Scaffold Co.',
  'SafeReach Rentals',
  'Prime Scaffold Hire',
  'Urban Climb Rentals',
  'SteelFrame Access',
  'NorthStar Scaffold',
  'Apex Height Rentals',
  'GreenBuild Scaffold',
  'CoreLift Rentals',
  'Summit Scaffold Hire',
  'RapidReach Rentals',
  'TrustFrame India',
  'Allied Scaffold Services',
  'ProHeight Rentals',
  'CityScaffold Solutions',
  'IronClad Access Hire',
  'Elevate Rentals India',
  'BuildCore Scaffold',
  'Horizon Height Hire',
  'SecureScaffold Rentals',
  'PeakFrame India',
  'BridgeLine Scaffold',
  'SiteSafe Rentals',
  'TowerFrame Hire',
  'National Scaffold Co.',
  'FlexScaffold Rentals',
  'StrongBase Access',
]

const LOCATIONS = [
  'Noida, Uttar Pradesh',
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'Ahmedabad, Gujarat',
  'Bengaluru, Karnataka',
  'Chennai, Tamil Nadu',
  'Hyderabad, Telangana',
  'Jaipur, Rajasthan',
  'Kolkata, West Bengal',
  'Lucknow, Uttar Pradesh',
  'Indore, Madhya Pradesh',
  'Chandigarh, Punjab',
  'Kochi, Kerala',
  'Bhopal, Madhya Pradesh',
  'Visakhapatnam, Andhra Pradesh',
  'Surat, Gujarat',
  'Nagpur, Maharashtra',
  'Coimbatore, Tamil Nadu',
  'Patna, Bihar',
  'Vadodara, Gujarat',
  'Gurugram, Haryana',
  'Thane, Maharashtra',
  'Faridabad, Haryana',
  'Rajkot, Gujarat',
  'Nashik, Maharashtra',
  'Agra, Uttar Pradesh',
  'Meerut, Uttar Pradesh',
  'Varanasi, Uttar Pradesh',
  'Ranchi, Jharkhand',
  'Dehradun, Uttarakhand',
]

const MATERIALS = [
  'Galvanized Steel',
  'MS Powder Coated',
  'Aluminium Alloy',
  'High-Tensile Steel',
  'Hot-Dip Galvanized',
  'Carbon Steel',
]

const RENTAL_UNITS = [
  'Per sq.m / day',
  'Per set / day',
  'Per week',
  'Per month',
  'Per bay / day',
  'Per tower / week',
]

const LOAD_CAPACITIES = ['Heavy Duty', 'Medium Duty', 'Light Duty', 'Extra Heavy Duty']

const MIN_HIRE = ['3 days', '7 days', '10 days', '14 days', '30 days']

const BAY_WIDTHS = ['0.9 m', '1.2 m', '1.5 m', '2.0 m']
const LIFT_HEIGHTS = ['1.5 m', '2.0 m', '2.5 m', '3.0 m']
const PLATFORM_TYPES = ['Steel Plank', 'Aluminium Deck', 'Timber Board', 'Composite Panel']
const SAFETY_COMPLIANCE = ['IS 4014', 'OSHA Compliant', 'EN 12810', 'BIS Certified']
const DELIVERY_RADIUS = ['25 km', '50 km', '75 km', '100 km', 'Pan-India']
const ERECTION_SUPPORT = ['Included', 'Available on request', 'Not included', 'Half-day included']

const TRUST_BADGES = ['TrustSEAL', 'Verified Supplier', 'Verified Exporter', 'Leading Supplier']

export function scaffoldingSpecFields(n: number) {
  return [
    { label: 'Rental Unit', value: RENTAL_UNITS[n % RENTAL_UNITS.length] },
    { label: 'Material', value: MATERIALS[n % MATERIALS.length] },
    { label: 'Load Capacity', value: LOAD_CAPACITIES[n % LOAD_CAPACITIES.length] },
    { label: 'Min. Hire Period', value: MIN_HIRE[n % MIN_HIRE.length] },
    { label: 'Bay Width', value: BAY_WIDTHS[n % BAY_WIDTHS.length] },
    { label: 'Lift Height', value: LIFT_HEIGHTS[n % LIFT_HEIGHTS.length] },
    { label: 'Platform Type', value: PLATFORM_TYPES[n % PLATFORM_TYPES.length] },
    { label: 'Safety Compliance', value: SAFETY_COMPLIANCE[n % SAFETY_COMPLIANCE.length] },
    { label: 'Delivery Radius', value: DELIVERY_RADIUS[n % DELIVERY_RADIUS.length] },
    { label: 'Erection Support', value: ERECTION_SUPPORT[n % ERECTION_SUPPORT.length] },
  ]
}

function slugifyCompany(name: string, index: number) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 12)
  return `${base}${index}`
}

/** Generates dummy scaffolding listings so category views have 30+ rows. */
export function generateScaffoldingDummyProducts(startIndex = 3, count = 28): LegacyProduct[] {
  return Array.from({ length: count }, (_, i) => {
    const n = startIndex + i
    const company = COMPANIES[(n - 1) % COMPANIES.length]
    const location = LOCATIONS[(n - 1) % LOCATIONS.length]
    const itemName = SCAFFOLDING_NAMES[(n - 1) % SCAFFOLDING_NAMES.length]
    const slug = slugifyCompany(company, n)

    return {
      id: `r-scaffold-${String(n).padStart(2, '0')}`,
      itemName: `${itemName}${n > 10 ? ` (${n})` : ''}`,
      itemCode: `SCF-${String(n).padStart(3, '0')}`,
      itemCategory: 'Scaffolding Rental',
      categorySlug: 'construction-equipment-rental',
      subcategorySlug: 'scaffolding-rental',
      description: `${itemName} available on flexible rental terms for residential, commercial, and industrial projects. Includes delivery, erection support, and safety-compliant components.`,
      vendorContact: `+91 98${String(10000000 + n * 137891).slice(0, 8)}`,
      hsnSacCode: '997212',
      price: 28 + (n % 12) * 4,
      location,
      company,
      contact: `rent@${slug}.in`,
      images:
        n % 3 === 0
          ? [img.scaffolding, img.construction]
          : n % 3 === 1
            ? [img.construction, img.scaffolding]
            : [img.scaffolding, img.boom],
      listingType: 'rental' as const,
      customFields: scaffoldingSpecFields(n),
      rating: 3.6 + (n % 10) * 0.1,
      reviewCount: 8 + (n % 40) * 3,
      responseRate: 82 + (n % 15),
      yearsInBusiness: 3 + (n % 18),
      trustBadge: TRUST_BADGES[n % TRUST_BADGES.length],
      companyLocation: location,
    }
  })
}

export function scaffoldingDummyProducts(): Product[] {
  return generateScaffoldingDummyProducts().map(fromLegacyProduct)
}
