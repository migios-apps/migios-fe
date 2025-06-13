import { DatePickerAIO, DatePickerAIOPropsValue } from '@/components/ui'
import Card from '@/components/ui/Card'
import { currencyFormat } from '@/components/ui/InputCurrency/currencyFormat'
import { getMenuShortcutDatePickerByType } from '@/components/ui/hooks/useDatePicker'
import { COLOR_1, COLOR_2, COLOR_3 } from '@/constants/chart.constant'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { apiGetOverviewChart } from '@/services/api/analytic'
import { useThemeStore } from '@/store/themeStore'
import classNames from '@/utils/classNames'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Money, UserCirlceAdd, UserTick } from 'iconsax-react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { NumericFormat } from 'react-number-format'

type Category = 'sales' | 'members' | 'attendance'

type StatisticCardProps = {
  title: string
  value: number | ReactNode
  icon: ReactNode
  iconClass: string
  label: Category
  compareFrom?: string | ReactNode
  active: boolean
  onClick: (label: Category) => void
}

const chartColors: Record<Category, string> = {
  sales: COLOR_1,
  members: COLOR_2,
  attendance: COLOR_3,
}

const StatisticCard = (props: StatisticCardProps) => {
  const { title, value, label, icon, iconClass, active, compareFrom, onClick } =
    props

  return (
    <button
      className={classNames(
        'p-4 rounded-2xl cursor-pointer ltr:text-left rtl:text-right transition duration-150 outline-none',
        active
          ? 'bg-white dark:bg-gray-900 shadow-md'
          : 'border border-gray-300 dark:border-gray-500'
      )}
      onClick={() => onClick(label)}
    >
      <div className="flex md:flex-col-reverse gap-2 2xl:flex-row justify-between relative">
        <div>
          <div className="mb-2 text-sm font-semibold">{title}</div>
          <div className="mb-1">{value}</div>
          {compareFrom ? (
            <div className="inline-flex items-center flex-wrap gap-1">
              {compareFrom}
            </div>
          ) : null}
        </div>
        <div
          className={classNames(
            'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl',
            iconClass
          )}
        >
          {icon}
        </div>
      </div>
    </button>
  )
}

const Overview = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('sales')

  // const [selectedPeriod, setSelectedPeriod] = useState<Period>('thisMonth')
  const sideNavCollapse = useThemeStore((state) => state.layout.sideNavCollapse)
  const isFirstRender = useRef(true)

  const defaultMenu = getMenuShortcutDatePickerByType('thisMonth').menu
  const [valueDateRangePicker, setValueDateRangePicker] =
    useState<DatePickerAIOPropsValue>({
      type: defaultMenu?.type,
      name: defaultMenu.name,
      date: [
        defaultMenu.options.defaultStartDate,
        defaultMenu.options.defaultEndDate,
      ],
    })

  const {
    data: overview,
    // isLoading,
    // error,
  } = useQuery({
    queryKey: [QUERY_KEY.overview, valueDateRangePicker],
    queryFn: () =>
      apiGetOverviewChart({
        start_date: dayjs(valueDateRangePicker.date[0]).format('YYYY-MM-DD'),
        end_date: dayjs(valueDateRangePicker.date[1]).format('YYYY-MM-DD'),
      }),
    select: (res) => res.data,
    enabled: !!valueDateRangePicker,
  })

  useEffect(() => {
    if (!sideNavCollapse && isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!isFirstRender.current) {
      window.dispatchEvent(new Event('resize'))
    }
  }, [sideNavCollapse])

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h4>Overview</h4>
        <DatePickerAIO
          variant="range"
          align="end"
          options={[
            'thisWeek',
            'sevenDaysAgo',
            'thisMonth',
            'lastMonth',
            'thisYear',
            'lastYear',
            'custom',
          ]}
          value={valueDateRangePicker}
          onChange={(value) => {
            setValueDateRangePicker(value)
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl p-3 bg-gray-100 dark:bg-gray-700 mt-4">
        <StatisticCard
          title="Total penjualan"
          value={<h3>{currencyFormat(overview?.sales.total_sales || 0)}</h3>}
          iconClass="bg-sky-200"
          icon={<Money color="currentColor" size="32" variant="Bulk" />}
          label="sales"
          active={selectedCategory === 'sales'}
          compareFrom={
            <span className="flex flex-col">
              {dayjs(valueDateRangePicker.date[0]).format('DD MMM YYYY')} -{' '}
              {dayjs(valueDateRangePicker.date[1]).format('DD MMM YYYY')}
            </span>
          }
          onClick={setSelectedCategory}
        />
        <StatisticCard
          title="Total member baru"
          value={
            <h3>
              <NumericFormat
                displayType="text"
                value={overview?.members.total_members}
                thousandSeparator={true}
              />
            </h3>
          }
          iconClass="bg-emerald-200"
          icon={<UserCirlceAdd color="currentColor" size="32" variant="Bulk" />}
          label="members"
          active={selectedCategory === 'members'}
          compareFrom={
            <span className="flex flex-col">
              {dayjs(valueDateRangePicker.date[0]).format('DD MMM YYYY')} -{' '}
              {dayjs(valueDateRangePicker.date[1]).format('DD MMM YYYY')}
            </span>
          }
          onClick={setSelectedCategory}
        />
        <StatisticCard
          title="Total kehadiran"
          value={
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h3 className="mb-1">{overview?.attendance.total_checkin}</h3>
                <p>Check-in</p>
              </div>
              <div className="flex flex-col">
                <h3 className="mb-1">{overview?.attendance.total_checkout}</h3>
                <p>Check-out</p>
              </div>
            </div>
          }
          iconClass="bg-emerald-200"
          icon={<UserTick color="currentColor" size="32" variant="Bulk" />}
          label="attendance"
          active={selectedCategory === 'attendance'}
          onClick={setSelectedCategory}
        />
      </div>
      {overview && (
        <ReactApexChart
          options={{
            chart: {
              type: 'area' as ApexChart['type'],
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: 'smooth',
            },
            xaxis: {
              categories: overview[selectedCategory].categories,
              type: 'category',
              labels: {
                show: true,
                formatter: function (value: string) {
                  return dayjs(value).isValid()
                    ? `${dayjs(value).format('DD MMM')}`
                    : value
                },
              },
            },
            tooltip: {
              x: {
                formatter: function (index: number) {
                  const value = overview[selectedCategory].categories[index]
                  return dayjs(value).isValid()
                    ? `${dayjs(value).format('dddd, DD MMM, YYYY')}`
                    : value
                },
              },
            },
            yaxis: {
              labels: {
                formatter: function (value) {
                  return selectedCategory === 'sales'
                    ? currencyFormat(value)
                    : value.toFixed(0)
                },
              },
            },
            colors:
              selectedCategory === 'attendance'
                ? [COLOR_2, COLOR_3]
                : [chartColors[selectedCategory]],
            fill: {
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100],
              },
            },
          }}
          series={overview[selectedCategory].series}
          type="area"
          height={390}
        />
      )}
    </Card>
  )
}

export default Overview
