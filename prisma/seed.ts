import { PrismaClient } from '../lib/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Check if already seeded
  const existingCountry = await prisma.country.findFirst({ where: { code: 'SO' } })
  if (existingCountry) {
    console.log('✅ Database already seeded, skipping...')
    return
  }

  // Create Somalia
  const country = await prisma.country.create({
    data: {
      id: 'somalia_country_id',
      name: 'Somalia',
      code: 'SO',
    },
  })
  console.log('✅ Created country:', country.name)

  // Create Mogadishu
  const city = await prisma.city.create({
    data: {
      id: 'mogadishu_city_id',
      name: 'Mogadishu',
      countryId: country.id,
    },
  })
  console.log('✅ Created city:', city.name)

  // Districts with their neighborhoods
  const districtsData = [
    { id: 'district_hamar_weyne', name: 'Hamar Weyne', neighborhoods: ['Bakaaro Market', 'Hamarweyne Market', 'Old Port Area', 'Historic Quarter', 'Central Mosque Area'] },
    { id: 'district_hamar_jajab', name: 'Hamar Jajab', neighborhoods: ['Villa Somalia', 'K4 Junction', 'Maka al-Mukarama Road', 'Government Quarter', 'Embassy District'] },
    { id: 'district_bondhere', name: 'Bondhere', neighborhoods: ['Bondhere Market', 'Industrial Area', 'Northern Residential', 'Bondhere Junction', 'Workshop Quarter'] },
    { id: 'district_shibis', name: 'Shibis', neighborhoods: ['Shibis Market', 'Radio Mogadishu Area', 'Shibis Junction', 'Educational Quarter', 'Residential Zone'] },
    { id: 'district_abdiaziz', name: 'Abdiaziz', neighborhoods: ['Abdiaziz Junction', 'Commercial Center', 'Mosque District', 'Residential Area', 'Market Zone'] },
    { id: 'district_wardhigley', name: 'Wardhigley', neighborhoods: ['Wardhigley Market', 'Airport Road', 'Villa Baidoa', 'Northern Suburbs', 'Industrial Zone'] },
    { id: 'district_hodan', name: 'Hodan', neighborhoods: ['Hodan Market', 'University Area', 'Stadium District', 'Hodan Junction', 'Residential Quarter'] },
    { id: 'district_hawl_wadaag', name: 'Hawl Wadaag', neighborhoods: ['Hawl Wadaag Market', 'Southern Port', 'Fishing Quarter', 'Coastal Area', 'Traditional Housing'] },
    { id: 'district_wadajir', name: 'Wadajir', neighborhoods: ['Wadajir Market', 'Bus Station', 'Transport Hub', 'Commercial Zone', 'Residential Blocks'] },
    { id: 'district_yaqshid', name: 'Yaqshid', neighborhoods: ['Yaqshid Market', 'Sports Complex', 'Eastern Residential', 'School District', 'Main Road Area'] },
    { id: 'district_karan', name: 'Karan', neighborhoods: ['Karan Market', 'Hospital Area', 'Northern Gateway', 'Karan Junction', 'Community Center'] },
    { id: 'district_dharkenley', name: 'Dharkenley', neighborhoods: ['Dharkenley Market', 'Western Suburbs', 'New Development', 'Agricultural Zone', 'Dharkenley Center'] },
    { id: 'district_dayniile', name: 'Dayniile', neighborhoods: ['Dayniile Market', 'IDP Settlement', 'Eastern Gateway', 'Rural Interface', 'Dayniile Junction'] },
    { id: 'district_kahda', name: 'Kahda', neighborhoods: ['Kahda Market', 'Outer Suburbs', 'New Settlement', 'Western Gateway', 'Kahda Center'] },
    { id: 'district_shangani', name: 'Shangani', neighborhoods: ['Shangani Beach', 'Historic Fort', 'Italian Quarter', 'Coastal Road', 'Fishing Village'] },
  ]

  let districtCount = 0
  let neighborhoodCount = 0

  for (const districtData of districtsData) {
    const district = await prisma.district.create({
      data: {
        id: districtData.id,
        name: districtData.name,
        cityId: city.id,
      },
    })
    districtCount++
    console.log(`  📍 Created district: ${district.name}`)

    for (const neighborhoodName of districtData.neighborhoods) {
      const neighborhoodId = `neighborhood_${neighborhoodName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`
      await prisma.neighborhood.create({
        data: {
          id: neighborhoodId,
          name: neighborhoodName,
          districtId: district.id,
        },
      })
      neighborhoodCount++
    }
  }

  console.log(`✅ Created ${districtCount} districts`)
  console.log(`✅ Created ${neighborhoodCount} neighborhoods`)
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
