import classNames from '@/utils/classNames'
import { ArrowDown2, SearchNormal1 } from 'iconsax-react'
import React, { JSX } from 'react'
import * as RPNInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import type { StylesConfig } from 'react-select'
import { components } from 'react-select'
import Button from '../Button'
import Input, { InputProps } from '../Input/Input'
import Select from '../Select'

export type PhoneInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value' | 'ref'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void
    defaultCountry?: RPNInput.Country
  }

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, defaultCountry = 'ID', ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={classNames('flex', className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          international={false}
          defaultCountry={defaultCountry}
          onChange={(value) => onChange?.(value || ('' as RPNInput.Value))}
          {...props}
        />
      )
    }
  )
PhoneInput.displayName = 'PhoneInput'

export default PhoneInput

const InputComponent = ({ className, ...props }: InputProps) => {
  const { size, ref, ...restProps } = props
  return (
    <Input
      {...restProps}
      ref={ref}
      className={classNames('rounded-e-lg rounded-s-none', className)}
    />
  )
}
InputComponent.displayName = 'InputComponent'

type CountryEntry = { label: string; value: RPNInput.Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  value: RPNInput.Country
  options: CountryEntry[]
  onChange: (country: RPNInput.Country) => void
}

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const listCountry = countryList.filter(
    (option) => option.label?.toLowerCase() !== 'international'
  )
  return (
    <Dropdown
      isOpen={isOpen}
      target={
        <Button
          className="px-2 rounded-tr-none rounded-br-none"
          type="button"
          icon={<ArrowDown2 color="currentColor" size="16" />}
          iconAlignment="end"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <FlagComponent
                country={selectedCountry}
                countryName={
                  listCountry.find((option) => option.value === selectedCountry)
                    ?.label || ''
                }
              />
              <span className="text-sm text-foreground/50">
                {`+${selectedCountry ? RPNInput.getCountryCallingCode(selectedCountry) : ''}`}
              </span>
            </div>
          ) : null}
        </Button>
      }
      onClose={() => setIsOpen(false)}
    >
      <Select
        autoFocus
        menuIsOpen
        isDisabled={disabled}
        backspaceRemovesValue={false}
        components={{
          DropdownIndicator: () => (
            <SearchNormal1 color="currentColor" size="24" />
          ),
          IndicatorSeparator: null,
          Option: (props) => {
            const { isSelected, isFocused, isDisabled, data } = props
            return (
              <components.Option
                {...props}
                className={classNames(
                  'select-option',
                  !isDisabled && 'cursor-pointer',
                  isFocused && '!bg-gray-100 dark:!bg-gray-700',
                  isSelected && '!text-primary !bg-primary-subtle',
                  !isDisabled &&
                    !isSelected &&
                    'hover:text-gray-800 hover:dark:text-gray-100'
                )}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <FlagComponent
                    country={data.value}
                    countryName={data.label}
                  />
                  <span className="flex-1 text-sm">{data.label}</span>
                  <span className="text-sm text-foreground/50">{`+${data?.value ? RPNInput.getCountryCallingCode(data?.value) : ''}`}</span>
                </div>
              </components.Option>
            )
          },
        }}
        tabIndex={-1}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        isClearable={false}
        options={listCountry}
        placeholder="Search..."
        styles={selectStyles}
        tabSelectsValue={false}
        value={listCountry.find((option) => option.value === selectedCountry)}
        onChange={(newValue) => {
          onChange(newValue.value)
          setIsOpen(false)
        }}
      />
    </Dropdown>
  )
}

const selectStyles: StylesConfig<any, false> = {
  control: (provided) => ({
    ...provided,
    minWidth: 240,
    margin: 8,
    borderRadius: 10,
  }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
}

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

const Menu = (props: JSX.IntrinsicElements['div']) => (
  <div className="select-menu absolute z-[2]" {...props} />
)
const Blanket = (props: JSX.IntrinsicElements['div']) => (
  <div
    style={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1,
    }}
    {...props}
  />
)
const Dropdown = ({
  children,
  isOpen,
  target,
  onClose,
}: {
  children?: React.ReactNode
  readonly isOpen: boolean
  readonly target: React.ReactNode
  readonly onClose: () => void
}) => (
  <div style={{ position: 'relative' }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
)
