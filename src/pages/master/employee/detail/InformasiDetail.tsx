import { Card } from '@/components/ui'
import { EmployeeDetailPage } from '@/services/api/@types/employee'
import Commission from './Commission'
import HistorySession from './HistorySession'

const InformasiDetail = ({
  employee,
}: {
  employee: EmployeeDetailPage | null
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <Card bodyClass="py-2">
        <div className="grid grid-cols-2 gap-2 py-2">
          <div className="flex flex-col">
            <span>Gaji pokok</span>
            <span className="font-semibold text-gray-950 dark:text-white">
              {employee?.earnings?.fbase_salary || '-'}
            </span>
          </div>
          <div className="flex flex-col">
            <span>Komisi Penjualan</span>
            <span className="font-semibold text-gray-950 dark:text-white">
              {/* {employee?.earnings
                ? employee?.earnings?.sales_type === 'nominal'
                  ? employee?.earnings?.fsales
                  : `${employee?.earnings?.fsales}%`
                : '-'} */}
              {employee?.earnings?.fsales}
            </span>
          </div>
          <div className="flex flex-col">
            <span>Komisi Per Sesi</span>
            <span className="font-semibold text-gray-950 dark:text-white">
              {employee?.earnings?.fsession || '-'}
            </span>
          </div>
          <div className="flex flex-col">
            <span>Komisi Per Class</span>
            <span className="font-semibold text-gray-950 dark:text-white">
              {employee?.earnings?.fclass || '-'}
            </span>
          </div>
        </div>
      </Card>

      <Commission employee={employee} />

      {employee?.type === 'trainer' && <HistorySession employee={employee} />}
    </div>
  )
}

export default InformasiDetail
