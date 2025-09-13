import { Button, Card } from '@/components/ui'
import { Edit } from 'iconsax-react'
import React from 'react'
import { ProcessedItem } from '../utils/generateCartData'

type CheckoutItemProductCardProps = {
  item: ProcessedItem
  showEdit?: boolean
  onClick?: (item: ProcessedItem) => void
}

const CheckoutItemProductCard: React.FC<CheckoutItemProductCardProps> = ({
  item,
  showEdit = true,
  onClick,
}) => {
  return (
    <Card bodyClass="p-4 relative z-10">
      {showEdit ? (
        <div className="absolute bottom-0 right-0 z-20 bg-gray-300 dark:bg-gray-700 hover:bg-primary-subtle rounded-br-lg rounded-tl-lg">
          <Button
            variant="plain"
            size="sm"
            className="w-8 h-8 hover:bg-primary-subtle"
            icon={<Edit color="currentColor" size={16} />}
            onClick={(e) => {
              e.stopPropagation()
              onClick?.(item)
            }}
          />
        </div>
      ) : null}

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] gap-4 lg:items-start">
        <div className="space-y-3">
          <div className="flex flex-col">
            <h6 className="font-bold text-lg leading-tight">{item.name}</h6>
          </div>

          {/* Product Details */}
          <div className="flex flex-wrap gap-4 text-sm">
            {/* Qty */}
            <div className="space-y-1 min-w-[50px] flex-shrink-0">
              <span className="text-gray-600 dark:text-gray-400 block font-semibold">
                Qty:
              </span>
              <span className="font-medium">{item.quantity}</span>
            </div>

            {/* Discount */}
            {item.discount && item.discount > 0 ? (
              <div className="space-y-1 min-w-[90px] flex-shrink-0">
                <span className="text-gray-600 dark:text-gray-400 block font-semibold">
                  Discount:
                </span>
                <span className="font-medium bg-primary text-white px-2 py-1 rounded">
                  {item.discount_type === 'percent'
                    ? `${item.discount}%`
                    : item.fdiscount_amount}
                </span>
              </div>
            ) : null}

            {/* Notes */}
            {item.notes && (
              <div className="space-y-1 w-full">
                <span className="text-gray-600 dark:text-gray-400 block font-semibold">
                  Note:
                </span>
                <div className="font-medium break-words">{item.notes}</div>
              </div>
            )}
          </div>
        </div>

        <div className="text-right pb-4">
          <div className="space-y-1">
            <div className="font-bold text-xl text-primary">
              {item.fnet_amount}
            </div>
            {item.discount && item.discount > 0 ? (
              <div className="line-through text-sm text-gray-500">
                {item.fgross_amount}
              </div>
            ) : null}

            {item.taxes.length > 0 ? (
              <div className="mt-2 space-y-1">
                {item.taxes.map((tax) => (
                  <div key={tax.id} className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {tax.name}
                    </span>
                    <span className="font-medium ml-2">
                      {`(${tax.rate}%, ${tax.ftax_amount})`}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CheckoutItemProductCard
