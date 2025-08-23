import { ScrollArea } from '@/components/shared/scroll-area'
import { Avatar, Button, DatePicker, Dropdown, FormItem } from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import InputCurrency from '@/components/ui/InputCurrency'
import { currencyFormat } from '@/components/ui/InputCurrency/currencyFormat'
import SelectAsyncPaginate, {
  ReturnAsyncSelect,
} from '@/components/ui/Select/SelectAsync'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { EmployeeDetail } from '@/services/api/@types/employee'
import { RekeningDetail } from '@/services/api/@types/finance'
import { MemberDetail } from '@/services/api/@types/member'
import { CheckoutRequest, PaymentStatus } from '@/services/api/@types/sales'
import { apiGetEmployeeList } from '@/services/api/EmployeeService'
import { apiGetRekeningList } from '@/services/api/FinancialService'
import { apiGetMemberList } from '@/services/api/MembeService'
import { apiCreateCheckout } from '@/services/api/SalesService'
import { useSessionUser } from '@/store/authStore'
import classNames from '@/utils/classNames'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  ArrowDown2,
  Calendar,
  Location,
  SearchNormal1,
  Trash,
  Warning2,
} from 'iconsax-react'
import React, { Fragment } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import CheckoutItemPackageCard from '../components/CheckoutItemPackageCard'
import CheckoutItemProductCard from '../components/CheckoutItemProductCard'
import { generateCartData } from '../utils/generateCartData'
import { mergeDuplicateAmounts } from '../utils/mergeDuplicateAmounts'
import {
  ReturnTransactionFormSchema,
  ReturnTransactionItemFormSchema,
  ValidationTransactionSchema,
  defaultValueTransaction,
  resetTransactionForm,
} from '../utils/validation'

interface CartDetailProps {
  formPropsTransaction: ReturnTransactionFormSchema
  formPropsTransactionItem: ReturnTransactionItemFormSchema
  onBack: () => void
  setIndexItem: React.Dispatch<React.SetStateAction<number>>
  setOpenAddItem: React.Dispatch<React.SetStateAction<boolean>>
  setFormItemType: React.Dispatch<React.SetStateAction<'create' | 'update'>>
}

const CartDetail: React.FC<CartDetailProps> = ({
  formPropsTransaction,
  formPropsTransactionItem,
  onBack,
  setIndexItem,
  setOpenAddItem,
  setFormItemType,
}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const club = useSessionUser((state) => state.club)
  const [openDropdown, setOpenDropdown] = React.useState(false)
  const [confirmPartPaid, setConfirmPartPaid] = React.useState(false)

  const formPropsItem = formPropsTransactionItem
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = formPropsTransaction
  const watchTransaction = watch()

  const cartDataGenerated = generateCartData(watchTransaction)
  const loyalty_point = cartDataGenerated.items.reduce(
    (acc: any, cur: any) => acc + cur.loyalty_point,
    0
  )

  console.log('watch', {
    data: watch(),
    error: errors,
  })

  // const calculate = calculateDetailPayment({
  //   items: watchTransaction.items,
  //   discount_type: watchTransaction.discount_type,
  //   discount: watchTransaction.discount || 0,
  //   tax_rate: 0,
  // })

  // React.useEffect(() => {
  //   const totalPayment = watchTransaction.payments?.reduce(
  //     (acc: any, cur: any) => acc + cur.amount,
  //     0
  //   )
  //   formPropsTransaction.setValue(
  //     'balance_amount',
  //     calculate.totalAmount - totalPayment
  //   )
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [calculate.totalAmount])

  const getTotal =
    cartDataGenerated.total_amount -
    (cartDataGenerated.payments?.reduce(
      (acc: any, cur: any) => acc + cur.amount,
      0
    ) || 0)
  const isPaidOf =
    (cartDataGenerated.payments?.reduce(
      (acc: any, cur: any) => acc + cur.amount,
      0
    ) || 0) >= cartDataGenerated.total_amount

  const getMemberList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<MemberDetail, GroupBase<MemberDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetMemberList({
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

  const getEmployeeList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<EmployeeDetail, GroupBase<EmployeeDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetEmployeeList({
        page: additional?.page,
        per_page: 10,
        sort_column: 'id',
        sort_type: 'desc',
        show_all: true,
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
        ],
      })
      return new Promise<ReturnAsyncSelect>((resolve) => {
        resolve({
          options: response.data.data,
          hasMore: response.data.data.length > 0,
          additional: {
            page: additional!.page + 1,
          },
        })
      })
    },
    []
  )

  const handlePrefecth = (res?: any) => {
    const data = res?.data?.data
    console.log('data', data)
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.sales] })
    navigate('/sales')
    resetTransactionForm(formPropsTransaction)
    window.localStorage.setItem(
      'item_pos',
      JSON.stringify({ ...defaultValueTransaction, _timestamp: Date.now() })
    )
  }

  const createCheckout = useMutation({
    mutationFn: (data: CheckoutRequest) => apiCreateCheckout(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<
    ValidationTransactionSchema & { isPaid: PaymentStatus }
  > = (data) => {
    const body = {
      club_id: club?.id as number,
      member_id: data.member?.id,
      employee_id: data.employee?.id,
      is_paid: data.isPaid,
      discount_type: data.discount_type,
      discount: data.discount || 0,
      tax_rate: data.tax_rate || 0,
      due_date: dayjs(data.due_date).format('YYYY-MM-DD'),
      items:
        (data.items.map((item) => {
          const {
            package_type,
            loyalty_point,
            classes,
            instructors,
            trainers,
            name,
            sell_price,
            is_promo,
            data: itemData,
            ...rest
          } = item

          // Base payload dengan field yang selalu ada
          const basePayload = {
            item_type: item.item_type,
            quantity: item.quantity,
            price: item.price,
            discount_type: item.discount_type || 'nominal',
            discount: item.discount || 0,
          }

          // Spesifik payload berdasarkan item_type
          if (item.item_type === 'package') {
            return {
              ...basePayload,
              trainer_id: trainers?.id || null,
              package_id: item.package_id,
              extra_session: item.extra_session || 0,
              extra_day: item.extra_day || 0,
              start_date: item.start_date || null,
            }
          }

          if (item.item_type === 'product') {
            return {
              ...basePayload,
              product_id: item.product_id,
            }
          }

          // if (item.item_type === 'freeze') {
          //   return {
          //     ...basePayload,
          //     start_date: item.start_date || null,
          //     end_date: item.end_date || null,
          //   }
          // }

          return basePayload
        }) as CheckoutRequest['items']) || [],
      payments: data.payments,
      refund_from: (data.refund_from as CheckoutRequest['refund_from']) || [],
    }

    // console.log('body', body)

    createCheckout.mutate(body)
    setConfirmPartPaid(false)
  }

  const handleCheck: SubmitHandler<ValidationTransactionSchema> = () => {
    setConfirmPartPaid(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] items-start h-full">
        <div className="flex flex-col w-full">
          <div className="p-4 flex flex-col gap-3">
            {/* Bagian atas: Lokasi & Tanggal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              {/* Lokasi */}
              <div className="flex items-center gap-2 text-gray-800 font-medium dark:text-gray-200">
                <Location size="20" color="currentColor" variant="Outline" />
                <span className="font-semibold text-sm sm:text-base">
                  {club?.name}
                </span>
              </div>

              {/* Tanggal */}
              <FormItem
                label=""
                className="mb-0 w-full sm:w-auto"
                invalid={Boolean(errors.due_date)}
                errorMessage={errors.due_date?.message}
              >
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      inputFormat="DD-MM-YYYY"
                      placeholder="Start Date"
                      {...field}
                      size="sm"
                      className="w-full sm:w-auto"
                      inputPrefix={
                        <Calendar
                          size="20"
                          color="currentColor"
                          variant="Outline"
                        />
                      }
                      value={field.value ? dayjs(field.value).toDate() : null}
                    />
                  )}
                />
              </FormItem>
            </div>

            {/* Search Bar */}
            <div
              className="w-full bg-gray-100 rounded-md pl-4 pr-10 py-2.5 sm:py-3 text-gray-500 cursor-pointer relative hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 hover:dark:bg-gray-700 text-sm sm:text-base"
              onClick={onBack}
            >
              Cari item untuk di jual
              <SearchNormal1
                size="20"
                color="currentColor"
                variant="Outline"
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="flex flex-col gap-3 overflow-y-auto p-4">
              {cartDataGenerated.items?.map((item, index) => {
                return (
                  <Fragment key={index}>
                    {item.item_type === 'product' ? (
                      <CheckoutItemProductCard
                        item={item}
                        onClick={() => {
                          formPropsItem.reset(item)
                          setIndexItem(index)
                          setOpenAddItem(true)
                          setFormItemType('update')
                        }}
                      />
                    ) : (
                      <CheckoutItemPackageCard
                        item={item}
                        onClick={() => {
                          formPropsItem.reset(item)
                          setIndexItem(index)
                          setOpenAddItem(true)
                          setFormItemType('update')
                        }}
                      />
                    )}
                  </Fragment>
                )
              })}

              <div className="flex justify-end mt-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
                    Invoice Summary
                  </h3>

                  {/* Subtotal & Tax */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Sub total
                      </span>
                      <span className="font-medium">
                        {cartDataGenerated.fsubtotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary cursor-pointer hover:underline">
                        Add discount
                      </span>
                      <span className="text-sm text-gray-500">-</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tax
                      </span>
                      <span className="font-medium">
                        {cartDataGenerated.ftotal_tax}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{cartDataGenerated.ftotal_amount}</span>
                    </div>
                    <div className="flex justify-between text-sm italic text-gray-600 dark:text-gray-400 mt-1">
                      <span>Potential to earn points</span>
                      <span>+{loyalty_point} Pts</span>
                    </div>

                    {/* Remaining Payment */}
                    {cartDataGenerated.balance_amount > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between font-semibold text-red-600 dark:text-red-400">
                          <span>Remaining payment</span>
                          <span>{cartDataGenerated.fbalance_amount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
        <div className="border-l border-gray-200 dark:border-gray-700 h-full flex flex-col">
          <ScrollArea className="h-[calc(100vh-490px)] flex flex-col gap-3 overflow-y-auto p-4 flex-1">
            <FormItem
              asterisk={watchTransaction.items?.some(
                (item) => item.item_type === 'package'
              )}
              label={`Member ${
                watchTransaction.items?.some(
                  (item) => item.item_type === 'package'
                )
                  ? ''
                  : '(Optional)'
              }`}
              invalid={Boolean(errors.member)}
              errorMessage={'Member is required when a package is included.'}
              labelClass="w-full flex justify-between items-center"
            >
              <Controller
                name="member"
                control={control}
                render={({ field }) => (
                  <SelectAsyncPaginate
                    isClearable
                    loadOptions={getMemberList as any}
                    additional={{ page: 1 }}
                    placeholder="Select member"
                    value={field.value}
                    cacheUniqs={[watchTransaction.member]}
                    getOptionLabel={(option) => option.name!}
                    getOptionValue={(option) => `${option.id}`}
                    debounceTimeout={500}
                    formatOptionLabel={({ name, photo }) => {
                      return (
                        <div className="flex justify-start items-center gap-2">
                          <Avatar
                            size="sm"
                            {...(photo && { src: photo || '' })}
                            {...(!photo && { icon: <HiOutlineUser /> })}
                          />
                          <span className="text-sm">{name}</span>
                        </div>
                      )
                    }}
                    onChange={(option) => field.onChange(option)}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label="Sales (Optional)"
              invalid={Boolean(errors.employee)}
              errorMessage={errors.employee?.message}
              labelClass="w-full flex justify-between items-center"
            >
              <Controller
                name="employee"
                control={control}
                render={({ field }) => (
                  <SelectAsyncPaginate
                    isClearable
                    loadOptions={getEmployeeList as any}
                    additional={{ page: 1 }}
                    placeholder="Select Employee"
                    value={field.value as any}
                    cacheUniqs={[watchTransaction.employee]}
                    getOptionLabel={(option: any) => option.name || ''}
                    getOptionValue={(option: any) =>
                      option.id?.toString() || ''
                    }
                    debounceTimeout={500}
                    formatOptionLabel={(option: any) => {
                      const { name, photo } = option
                      return (
                        <div className="flex justify-start items-center gap-2">
                          <Avatar
                            size="sm"
                            {...(photo && { src: photo || '' })}
                            {...(!photo && { icon: <HiOutlineUser /> })}
                          />
                          <span className="text-sm">{name}</span>
                        </div>
                      )
                    }}
                    onChange={(option) => field.onChange(option)}
                  />
                )}
              />
            </FormItem>
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
                  // Sinkronkan nilai field dengan cartDataGenerated saat pertama kali render
                  React.useEffect(() => {
                    if (field.value !== cartDataGenerated.balance_amount) {
                      field.onChange(cartDataGenerated.balance_amount)
                    }
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                  }, [cartDataGenerated.balance_amount])
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
                    cacheUniqs={[watchTransaction.payments]}
                    getOptionLabel={(option) => option.name!}
                    getOptionValue={(option) => option.id?.toString()}
                    debounceTimeout={500}
                    isDisabled={isPaidOf}
                    isOptionDisabled={(option) =>
                      (option.name !== 'Cash' && isPaidOf) ||
                      watchTransaction.balance_amount < 0
                    }
                    onChange={(val, ctx) => {
                      if (ctx.action === 'clear') {
                        field.onChange([])
                        formPropsTransaction.setValue(
                          'balance_amount',
                          cartDataGenerated.total_amount
                        )
                        formPropsTransaction.setError('payments', {
                          type: 'custom',
                          message: 'Payment method is required',
                        })
                      } else if (ctx.action === 'remove-value') {
                        field.onChange(val)
                        const getRemoveTotal =
                          Number(watch('balance_amount')) +
                          Number(
                            val.reduce(
                              (acc: any, cur: any) => acc + cur.amount,
                              0
                            )
                          )
                        formPropsTransaction.setValue(
                          'balance_amount',
                          val.length <= 0
                            ? cartDataGenerated.total_amount
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

                        formPropsTransaction.setValue(
                          'balance_amount',
                          cartDataGenerated.total_amount -
                            Number(watch('balance_amount'))
                        )

                        formPropsTransaction.clearErrors('payments')
                      }
                    }}
                  />
                )}
              />
            </FormItem>
          </ScrollArea>
          <div className="flex flex-col gap-2.5 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            {/* Payment Details */}
            {cartDataGenerated.payments &&
              cartDataGenerated.payments.length > 0 && (
                <div className="space-y-2">
                  {cartDataGenerated.payments.map(
                    (item: any, index: number) => (
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
                              formPropsTransaction.setValue('payments', [
                                ...watch('payments').filter(
                                  (val: any) => val.id !== item.id
                                ),
                              ])
                              const getRemoveTotal =
                                Number(watch('balance_amount')) +
                                Number(item.amount)
                              formPropsTransaction.setValue(
                                'balance_amount',
                                getRemoveTotal <= 0 ? 0 : getRemoveTotal
                              )
                            }}
                          >
                            <Trash color="currentColor" size="14" />
                          </span>
                        </div>
                      </div>
                    )
                  )}
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
                loading={createCheckout.isPending}
                disabled={getTotal > 0}
                onClick={handleSubmit((data) =>
                  onSubmit({ ...data, isPaid: 1 })
                )}
              >
                Pay now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertConfirm
        open={confirmPartPaid}
        title="Save as Part Paid"
        description="Are you sure want to save this payment as part paid?"
        rightTitle="Save without active package"
        leftTitle="Save with active package"
        type="delete"
        className="w-auto"
        icon={
          <div className="bg-red-100 p-2 rounded-full mb-2">
            <Warning2 size="70" color="#FF8A65" variant="Bulk" />
          </div>
        }
        onRequestClose={() => setConfirmPartPaid(false)}
        onRightClick={handleSubmit((data) => {
          onSubmit({ ...data, isPaid: 2 })
        })}
        onLeftClick={handleSubmit((data) => {
          onSubmit({ ...data, isPaid: 3 })
        })}
      />
    </>
  )
}

export default CartDetail
