import Chart from '@/components/shared/Chart'
import { Card } from '@/components/ui/Card'
import { COLOR_1, COLOR_2, COLOR_3 } from '@/constants/chart.constant'
import { MemberDetail } from '@/services/api/@types/member'
import { useState } from 'react'

interface InformasiDetailProps {
  member: MemberDetail | null
}

const InformasiDetail: React.FC<InformasiDetailProps> = ({ member }) => {
  // Dummy data untuk report sesi harian
  const [dailySessionData] = useState({
    series: [
      {
        name: 'Sesi Selesai',
        data: [30, 40, 45, 50, 49, 60, 70],
      },
    ],
    categories: [
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
      'Minggu',
    ],
  })

  // Dummy data untuk absensi mingguan (chart area)
  const [weeklyAttendanceArea] = useState({
    series: [
      {
        name: 'Absensi',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
    categories: [
      'Minggu 1',
      'Minggu 2',
      'Minggu 3',
      'Minggu 4',
      'Minggu 5',
      'Minggu 6',
      'Minggu 7',
    ],
  })

  // Dummy data untuk absensi mingguan (chart bar)
  const [weeklyAttendanceBar] = useState({
    series: [
      {
        name: 'Hadir',
        data: [44, 55, 41, 67, 22, 43, 21],
      },
      {
        name: 'Terlambat',
        data: [13, 23, 20, 8, 13, 27, 33],
      },
      {
        name: 'Absen',
        data: [11, 17, 15, 15, 21, 14, 15],
      },
    ],
    categories: [
      'Minggu 1',
      'Minggu 2',
      'Minggu 3',
      'Minggu 4',
      'Minggu 5',
      'Minggu 6',
      'Minggu 7',
    ],
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Report Sesi Harian */}
      <Card className="p-4">
        <h4 className="mb-4 font-semibold text-lg">Report Sesi Harian</h4>
        <Chart
          series={dailySessionData.series}
          xAxis={dailySessionData.categories}
          type="bar"
          height={300}
          customOptions={{
            colors: [COLOR_1],
            plotOptions: {
              bar: {
                borderRadius: 4,
                columnWidth: '35%',
              },
            },
          }}
        />
      </Card>

      {/* Absensi Mingguan (Area Chart) */}
      <Card className="p-4">
        <h4 className="mb-4 font-semibold text-lg">Absensi Mingguan (Area)</h4>
        <Chart
          series={weeklyAttendanceArea.series}
          xAxis={weeklyAttendanceArea.categories}
          type="area"
          height={300}
          customOptions={{
            colors: [COLOR_2],
          }}
        />
      </Card>

      {/* Absensi Mingguan (Bar Chart) */}
      <Card className="p-4 lg:col-span-2">
        <h4 className="mb-4 font-semibold text-lg">
          Absensi Mingguan (Detail)
        </h4>
        <Chart
          series={weeklyAttendanceBar.series}
          xAxis={weeklyAttendanceBar.categories}
          type="bar"
          height={300}
          customOptions={{
            colors: [COLOR_1, COLOR_2, COLOR_3],
            plotOptions: {
              bar: {
                borderRadius: 4,
                columnWidth: '55%',
              },
            },
          }}
        />
      </Card>
    </div>
  )
}

export default InformasiDetail
