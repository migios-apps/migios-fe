import Logo from '@/components/template/Logo'
import {
  Avatar,
  Button,
  DatePicker,
  Drawer,
  FormItem,
  Input,
  InputCurrency,
} from '@/components/ui'
import { SelectAsyncPaginate } from '@/components/ui/Select'
import { ReturnAsyncSelect } from '@/components/ui/Select/SelectAsync'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { useMember } from '@/pages/members/store/useMember'
import { RekeningDetail } from '@/services/api/@types/finance'
import { CheckoutRequest } from '@/services/api/@types/transaction'
import { apiGetRekeningList } from '@/services/api/FinancialService'
import { apiCreateCheckout } from '@/services/api/TransactionService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import {
  ReturnTransactionFreezeFormSchema,
  ValidationTransactionFreezeSchema,
  resetTransactionFreezeForm,
} from './freezeValidation'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnTransactionFreezeFormSchema
  onClose: () => void
}

const FormFreeze: React.FC<FormProps> = ({
  open,
  type,
  formProps,
  onClose,
}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { member } = useMember()
  const club = useSessionUser((state) => state.club)
  const {
    watch,
    control,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = formProps

  const watchTransaction = watch()
  const error = errors
  // console.log({ watchTransaction, error })

  const handleClose = () => {
    onClose()
  }

  const getAvatar = (photo: any) => {
    const clubPhoto = {
      ...(photo
        ? { src: photo }
        : {
            className: 'bg-transparent',
            icon: (
              <Logo
                type="streamline"
                mode={'dark'}
                imgClass="mx-auto"
                logoWidth={30}
              />
            ),
          }),
    }

    return clubPhoto
  }

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.freezeProgram] })
    handleClose()
    resetTransactionFreezeForm(formProps)
  }

  // Mutations
  const createCheckout = useMutation({
    mutationFn: (data: CheckoutRequest) => apiCreateCheckout(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: (data: any) => {
      handlePrefecth()
      navigate(`/sales/${data.data.updated_transaction.code}`)
    },
  })

  const onSubmit: SubmitHandler<ValidationTransactionFreezeSchema> = (data) => {
    const body = {
      club_id: club?.id as number,
      member_id: member?.id as number,
      balance_amount: data.balance_amount,
      is_paid: 1,
      discount_type: 'nominal',
      discount: 0,
      tax_rate: data.tax_rate || 0,
      due_date: dayjs().format('YYYY-MM-DD'),
      items: data.items.map((item) => ({
        ...item,
        item_type: 'freeze',
        name: 'Freeze',
        price: data.balance_amount,
        quantity: 1,
        start_date: dayjs(item.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(item.end_date).format('YYYY-MM-DD'),
        notes: data.notes,
      })),
      payments: data.payments,
      refund_from: [],
    }

    createCheckout.mutate(body as unknown as CheckoutRequest)
    // setConfirmPartPaid(false)
  }

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

  const Footer = (
    <div className="text-right w-full">
      <Button
        variant="solid"
        loading={createCheckout.isPending}
        disabled={watch('payments').length < 0}
        onClick={handleSubmit(onSubmit)}
      >
        Simpan
      </Button>
    </div>
  )

  return (
    <>
      <Drawer
        title="Tambah Freeze"
        isOpen={open}
        footer={Footer}
        onClose={onClose}
        onRequestClose={onClose}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="w-full flex flex-col mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Avatar size={40} shape="circle" {...getAvatar(member?.photo)} />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {member?.name}
                </span>
                <span className="text-sm text-gray-500 font-bold">
                  {member?.code}
                </span>
              </div>
            </div>
            <FormItem
              label="Start Date"
              className="w-full"
              invalid={Boolean(errors?.items?.[0]?.start_date)}
              errorMessage={errors?.items?.[0]?.start_date?.message}
            >
              <Controller
                name={`items.${0}.start_date`}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    inputFormat="DD-MM-YYYY"
                    placeholder="Start Date"
                    {...field}
                    value={field.value ? dayjs(field.value).toDate() : null} //dayjs(field.value).toDate()}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label="End Date"
              className="w-full"
              invalid={Boolean(errors?.items?.[0]?.end_date)}
              errorMessage={errors?.items?.[0]?.end_date?.message}
            >
              <Controller
                name={`items.${0}.end_date`}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    inputFormat="DD-MM-YYYY"
                    placeholder="End Date"
                    {...field}
                    value={field.value ? dayjs(field.value).toDate() : null} //dayjs(field.value).toDate()}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label="Description"
              className="w-full mb-2"
              invalid={Boolean(errors.notes)}
              errorMessage={errors.notes?.message}
            >
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Input
                    textArea
                    type="text"
                    placeholder="Add Freeze Description"
                    autoComplete="off"
                    {...field}
                    value={field.value ?? ''}
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
                    placeholder="0"
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
                    // isMulti
                    //   isLoading={isLoading}
                    loadOptions={getRekeningList as any}
                    additional={{ page: 1 }}
                    placeholder="Select Payment"
                    value={field.value[0]}
                    cacheUniqs={[watchTransaction.payments[0]]}
                    getOptionLabel={(option) => option.name!}
                    getOptionValue={(option) => option.id?.toString()}
                    debounceTimeout={500}
                    // isOptionDisabled={(option) =>
                    //   (option.name !== 'Cash' && isPaidOf) ||
                    //   watchTransaction.balance_amount <= 0
                    // }
                    onChange={(val, ctx) => {
                      if (ctx.action === 'clear') {
                        field.onChange([])
                        formProps.setValue(
                          'balance_amount',
                          watchTransaction.balance_amount
                        )
                        formProps.setError('payments', {
                          type: 'custom',
                          message: 'Payment method is required',
                        })
                      } else {
                        field.onChange([
                          {
                            id: val?.id,
                            name: val?.name,
                            amount: watchTransaction.balance_amount,
                          },
                        ])
                        formProps.clearErrors('payments')
                      }
                    }}
                  />
                )}
              />
            </FormItem>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default FormFreeze
