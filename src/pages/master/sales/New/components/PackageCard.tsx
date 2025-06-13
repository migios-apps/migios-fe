import { Card } from '@/components/ui'
import {
  PackageType,
  categoryPackage,
  gradientPackages,
  textColorPackages,
} from '@/constants'
import { PackageDetail } from '@/services/api/@types/package'
import classNames from '@/utils/classNames'
import { Profile, Profile2User } from 'iconsax-react'
import { FaUsers } from 'react-icons/fa'
import { ReturnTransactionItemFormSchema } from '../validation'

type PackageCardProps = {
  item: PackageDetail
  onClick?: (item: PackageDetail) => void
  disabled?: boolean
  formProps: ReturnTransactionItemFormSchema
}

const gradientDisabled = {
  membership: 'bg-gray-500',
  pt_program: 'bg-gray-500',
  class: 'bg-gray-500',
}

const iconPackages = {
  membership: Profile,
  pt_program: Profile2User,
  class: FaUsers,
}

const iconColorPackages = {
  membership: '!text-white/20 dark:text-cyan-500/20',
  pt_program: '!text-white/20 dark:text-gray-500/20',
  class: '!text-white/20 dark:text-amber-500/20',
}

const PackageCard = ({
  item,
  onClick,
  disabled,
  formProps,
}: PackageCardProps) => {
  const IconComponent =
    iconPackages[item.type as keyof typeof iconPackages] || Profile

  return (
    <Card
      clickable={!disabled}
      className={classNames(
        'bg-gradient-to-r min-h-[120px] transform transition-all duration-100 relative overflow-hidden',
        !disabled && 'active:scale-95 hover:shadow-lg',
        disabled
          ? classNames(
              gradientDisabled[item.type as keyof typeof gradientDisabled],
              'opacity-75 cursor-not-allowed'
            )
          : gradientPackages[item.type as keyof typeof gradientPackages] ||
              'from-gray-400 to-gray-500 text-white dark:from-gray-600/40 dark:to-gray-700/40 dark:text-gray-100'
      )}
      bodyClass="p-3 flex flex-col justify-between h-full relative z-10"
      bordered={false}
      onClick={() => {
        if (!disabled) {
          formProps.setValue('data', item)
          formProps.setValue('item_type', 'package')
          formProps.setValue('package_id', item.id)
          formProps.setValue('is_promo', item.is_promo)
          formProps.setValue('package_type', item.type)
          formProps.setValue('name', item.name)
          formProps.setValue('quantity', 1)
          formProps.setValue('price', item.price)
          formProps.setValue('sell_price', item.sell_price)
          formProps.setValue('loyalty_point', item.loyalty_point)
          formProps.setValue('duration', item.duration)
          formProps.setValue('duration_type', item.duration_type)
          formProps.setValue('session_duration', item.session_duration)
          formProps.setValue('classes', item.classes)
          formProps.setValue('trainers', [])
          formProps.setValue('instructors', item.instructors)
          formProps.setValue('allow_all_trainer', item.allow_all_trainer)
          if (item.is_promo) {
            formProps.setValue('discount_type', item.discount_type)
            formProps.setValue('discount', item.discount)
          }
          onClick?.(item)
        }
      }}
    >
      {item.is_promo === 1 && (
        <div
          className={classNames(
            'absolute -right-10 top-4 rotate-45 text-white py-0.5 w-32 text-center text-xs font-bold shadow-lg z-10',
            disabled ? 'bg-gray-600' : 'bg-red-500'
          )}
        >
          PROMO
        </div>
      )}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2">
        <IconComponent
          color="currentColor"
          size={120}
          variant="Bold"
          className={classNames(
            disabled
              ? 'text-white/20'
              : iconColorPackages[
                  item.type as keyof typeof iconColorPackages
                ] || 'text-white/20 dark:text-gray-400/20'
          )}
        />
      </div>
      <h6 className="font-bold text-white">{item.name}</h6>
      <div className="flex justify-between items-end gap-4 w-full z-10">
        <div className="flex flex-col">
          <span className="text-white/80 dark:text-gray-300">
            {
              categoryPackage.filter((option) => option.value === item.type)[0]
                ?.label
            }
            {item.type === PackageType.PT_PROGRAM &&
              ` (${item.session_duration} Ss)`}
          </span>
          {item.type === PackageType.PT_PROGRAM && (
            <span className="text-white/80 dark:text-gray-300 text-sm font-bold">
              With {item.trainers?.map((item) => item.name).join(', ')}
            </span>
          )}
          {item.type === PackageType.CLASS && (
            <span className="text-white/80 dark:text-gray-300 text-sm font-bold">
              {item.classes
                ?.map((item) => item.name)
                .slice(0, 2)
                .join(', ')}{' '}
              {item.classes?.length > 2 ? ', ect.' : ''}
            </span>
          )}
          <span
            className={classNames(
              'bg-white/90 dark:bg-gray-800/90 w-fit rounded-full px-2 text-sm font-bold capitalize mt-1',
              disabled
                ? 'text-gray-600'
                : textColorPackages[
                    item.type as keyof typeof textColorPackages
                  ] || 'text-gray-600 dark:text-gray-400'
            )}
          >
            {item.fduration}
          </span>
        </div>
        <div className="text-right leading-none">
          {item.is_promo === 1 && (
            <span className="text-white/60 line-through text-sm">
              {item.fprice}
            </span>
          )}
          <span className="font-bold text-white text-lg block -mt-0.5">
            {item.fsell_price}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default PackageCard
