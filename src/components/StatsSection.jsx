import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function StatsSection() {
  const { t } = useTranslation()

  const barData = [
    { year: '2019', market: 45 },
    { year: '2020', market: 50 },
    { year: '2021', market: 60 },
    { year: '2022', market: 70 },
    { year: '2023', market: 80 },
  ]

  const lineData = [
    { month: 'Jan', savings: 10 },
    { month: 'Feb', savings: 12 },
    { month: 'Mar', savings: 14 },
    { month: 'Apr', savings: 16 },
    { month: 'May', savings: 18 },
    { month: 'Jun', savings: 20 },
  ]

  const pieData = [
    { name: 'Bumpers', value: 35 },
    { name: 'Lights', value: 25 },
    { name: 'Hoods', value: 20 },
    { name: 'Fenders', value: 20 },
  ]

  const COLORS = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa']

  return (
    <section className="py-16 bg-gray-50 text-gray-900 px-6" id="insights">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{t('insights.title')}</h2>
        <p className="mb-8 max-w-2xl mx-auto">{t('insights.subtitle')}</p>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white p-4 rounded shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="market" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 font-medium">{t('insights.barLabel')}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="savings" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-2 font-medium">{t('insights.lineLabel')}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-2 font-medium">{t('insights.pieLabel')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
