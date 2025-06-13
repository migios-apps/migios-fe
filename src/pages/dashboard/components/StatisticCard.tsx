import { NumberTicker } from '@/components/template/MagicUI/NumberTicker'
import classNames from '@/utils/classNames'
import { ReactNode } from 'react'

type StatisticCardProps = {
  title: string
  icon: ReactNode
  className: string
  value: number
  description?: string
}

const StatisticCard = ({
  title,
  className,
  icon,
  value,
  description,
}: StatisticCardProps) => {
  return (
    <div
      className={classNames(
        'rounded-2xl p-4 flex flex-col justify-center',
        className
      )}
    >
      <div className="flex justify-between items-start relative">
        <div className="flex flex-col gap-2">
          <div className="text-gray-900 text-md font-bold">{title}</div>
          {value > 0 ? (
            <NumberTicker
              value={value}
              className="whitespace-pre-wrap text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-900"
            />
          ) : (
            <span className="text-gray-900 dark:text-gray-900 text-3xl md:text-5xl font-bold tracking-tighter">
              {value}
            </span>
          )}
          {description && (
            <div className="text-xs text-gray-600">{description}</div>
          )}
        </div>
        <div
          className={
            'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 bg-gray-900 text-white rounded-full text-2xl'
          }
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatisticCard
