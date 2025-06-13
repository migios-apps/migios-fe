import { Input, InputProps } from '@/components/ui'
import { forwardRef } from 'react'
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field'

export type CombinedCurrencyInputProps = Omit<CurrencyInputProps, 'size'> &
  Omit<InputProps, 'onChange'>

const InputCurrency = forwardRef<HTMLInputElement, CombinedCurrencyInputProps>(
  (props, ref) => {
    return (
      <CurrencyInput
        ref={ref}
        prefix={`Rp. `}
        step={2}
        groupSeparator="."
        decimalSeparator=","
        customInput={Input}
        size={props.size as any}
        onValueChange={(value, name, values) =>
          props.onValueChange?.(value, name, values)
        }
        {...props}
      />
    )
  }
)

InputCurrency.displayName = 'InputCurrency'

export default InputCurrency
