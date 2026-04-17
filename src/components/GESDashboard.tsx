'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from 'recharts'
import type { GESData } from '@/app/page'

const HOURS = [
  '00-01','01-02','02-03','03-04','04-05','05-06','06-07','07-08',
  '08-09','09-10','10-11','11-12','12-13','13-14','14-15','15-16',
  '16-17','17-18','18-19','19-20','20-21','21-22','22-23','23-24',
]

const VERIS_COLOR = '#2563eb'
const CEKIS_COLOR = '#dc2626'

type Props = { data: GESData }

function StatCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{unit}</p>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-medium" style={{ color: p.color }}>
            {p.value.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} kWh
          </span>
        </div>
      ))}
    </div>
  )
}

export default function GESDashboard({ data }: Props) {
  const [selectedDay, setSelectedDay] = useState(1)
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')

  const dayData = useMemo(() => {
    const raw = data[String(selectedDay)]
    return HOURS.map(hour => ({
      saat: hour,
      Veriş: raw[hour]?.veris ?? 0,
      Çekiş: raw[hour]?.cekis ?? 0,
    }))
  }, [data, selectedDay])

  const stats = useMemo(() => {
    const totalVeris = dayData.reduce((s, r) => s + r['Veriş'], 0)
    const totalCekis = dayData.reduce((s, r) => s + r['Çekiş'], 0)
    const peakVerisRow = dayData.reduce((a, b) => b['Veriş'] > a['Veriş'] ? b : a)
    const peakCekisRow = dayData.reduce((a, b) => b['Çekiş'] > a['Çekiş'] ? b : a)
    return { totalVeris, totalCekis, peakVerisRow, peakCekisRow, net: totalVeris - totalCekis }
  }, [dayData])

  const monthlyStats = useMemo(() => {
    let totalVeris = 0, totalCekis = 0
    for (let d = 1; d <= 31; d++) {
      const raw = data[String(d)]
      if (!raw) continue
      HOURS.forEach(h => {
        totalVeris += raw[h]?.veris ?? 0
        totalCekis += raw[h]?.cekis ?? 0
      })
    }
    return { totalVeris, totalCekis }
  }, [data])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-white font-bold text-sm">
              ☀
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GES Dashboard</h1>
              <p className="text-xs text-gray-500">Güneş Enerji Santrali — Mart 2024</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            31 günlük veri
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Monthly summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Mart Toplam Veriş</p>
            <p className="text-xl font-bold text-blue-700">
              {(monthlyStats.totalVeris / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MWh
            </p>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-100 p-4">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Mart Toplam Çekiş</p>
            <p className="text-xl font-bold text-red-700">
              {(monthlyStats.totalCekis / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MWh
            </p>
          </div>
        </div>

        {/* Day selector */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Gün Seçimi</h2>
            <span className="text-sm font-bold text-blue-600">
              {selectedDay} Mart 2024
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setSelectedDay(d => Math.max(1, d - 1))}
              className="flex-1 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← Önceki
            </button>
            <button
              onClick={() => setSelectedDay(d => Math.min(31, d + 1))}
              className="flex-1 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Sonraki →
            </button>
          </div>
        </div>

        {/* Day stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Günlük Veriş"
            value={stats.totalVeris}
            unit="kWh toplam"
            color={VERIS_COLOR}
          />
          <StatCard
            label="Günlük Çekiş"
            value={stats.totalCekis}
            unit="kWh toplam"
            color={CEKIS_COLOR}
          />
          <StatCard
            label="Pik Veriş"
            value={stats.peakVerisRow['Veriş']}
            unit={`${stats.peakVerisRow.saat} saatinde`}
            color={VERIS_COLOR}
          />
          <StatCard
            label="Pik Çekiş"
            value={stats.peakCekisRow['Çekiş']}
            unit={`${stats.peakCekisRow.saat} saatinde`}
            color={CEKIS_COLOR}
          />
        </div>

        {/* Chart / Table toggle */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">
              {selectedDay} Mart — Saatlik Veriş / Çekiş
            </h2>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  viewMode === 'chart' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Grafik
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tablo
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 px-5 pt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: VERIS_COLOR }} />
              Veriş (şebekeye verilen)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: CEKIS_COLOR }} />
              Çekiş (şebekeden çekilen)
            </span>
          </div>

          {viewMode === 'chart' ? (
            <div className="px-2 py-4">
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={dayData} margin={{ top: 4, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="saat"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : String(v)}
                    label={{ value: 'kWh', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: '#9ca3af' } }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="Veriş" fill={VERIS_COLOR} radius={[3, 3, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="Çekiş" fill={CEKIS_COLOR} radius={[3, 3, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Saat</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: VERIS_COLOR }}>Veriş (kWh)</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: CEKIS_COLOR }}>Çekiş (kWh)</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Net (kWh)</th>
                  </tr>
                </thead>
                <tbody>
                  {dayData.map((row, i) => {
                    const net = row['Veriş'] - row['Çekiş']
                    return (
                      <tr key={row.saat} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="px-5 py-2.5 font-mono text-xs font-medium text-gray-700">{row.saat}</td>
                        <td className="px-5 py-2.5 text-right font-medium" style={{ color: VERIS_COLOR }}>
                          {row['Veriş'].toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-2.5 text-right font-medium" style={{ color: CEKIS_COLOR }}>
                          {row['Çekiş'].toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-5 py-2.5 text-right font-medium text-xs ${net >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {net >= 0 ? '+' : ''}{net.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50 font-bold">
                    <td className="px-5 py-3 text-xs text-gray-600">TOPLAM</td>
                    <td className="px-5 py-3 text-right text-sm" style={{ color: VERIS_COLOR }}>
                      {stats.totalVeris.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-5 py-3 text-right text-sm" style={{ color: CEKIS_COLOR }}>
                      {stats.totalCekis.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className={`px-5 py-3 text-right text-sm ${stats.net >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {stats.net >= 0 ? '+' : ''}{stats.net.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Monthly heatmap-style overview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Mart Ayı Günlük Özet (Toplam Veriş)</h2>
          <MonthlyOverview data={data} selectedDay={selectedDay} onSelect={setSelectedDay} />
        </div>

      </main>
    </div>
  )
}

function MonthlyOverview({ data, selectedDay, onSelect }: {
  data: GESData
  selectedDay: number
  onSelect: (d: number) => void
}) {
  const dailyTotals = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1
      const raw = data[String(day)]
      if (!raw) return { day, veris: 0, cekis: 0 }
      const veris = HOURS.reduce((s, h) => s + (raw[h]?.veris ?? 0), 0)
      const cekis = HOURS.reduce((s, h) => s + (raw[h]?.cekis ?? 0), 0)
      return { day, veris, cekis }
    })
  }, [data])

  const maxVeris = Math.max(...dailyTotals.map(d => d.veris))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={dailyTotals} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        onClick={(e) => e?.activePayload && onSelect(e.activePayload[0].payload.day)}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
        <YAxis hide />
        <Tooltip
          formatter={(v: number) => [`${v.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} kWh`]}
          labelFormatter={(l) => `${l} Mart`}
        />
        <Bar dataKey="veris" name="Veriş" radius={[2, 2, 0, 0]} cursor="pointer">
          {dailyTotals.map((entry) => (
            <Cell
              key={entry.day}
              fill={entry.day === selectedDay ? '#1d4ed8' : '#93c5fd'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
