import { formatValue } from 'react-currency-input-field'

export const currencyFormat = (value: number | string) => {
  // const currencyValue = parseFloat(value.toString()) as number
  // const number = new Intl.NumberFormat("id-ID", options || initalOptions)
  // return number.format(currencyValue)
  const formattedValue1 = formatValue({
    value: `${value}`,
    decimalSeparator: ',',
    groupSeparator: '.',
    prefix: `Rp. `,
    // decimalScale: 0,
    // ...(config?.dec_digit && { decimalScale: Number(config?.dec_digit) }),
  })
  return formattedValue1
}
