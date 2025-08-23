import { Card } from '@/components/ui'
import { ProductDetail } from '@/services/api/@types/product'
import classNames from '@/utils/classNames'
import { Box } from 'iconsax-react'
import { ReturnTransactionItemFormSchema } from '../utils/validation'

type ProductCardProps = {
  item: ProductDetail
  onClick?: (item: ProductDetail) => void
  disabled?: boolean
  formProps: ReturnTransactionItemFormSchema
}

const ProductCard = ({
  item,
  onClick,
  disabled,
  formProps,
}: ProductCardProps) => {
  return (
    <Card
      clickable={!disabled}
      className={classNames(
        'dark:text-gray-50 overflow-hidden',
        disabled && 'bg-gray-300'
      )}
      bodyClass="p-0"
      onClick={() => {
        if (!disabled) {
          formProps.setValue('data', item)
          formProps.setValue('item_type', 'product')
          formProps.setValue('product_id', item.id)
          formProps.setValue('name', item.name)
          formProps.setValue('product_qty', item.quantity)
          formProps.setValue('quantity', 1)
          formProps.setValue('price', item.price)
          formProps.setValue('sell_price', item.price)

          onClick?.(item)
        }
      }}
    >
      <div className="flex gap-2">
        <div
          className={classNames(
            'w-20 h-20 rounded-tl-lg rounded-bl-lg overflow-hidden text-gray-400 bg-gray-200 dark:bg-gray-700',
            disabled && 'text-gray-500'
          )}
        >
          <Box color="currentColor" size="80" variant="Bulk" />
        </div>
        <div className="flex-1 p-1 pl-0 relative">
          <h3 className="font-bold text-base line-clamp-1">{item.name}</h3>
          <span className="font-bold text-lg">{item.fprice}</span>
        </div>
      </div>
    </Card>
  )
}

export default ProductCard
