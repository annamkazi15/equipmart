import type { CategoryGroup } from '../types'
import { img } from './images'

export const categoryGroups: CategoryGroup[] = [
  {
    id: 'construction-rental',
    name: 'Construction Equipment Rental Service',
    slug: 'construction-equipment-rental',
    image: img.construction,
    listingType: 'rental',
    subcategories: [
      { id: 'scaffolding', name: 'Scaffolding Rental', slug: 'scaffolding-rental', image: img.scaffolding, count: 1707 },
      { id: 'crane-rental', name: 'Crane Rental', slug: 'crane-rental', image: img.crane, count: 2451 },
      { id: 'road-roller', name: 'Road Roller Rental', slug: 'road-roller-rental', image: img.roller, count: 892 },
      { id: 'concrete-mixer', name: 'Concrete Mixer Rental', slug: 'concrete-mixer-rental', image: img.mixer, count: 1204 },
      { id: 'air-compressor', name: 'Air Compressor Rental', slug: 'air-compressor-rental', image: img.compressor, count: 1563 },
      { id: 'boom-placer', name: 'Boom Placer Rental Service', slug: 'boom-placer-rental', image: img.boom, count: 438 },
      { id: 'generator-rental', name: 'Generator Rental', slug: 'generator-rental', image: img.generator, count: 2105 },
      { id: 'forklift-rental', name: 'Forklift Rental', slug: 'forklift-rental', image: img.forklift, count: 987 },
    ],
  },
  {
    id: 'crane-rental-group',
    name: 'Crane Rental',
    slug: 'crane-rental-services',
    image: img.crane,
    listingType: 'rental',
    subcategories: [
      { id: 'mobile-crane', name: 'Mobile Crane Rental Services', slug: 'mobile-crane-rental', image: img.mobileCrane, count: 1120 },
      { id: 'tower-crane', name: 'Tower Crane Rental Services', slug: 'tower-crane-rental', image: img.towerCrane, count: 645 },
      { id: 'telescopic-crane', name: 'Telescopic Crane Rental Service', slug: 'telescopic-crane-rental', image: img.crane, count: 523 },
      { id: 'hydraulic-crane', name: 'Hydraulic Crane Rental Service', slug: 'hydraulic-crane-rental', image: img.mobileCrane, count: 891 },
      { id: 'truck-crane', name: 'Truck Mounted Crane Rental Service', slug: 'truck-mounted-crane-rental', image: img.crane, count: 734 },
      { id: 'heavy-crane', name: 'Heavy Duty Crane Rental', slug: 'heavy-duty-crane-rental', image: img.towerCrane, count: 412 },
    ],
  },
  {
    id: 'earthmoving',
    name: 'Earthmoving Equipment Rental',
    slug: 'earthmoving-equipment-rental',
    image: img.earthmoving,
    listingType: 'rental',
    subcategories: [
      { id: 'excavator', name: 'Excavator Rental', slug: 'excavator-rental', image: img.excavator, count: 3210 },
      { id: 'rock-breaker', name: 'Rock Breaker Machine Rental Service', slug: 'rock-breaker-rental', image: img.rockBreaker, count: 678 },
      { id: 'rig-rental', name: 'Rig Rental Services', slug: 'rig-rental', image: img.drillRig, count: 445 },
      { id: 'bulldozer', name: 'Bulldozer Rental', slug: 'bulldozer-rental', image: img.bulldozer, count: 892 },
      { id: 'mini-excavator', name: 'Mini Excavator Rental', slug: 'mini-excavator-rental', image: img.miniExcavator, count: 1543 },
      { id: 'motor-grader', name: 'Motor Grader Rental', slug: 'motor-grader-rental', image: img.grader, count: 356 },
    ],
  },
  {
    id: 'drilling-products',
    name: 'Drilling & Boring Equipment',
    slug: 'drilling-boring-equipment',
    image: img.drillRig,
    listingType: 'product',
    subcategories: [
      { id: 'dth-rig', name: 'DTH Drilling Rig', slug: 'dth-drilling-rig', image: img.drillRig, count: 112 },
      { id: 'water-well', name: 'Water Well Drilling Rigs', slug: 'water-well-drilling-rigs', image: img.drillRig2, count: 87 },
      { id: 'bore-well', name: 'Bore Well Drilling Machine', slug: 'bore-well-drilling-machine', image: img.drillRig, count: 95 },
      { id: 'crawler-drill', name: 'Crawler Drill Machine', slug: 'crawler-drill-machine', image: img.drillRig2, count: 64 },
      { id: 'piling-rig', name: 'Piling Rig', slug: 'piling-rig', image: img.drillRig2, count: 53 },
      { id: 'core-drill', name: 'Core Drilling Machine', slug: 'core-drilling-machine', image: img.drillRig, count: 41 },
    ],
  },
  {
    id: 'material-handling',
    name: 'Material Handling Equipment',
    slug: 'material-handling-equipment',
    image: img.warehouse,
    listingType: 'product',
    subcategories: [
      { id: 'forklift', name: 'Industrial Forklift', slug: 'industrial-forklift', image: img.forklift, count: 234 },
      { id: 'pallet-jack', name: 'Pallet Jack', slug: 'pallet-jack', image: img.palletJack, count: 189 },
      { id: 'stacker', name: 'Stacker Machine', slug: 'stacker-machine', image: img.stacker, count: 76 },
      { id: 'hoist', name: 'Electric Hoist', slug: 'electric-hoist', image: img.hoist, count: 145 },
      { id: 'conveyor', name: 'Belt Conveyor', slug: 'belt-conveyor', image: img.conveyor, count: 98 },
      { id: 'crane-product', name: 'Overhead Crane', slug: 'overhead-crane', image: img.towerCrane, count: 67 },
    ],
  },
  {
    id: 'power-tools',
    name: 'Industrial Power & Tools',
    slug: 'industrial-power-tools',
    image: img.power,
    listingType: 'product',
    subcategories: [
      { id: 'diesel-gen', name: 'Diesel Generator', slug: 'diesel-generator', image: img.generator, count: 312 },
      { id: 'welding-machine', name: 'Welding Machine', slug: 'welding-machine', image: img.welding, count: 278 },
      { id: 'water-pump', name: 'Industrial Water Pump', slug: 'industrial-water-pump', image: img.pump, count: 201 },
      { id: 'air-comp-product', name: 'Air Compressor', slug: 'air-compressor', image: img.compressor, count: 256 },
      { id: 'cutter', name: 'Concrete Cutter', slug: 'concrete-cutter', image: img.cutter, count: 88 },
      { id: 'vibrator', name: 'Concrete Vibrator', slug: 'concrete-vibrator', image: img.vibrator, count: 124 },
    ],
  },
]

export function getCategoryBySlug(slug: string) {
  for (const group of categoryGroups) {
    const sub = group.subcategories.find((s) => s.slug === slug)
    if (sub) {
      return { group, subcategory: sub }
    }
  }
  return null
}

export function getGroupsByType(type: 'rental' | 'product') {
  return categoryGroups.filter((g) => g.listingType === type)
}
