import { Button, Card } from '@/components/ui'
import { currencyFormat } from '@/components/ui/InputCurrency/currencyFormat'
import { PackageType, categoryPackage } from '@/constants'
import { Edit } from 'iconsax-react'
import React from 'react'
import { TransactionItemSchema } from '../validation'

type ItemPackageCardProps = {
  item: TransactionItemSchema
  onClick?: (item: TransactionItemSchema) => void
}

const ItemPackageCard: React.FC<ItemPackageCardProps> = ({ item, onClick }) => {
  return (
    <Card bodyClass="p-3 flex flex-col justify-between h-full relative z-10">
      <div className="absolute top-0 right-0 z-20 bg-gray-300 dark:bg-gray-700 hover:bg-primary-subtle rounded-tr-lg rounded-bl-lg">
        <Button
          variant="plain"
          size="sm"
          className="w-8 h-8"
          icon={<Edit color="currentColor" size={16} />}
          onClick={(e) => {
            e.stopPropagation()
            onClick?.(item)
          }}
        />
      </div>
      <h6 className="font-bold">{item.name}</h6>
      <div className="flex justify-between items-end w-full z-10">
        <div className="flex flex-col">
          <span>
            {
              categoryPackage.filter(
                (option) => option.value === item.package_type
              )[0]?.label
            }
            {item.package_type === PackageType.PT_PROGRAM &&
              ` (${item.session_duration} Ss)`}
          </span>
          <span>
            {item.duration} {item.duration_type}
          </span>
        </div>
        <div className="text-right leading-none">
          {item.discount && item.discount > 0 ? (
            <span className="line-through text-sm">
              {currencyFormat(item.price ?? 0)}
            </span>
          ) : null}
          <span className="font-bold text-lg block -mt-0.5">
            {currencyFormat(item.sell_price ?? 0)}
          </span>
        </div>
      </div>
      <div className="flex justify-start gap-2">
        {item.extra_session && item.extra_session > 0 ? (
          <div className="flex gap-2 mt-1">
            <span className="text-sm">Extra Session:</span>
            <span className="font-bold">{item.extra_session} Ss</span>
          </div>
        ) : null}
        {item.extra_day && item.extra_day > 0 ? (
          <div className="flex gap-2 mt-1">
            <span className="text-sm">Extra Day:</span>
            <span className="font-bold">{item.extra_day} D</span>
          </div>
        ) : null}
      </div>
      {item.package_type === PackageType.CLASS && (
        <div className="flex flex-col mt-1">
          <span className="font-bold">Class</span>
          <span className="text-sm">
            {item.classes?.map((item) => item.name).join(', ')}
          </span>
        </div>
      )}
      {item.package_type !== PackageType.MEMBERSHIP ? (
        <div className="flex flex-col mt-1">
          <span className="font-bold">
            {item.package_type === PackageType.CLASS ? 'Instructor' : 'Trainer'}
          </span>
          <span className="text-sm">
            {[
              ...(item?.instructors ? item.instructors : []),
              ...(item.trainers ? item.trainers : []),
            ]
              ?.map((item) => item.name)
              ?.slice(0, 3)
              ?.join(', ')}
          </span>
        </div>
      ) : null}
    </Card>
  )
}

export default ItemPackageCard
