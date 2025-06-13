import { Button, Card } from '@/components/ui'
import { currencyFormat } from '@/components/ui/InputCurrency/currencyFormat'
import { Edit } from 'iconsax-react'
import React from 'react'
import { TransactionItemSchema } from '../validation'

type ItemProductCardProps = {
  item: TransactionItemSchema
  onClick?: (item: TransactionItemSchema) => void
}

const ItemProductCard: React.FC<ItemProductCardProps> = ({ item, onClick }) => {
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
        <div className="text-left leading-none">
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
    </Card>
  )
}

export default ItemProductCard
