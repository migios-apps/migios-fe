import { ScrollArea } from '@/components/shared/scroll-area'
import { Button, Dropdown, FormItem, InputCurrency } from '@/components/ui'
import { currencyFormat } from '@/components/ui/InputCurrency/currencyFormat'
import { SelectAsyncPaginate } from '@/components/ui/Select'
import { ReturnAsyncSelect } from '@/components/ui/Select/SelectAsync'
import { RekeningDetail } from '@/services/api/@types/finance'
import { apiGetRekeningList } from '@/services/api/FinancialService'
import classNames from '@/utils/classNames'
import { ArrowDown2, Trash } from 'iconsax-react'
import React from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { GroupBase, OptionsOrGroups } from 'react-select'
import { mergeDuplicateAmounts } from '../utils/mergeDuplicateAmounts'
import { usePaymentForm } from './validation'

interface PaymentSectionProps {
  detail: any
  onSubmit: (data: any) => void
  isPending: boolean
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  detail,
  onSubmit,
  isPending,
}) => {
  const [openDropdown, setOpenDropdown] = React.useState(false)
  const [confirmPartPaid, setConfirmPartPaid] = React.useState(false)

  // Menggunakan form validasi payment
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = usePaymentForm()

  // Inisialisasi form dengan data dari API saat detail berubah
  React.useEffect(() => {
    if (detail) {
      setValue('balance_amount', detail.ballance_amount || 0)
      // Konversi payments ke format yang sesuai dengan skema validasi
      const formattedPayments = detail.payments
        ? detail.payments.map((payment: any) => ({
            id: payment.id,
            name: payment.rekening_name || '',
            amount: payment.amount || 0,
          }))
        : []
      setValue('payments', formattedPayments)
      setValue('isPaid', detail.is_paid || 0)
    }
  }, [detail, setValue])

  const getTotal = detail
    ? (detail.total_amount || 0) -
      (detail.payments?.reduce((acc: any, cur: any) => acc + cur.amount, 0) ||
        0)
    : 0
  const isPaidOf = detail
    ? (detail.payments?.reduce((acc: any, cur: any) => acc + cur.amount, 0) ||
        0) >= (detail.total_amount || 0)
    : false

  // Handler untuk check part paid
  const handleCheck = (data: any) => {
    setConfirmPartPaid(true)
    onSubmit({ ...data, isPaid: 2 })
  }

  // Watch untuk payments
  const watchPayments = useWatch({
    control,
    name: 'payments',
  })

  const getRekeningList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<RekeningDetail, GroupBase<RekeningDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetRekeningList({
        page: additional?.page,
        per_page: 10,
        sort_column: 'id',
        sort_type: 'desc',
        search: [
          (inputValue || '').length > 0
            ? ({
                search_column: 'name',
                search_condition: 'like',
                search_text: `${inputValue}`,
              } as any)
            : null,
          {
            search_operator: 'and',
            search_column: 'enabled',
            search_condition: '=',
            search_text: 'true',
          },
          {
            search_operator: 'and',
            search_column: 'show_in_payment',
            search_condition: '=',
            search_text: 1,
          },
          {
            search_operator: 'or',
            search_column: 'show_in_payment',
            search_condition: '=',
            search_text: 2,
          },
        ],
      })
      return new Promise<ReturnAsyncSelect>((resolve) => {
        resolve({
          options: response.data.data,
          hasMore: response.data.data.length >= 1,
          additional: {
            page: additional!.page + 1,
          },
        })
      })
    },
    []
  )

  return (
    <div className="border-l border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <ScrollArea className="h-[calc(100vh-490px)] flex flex-col gap-3 overflow-y-auto p-4 flex-1">
        <FormItem
          asterisk
          label="Payment"
          invalid={Boolean(errors.balance_amount)}
          errorMessage={errors.balance_amount?.message}
        >
          <Controller
            name="balance_amount"
            control={control}
            render={({ field }) => {
              React.useEffect(() => {
                if (field.value !== detail?.ballance_amount) {
                  field.onChange(detail?.ballance_amount)
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
              }, [detail?.ballance_amount])
              return (
                <InputCurrency
                  value={field.value}
                  disabled={isPaidOf}
                  className="h-[80px] text-2xl text-center font-bold bg-primary-subtle text-primary focus:bg-primary-subtle"
                  onValueChange={(value, name, values) => {
                    field.onChange(values?.float)
                  }}
                />
              )
            }}
          />
        </FormItem>
        <FormItem
          asterisk
          label="Payment Method"
          invalid={Boolean(errors.payments)}
          errorMessage={errors.payments?.message}
          labelClass="w-full flex justify-between items-center"
        >
          <Controller
            name="payments"
            control={control}
            render={({ field }) => (
              <SelectAsyncPaginate
                isClearable
                isMulti
                loadOptions={getRekeningList as any}
                additional={{ page: 1 }}
                placeholder="Select Payment"
                value={field.value}
                cacheUniqs={[watchPayments]}
                getOptionLabel={(option) => option.name!}
                getOptionValue={(option) => option.id?.toString()}
                debounceTimeout={500}
                isDisabled={isPaidOf}
                isOptionDisabled={(option) =>
                  (option.name !== 'Cash' && isPaidOf) ||
                  watch('balance_amount') < 0
                }
                onChange={(val, ctx) => {
                  if (ctx.action === 'clear') {
                    field.onChange([])
                    setValue(
                      'balance_amount',
                      detail ? detail.total_amount || 0 : 0
                    )
                    setError('payments', {
                      type: 'custom',
                      message: 'Metode pembayaran diperlukan',
                    })
                  } else if (ctx.action === 'remove-value') {
                    field.onChange(val)
                    const getRemoveTotal =
                      Number(watch('balance_amount')) +
                      Number(
                        val.reduce((acc: any, cur: any) => acc + cur.amount, 0)
                      )
                    setValue(
                      'balance_amount',
                      val.length <= 0
                        ? detail
                          ? detail.total_amount || 0
                          : 0
                        : getRemoveTotal
                    )
                  } else if (ctx.action === 'select-option') {
                    const idsToRemove = new Set(
                      watch('payments').map((obj) => obj.id)
                    )
                    const merege = mergeDuplicateAmounts([
                      ...watch('payments'),
                      ...val
                        .filter((obj: any) => !idsToRemove.has(obj.id))
                        .map((item: any) => ({
                          id: item.id,
                          name: item.name,
                          amount: Number(watch('balance_amount')),
                        })),
                    ])
                    field.onChange(merege)

                    setValue(
                      'balance_amount',
                      detail
                        ? detail.total_amount || 0
                        : 0 - Number(watch('balance_amount'))
                    )

                    clearErrors('payments')
                  }
                }}
              />
            )}
          />
        </FormItem>
      </ScrollArea>
      <div className="flex flex-col gap-2.5 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        {/* Payment Details */}
        {detail?.payments && detail?.payments.length > 0 && (
          <div className="space-y-2">
            {detail?.payments.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400 font-semibold">
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {currencyFormat(item.amount)}
                  </span>
                  <span
                    className="cursor-pointer text-red-500 hover:text-red-700 p-1"
                    onClick={() => {
                      setValue('payments', [
                        ...watch('payments').filter(
                          (val: any) => val.id !== item.id
                        ),
                      ])
                      const getRemoveTotal =
                        Number(watch('balance_amount')) + Number(item.amount)
                      setValue(
                        'balance_amount',
                        getRemoveTotal <= 0 ? 0 : getRemoveTotal
                      )
                    }}
                  >
                    <Trash color="currentColor" size="14" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="w-full flex flex-col md:flex-row md:justify-between items-start gap-2">
          <Dropdown
            toggleClassName="w-full md:w-5/12"
            renderTitle={
              <Button
                className={classNames('rounded-full w-full', {
                  'text-primary border-primary': openDropdown,
                })}
                variant="default"
                icon={
                  <ArrowDown2
                    color="currentColor"
                    size={16}
                    className={classNames(
                      'ml-1 transition-transform duration-300',
                      {
                        'rotate-180': openDropdown,
                      }
                    )}
                  />
                }
                iconAlignment="end"
              >
                Other
              </Button>
            }
            onOpen={setOpenDropdown}
          >
            {watch('payments')?.length > 0 && !isPaidOf ? (
              <Dropdown.Item
                eventKey="part_paid"
                onClick={handleSubmit(handleCheck)}
              >
                Save as Part Paid
              </Dropdown.Item>
            ) : null}
            <Dropdown.Item
              eventKey="unpaid"
              onClick={handleSubmit((data) => {
                onSubmit({ ...data, isPaid: 0, payments: [] })
              })}
            >
              Save as Unpaid
            </Dropdown.Item>
          </Dropdown>
          <Button
            className="rounded-full w-full"
            variant="solid"
            loading={isPending}
            disabled={getTotal > 0}
            onClick={handleSubmit((data) => onSubmit({ ...data, isPaid: 1 }))}
          >
            Update Pesanan
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSection
