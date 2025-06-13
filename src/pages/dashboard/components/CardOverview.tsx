import Card from '@/components/ui/Card'
import classNames from '@/utils/classNames'
import type { FC, ReactNode } from 'react'
import StatisticCard from './StatisticCard'

type CardOverviewProps = {
  className?: string
  data: {
    name: string
    value: number
    className?: string
    icon?: ReactNode
    description?: string
  }[]
}

const CardOverview: FC<CardOverviewProps> = ({ data, className }) => {
  return (
    <Card>
      <div
        className={classNames(
          'grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl',
          className
        )}
      >
        {data.map((item, index) => (
          <StatisticCard
            key={index}
            title={item.name}
            className={item?.className ?? 'bg-emerald-100 dark:bg-opacity-75'}
            value={item.value}
            icon={item.icon}
            description={item.description}
          />
        ))}
      </div>
    </Card>
  )
}

export default CardOverview
