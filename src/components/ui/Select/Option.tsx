import classNames from 'classnames'
import { HiCheck } from 'react-icons/hi'
import type { ReactNode } from 'react'
import type {
  GroupBase,
  OptionProps as ReactSelectOptionProps,
} from 'react-select'

type DefaultOptionProps<T> = {
  customLabel?: (data: T, label: string) => ReactNode
}

const Option = <T,>(
  props: ReactSelectOptionProps<T> & DefaultOptionProps<T>
) => {
  const {
    innerProps,
    label,
    isSelected,
    isFocused,
    isDisabled,
    data,
    customLabel,
    selectProps: { formatOptionLabel, formatGroupLabel },
  } = props

  const isGroup = (item: unknown): item is GroupBase<T> =>
    !!(item && typeof item === 'object' && 'options' in item)

  return (
    <div
      className={classNames(
        'select-option',
        !isDisabled && 'cursor-pointer',
        isFocused && 'bg-gray-100 dark:bg-gray-700',
        isSelected && 'text-primary bg-primary-subtle',
        !isDisabled &&
          !isSelected &&
          'hover:text-gray-800 hover:dark:text-gray-100'
      )}
      {...innerProps}
    >
      {isGroup(data) && formatGroupLabel ? (
        formatGroupLabel(data)
      ) : formatOptionLabel ? (
        formatOptionLabel(data, {
          context: 'menu',
          inputValue: '',
          selectValue: [],
        })
      ) : customLabel ? (
        customLabel(data, label)
      ) : (
        <span className="ml-2">{label}</span>
      )}
      {isSelected && <HiCheck className="text-xl" />}
    </div>
  )
}

export default Option
