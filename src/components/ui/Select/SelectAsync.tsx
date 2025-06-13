import type { JSX, Ref } from 'react'
import { HiChevronDown, HiX } from 'react-icons/hi'
import type { ClassNamesConfig, GroupBase, StylesConfig } from 'react-select'
import { AsyncPaginate, AsyncPaginateProps } from 'react-select-async-paginate'
import type { CommonProps, TypeAttributes } from '../@types/common'
import { useConfig } from '../ConfigProvider'
import { useForm, useFormItem } from '../Form/context'
import { useInputGroup } from '../InputGroup/context'
import Spinner from '../Spinner/Spinner'
import cn from '../utils/classNames'
import { CONTROL_SIZES } from '../utils/constants'
import DefaultOption from './Option'

const DefaultDropdownIndicator = () => {
  return (
    <div className="select-dropdown-indicator">
      <HiChevronDown />
    </div>
  )
}

interface DefaultClearIndicatorProps {
  innerProps: JSX.IntrinsicElements['div']
  ref: Ref<HTMLElement>
}

const DefaultClearIndicator = ({
  innerProps: { ref, ...restInnerProps },
}: DefaultClearIndicatorProps) => {
  return (
    <div {...restInnerProps} ref={ref}>
      <div className="select-clear-indicator">
        <HiX />
      </div>
    </div>
  )
}

export type ReturnAsyncSelect = {
  options: unknown[]
  hasMore: boolean
  additional: {
    page: number
  }
}

interface DefaultLoadingIndicatorProps {
  selectProps: { themeColor?: string }
}

const DefaultLoadingIndicator = ({
  selectProps,
}: DefaultLoadingIndicatorProps) => {
  const { themeColor } = selectProps
  return <Spinner className={`select-loading-indicatior text-${themeColor}`} />
}

interface CustomSelectAsyncPaginateProps<
  Option,
  Group extends GroupBase<Option>,
  Additional,
  IsMulti extends boolean,
> extends AsyncPaginateProps<Option, Group, Additional, IsMulti> {
  errorMessage?: string | null
  label?: string
  helperText?: string | null
}

export interface SelectAsyncPaginateProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
  Additional = unknown,
> extends CommonProps,
    CustomSelectAsyncPaginateProps<Option, Group, Additional, IsMulti> {
  invalid?: boolean
  size?: TypeAttributes.ControlSize
  field?: any
  componentAs?: typeof AsyncPaginate
}

function SelectAsyncPaginate<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
  Additional = unknown,
>(props: SelectAsyncPaginateProps<Option, IsMulti, Group, Additional>) {
  const {
    components,
    componentAs: Component = AsyncPaginate,
    size,
    styles,
    className,
    classNames,
    field,
    invalid,
    ...rest
  } = props

  const { controlSize } = useConfig()
  const formControlSize = useForm()?.size
  const formItemInvalid = useFormItem()?.invalid
  const inputGroupSize = useInputGroup()?.size

  const selectSize = (size ||
    inputGroupSize ||
    formControlSize ||
    controlSize) as keyof typeof CONTROL_SIZES

  const isSelectInvalid = invalid || formItemInvalid

  const selectClass = cn(`select select-${selectSize}`, className)

  return (
    <Component<Option, Group, Additional>
      className={selectClass}
      classNames={
        {
          control: (state) =>
            cn(
              'select-control',
              CONTROL_SIZES[selectSize].minH,
              state.isDisabled && 'opacity-50 cursor-not-allowed',
              (() => {
                const classes: string[] = ['bg-gray-100 dark:bg-gray-700']

                const { isFocused } = state

                if (isFocused) {
                  classes.push(
                    'select-control-focused ring-1 ring-primary border-primary bg-transparent'
                  )
                }

                if (isSelectInvalid) {
                  classes.push('select-control-invalid bg-error-subtle')
                }

                if (isFocused && isSelectInvalid) {
                  classes.push('ring-error border-error')
                }

                return classes
              })()
            ),
          valueContainer: ({ isMulti, hasValue, selectProps }) =>
            cn(
              'select-value-container',
              isMulti && hasValue && selectProps.controlShouldRenderValue
                ? 'flex'
                : 'grid'
            ),
          input: ({ value, isDisabled }) =>
            cn(
              'select-input-container',
              isDisabled ? 'invisible' : 'visible',
              value && '[transform:translateZ(0)]'
            ),
          placeholder: () =>
            cn(
              'select-placeholder',
              isSelectInvalid ? 'text-error' : 'text-gray-400'
            ),
          indicatorsContainer: () => 'select-indicators-container',
          singleValue: () => 'select-single-value',
          multiValue: () => 'select-multi-value',
          multiValueLabel: () => 'select-multi-value-label',
          multiValueRemove: () => 'select-multi-value-remove',
          menu: () => 'select-menu',
          ...classNames,
        } as ClassNamesConfig<Option, IsMulti, Group>
      }
      classNamePrefix={'select'}
      styles={
        {
          control: () => ({}),
          valueContainer: () => ({}),
          input: ({ margin, paddingTop, paddingBottom, ...provided }) => ({
            ...provided,
          }),
          placeholder: () => ({}),
          singleValue: () => ({}),
          multiValue: () => ({}),
          multiValueLabel: () => ({}),
          multiValueRemove: () => ({}),
          menu: ({
            backgroundColor,
            marginTop,
            marginBottom,
            border,
            borderRadius,
            boxShadow,
            ...provided
          }) => ({ ...provided, zIndex: 50 }),
          ...styles,
        } as StylesConfig<Option, IsMulti, Group>
      }
      components={{
        IndicatorSeparator: () => null,
        Option: DefaultOption,
        LoadingIndicator: DefaultLoadingIndicator,
        DropdownIndicator: DefaultDropdownIndicator,
        ClearIndicator: DefaultClearIndicator,
        ...components,
      }}
      {...field}
      {...rest}
    />
  )
}

export default SelectAsyncPaginate
