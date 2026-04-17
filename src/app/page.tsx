import GESDashboard from '@/components/GESDashboard'
import gesData from '@/data/ges_data.json'

export default function Home() {
  return <GESDashboard data={gesData as GESData} />
}

export type HourData = { veris: number; cekis: number }
export type DayData = Record<string, HourData>
export type GESData = Record<string, DayData>
