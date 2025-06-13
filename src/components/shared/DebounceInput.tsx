import type { InputProps } from '@/components/ui/Input'
import Input from '@/components/ui/Input'
import useDebounce from '@/utils/hooks/useDebounce'
import type { ChangeEvent } from 'react'
import { forwardRef } from 'react'

type DebounceInputProps = InputProps & {
  wait?: number
  handleOnchange?: (value: string) => void
}

const DebounceInput = forwardRef<HTMLInputElement, DebounceInputProps>(
  (props, ref) => {
    const { wait = 500, handleOnchange, ...rest } = props

    const handleInputChange = (val: string) => {
      if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
        handleOnchange?.(val)
      }
    }

    function handleDebounceFn(value: ChangeEvent<HTMLInputElement>) {
      props.onChange?.(value)
      handleInputChange(value.target.value)
    }

    const debounceFn = useDebounce(handleDebounceFn, wait)

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      debounceFn(e)
    }

    return <Input ref={ref} {...rest} type="search" onChange={onInputChange} />
  }
)

DebounceInput.displayName = 'DebounceInput'

export default DebounceInput
