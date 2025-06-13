import { Avatar, Button, Drawer, Dropdown, FormItem } from '@/components/ui'
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
import {
  CheckoutRequest,
  PaymentStatus,
} from '@/services/api/@types/transaction'
import { apiGetEmployeeList } from '@/services/api/EmployeeService'
import { apiGetRekeningList } from '@/services/api/FinancialService'
import { apiGetMemberList } from '@/services/api/MembeService'
import { apiCreateCheckout } from '@/services/api/TransactionService'
import { useSessionUser } from '@/store/authStore'
import classNames from '@/utils/classNames'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowDown2, Trash, Warning2 } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import { calculateDetailPayment } from '../utils/calculateDetailPayment'
import { mergeDuplicateAmounts } from '../utils/mergeDuplicateAmounts'
import {
  ReturnTransactionFormSchema,
  ValidationTransactionSchema,
  defaultValueTransaction,
  resetTransactionForm,
} from '../validation'

type FormProps = {
  open: boolean
  formProps: ReturnTransactionFormSchema
  onClose: () => void
}

const FormAddPayment: React.FC<FormProps> = ({ open, formProps, onClose }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const club = useSessionUser((state) => state.club)
  const [openDropdown, setOpenDropdown] = React.useState(false)
  const [confirmPartPaid, setConfirmPartPaid] = React.useState(false)
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = formProps
  const watchTransaction = watch()
  const handleClose = () => {
    onClose()
  }

  // console.log('watchTransaction', watchTransaction)
  // console.log('errors', errors)

  const calculate = calculateDetailPayment({
    items: watchTransaction.items,
    discount_type: watchTransaction.discount_type,
    discount: watchTransaction.discount || 0,
    tax_rate: 0,
  })

  React.useEffect(() => {
    if (open) {
      const totalPayment = watchTransaction.payments?.reduce(
        (acc: any, cur: any) => acc + cur.amount,
        0
      )
      formProps.setValue('balance_amount', calculate.totalAmount - totalPayment)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const getTotal =
    calculate.totalAmount -
    watch('payments')?.reduce((acc: any, cur: any) => acc + cur.amount, 0)
  const isPaidOf =
    watch('payments')?.reduce((acc: any, cur: any) => acc + cur.amount, 0) >=
    calculate.totalAmount

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

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.sales] })
    handleClose()
    navigate('/sales')
    resetTransactionForm(formProps)
    window.localStorage.setItem(
      'migios_pos',
      JSON.stringify({ ...defaultValueTransaction, _timestamp: Date.now() })
    )
  }

  // Mutations
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
      due_date: dayjs().format('YYYY-MM-DD'),
      items:
        (data.items.map((item) => {
          const {
            package_type,
            loyalty_point,
            classes,
            instructors,
            trainers,
            ...rest
          } = item
          return rest
        }) as CheckoutRequest['items']) || [],
      payments: data.payments,
      refund_from: (data.refund_from as CheckoutRequest['refund_from']) || [],
    }

    createCheckout.mutate(body)
    setConfirmPartPaid(false)
  }

  const handleCheck: SubmitHandler<ValidationTransactionSchema> = () => {
    setConfirmPartPaid(true)
  }

  return (
    <>
      <Drawer
        title="Payment"
        // width={620}
        isOpen={open}
        bodyClass="p-3 md:p-4"
        drawerContentClassName="!w-full md:!w-[420px]"
        // placement="bottom"
        onClose={handleClose}
        onRequestClose={handleClose}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="w-full flex flex-col mb-4">
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
                    //   isLoading={isLoading}
                    loadOptions={getMemberList as any}
                    additional={{ page: 1 }}
                    placeholder="Select member"
                    value={field.value}
                    cacheUniqs={[watchTransaction.member]}
                    getOptionLabel={(option) => option.name!}
                    getOptionValue={(option) => option.id?.toString()}
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
                    // isMulti
                    // isLoading={isLoading}
                    loadOptions={getEmployeeList as any}
                    additional={{ page: 1 }}
                    placeholder="Select Employee"
                    value={field.value}
                    cacheUniqs={[watchTransaction.employee]}
                    getOptionLabel={(option) => option.name!}
                    getOptionValue={(option) => option.id?.toString()}
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
              asterisk
              label="Payment"
              invalid={Boolean(errors.balance_amount)}
              errorMessage={errors.balance_amount?.message}
            >
              <Controller
                name="balance_amount"
                control={control}
                render={({ field }) => (
                  <InputCurrency
                    value={field.value}
                    disabled={isPaidOf}
                    className="h-[80px] text-2xl text-center font-bold bg-primary-subtle text-primary focus:bg-primary-subtle"
                    onValueChange={(value, name, values) => {
                      field.onChange(values?.float)
                    }}
                  />
                )}
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
                    //   isLoading={isLoading}
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
                        formProps.setValue(
                          'balance_amount',
                          calculate.totalAmount
                        )
                        formProps.setError('payments', {
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
                        formProps.setValue(
                          'balance_amount',
                          val.length <= 0
                            ? calculate.totalAmount
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

                        formProps.setValue(
                          'balance_amount',
                          getTotal - Number(watch('balance_amount'))
                        )

                        formProps.clearErrors('payments')
                      }
                    }}
                  />
                )}
              />
            </FormItem>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full flex flex-col mb-4">
              <div className="w-full flex justify-between items-center gap-1">
                <span className="text-base font-bold">Remaining payment</span>
                <span className="text-base font-bold">
                  {currencyFormat(getTotal)}
                </span>
              </div>
              {watchTransaction.payments?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="w-full flex justify-between items-center gap-1"
                >
                  <span className="text-base font-bold">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">
                      {currencyFormat(item.amount)}
                    </span>
                    <span
                      className="cursor-pointer text-red-500 rounded-full"
                      onClick={() => {
                        formProps.setValue('payments', [
                          ...watch('payments').filter(
                            (val: any) => val.id !== item.id
                          ),
                        ])

                        const getRemoveTotal =
                          Number(watch('balance_amount')) + Number(item.amount)
                        formProps.setValue(
                          'balance_amount',
                          getRemoveTotal <= 0 ? 0 : getRemoveTotal
                        )
                      }}
                    >
                      <Trash color="currentColor" size="15" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
      </Drawer>

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
        // loading={deleteItem.isPending}
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

export default FormAddPayment
