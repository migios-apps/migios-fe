import {
  Button,
  DatePicker,
  Dialog,
  Form,
  FormItem,
  Input,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import InputCurrency from '@/components/ui/InputCurrency'
import SelectAsyncPaginate, {
  ReturnAsyncSelect,
} from '@/components/ui/Select/SelectAsync'
import cn from '@/components/ui/utils/classNames'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import {
  CategoryDetail,
  CreateFinancialRecord,
  RekeningDetail,
} from '@/services/api/@types/finance'
import {
  apiCreateFinancialRecord,
  apiDeleteFinancialRecord,
  apiGetCategoryList,
  apiGetRekeningList,
  apiUpdateFinancialRecord,
} from '@/services/api/FinancialService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import {
  CreateFinancialRecordSchema,
  ReturnFinancialRecordFormSchema,
} from './financeValidation'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnFinancialRecordFormSchema
  onClose: () => void
}

const FinanceRecord: React.FC<FormProps> = ({
  open,
  type,
  formProps,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const club = useSessionUser((state) => state.club)
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = formProps
  const watchData = watch()
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const handleClose = () => {
    formProps.reset({})
    onClose()
  }

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.financialRecord] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateFinancialRecord) => apiCreateFinancialRecord(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateFinancialRecord) =>
      apiUpdateFinancialRecord(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteFinancialRecord(id),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<CreateFinancialRecordSchema> = (data) => {
    if (type === 'update') {
      update.mutate({
        club_id: club?.id as number,
        financial_category_id: data.category.id,
        rekening_id: data.rekening.id,
        amount: parseFloat(data.amount as unknown as string),
        type: data.type,
        description: data?.description as string,
        editable: data.editable,
        date: dayjs(data.date).format('YYYY-MM-DD'),
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        club_id: club?.id as number,
        financial_category_id: data.category.id,
        rekening_id: data.rekening.id,
        amount: parseFloat(data.amount as unknown as string),
        type: data.type,
        description: data?.description as string,
        editable: data.editable,
        date: dayjs(data.date).format('YYYY-MM-DD'),
      })
      return
    }
  }

  const handleDelete = () => {
    deleteItem.mutate(watchData.id as number)
    setConfirmDelete(false)
    handleClose()
  }

  const getCategoryList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<CategoryDetail, GroupBase<CategoryDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetCategoryList({
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
            search_column: 'type',
            search_condition: '=',
            search_text: `${watchData.type}`,
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
    [watchData.type]
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
    <>
      <Dialog
        scrollBody
        isOpen={open}
        width={620}
        onClose={handleClose}
        onRequestClose={handleClose}
      >
        <div className="flex flex-col h-full justify-between">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h5 className="mb-4">
              {type === 'create'
                ? 'Create Financial Record'
                : 'Update Financial Record'}
            </h5>
            <div className="">
              <FormItem
                asterisk
                label="Date"
                className="w-full"
                invalid={Boolean(errors.date)}
                errorMessage={errors.date?.message}
              >
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      inputFormat="DD-MM-YYYY"
                      placeholder="Date"
                      {...field}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Type"
                className="w-full"
                invalid={Boolean(errors.type)}
                errorMessage={errors.type?.message}
              >
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        variant="solid"
                        type="button"
                        size="xs"
                        className={cn(
                          'w-full',
                          field.value === 'income'
                            ? 'bg-primary'
                            : 'bg-gray-300 text-gray-900 hover:text-white'
                        )}
                        onClick={() => field.onChange('income')}
                      >
                        Income
                      </Button>
                      <Button
                        variant="solid"
                        type="button"
                        size="xs"
                        className={cn(
                          'w-full',
                          field.value === 'expense'
                            ? 'bg-yellow-500 text-white hover:text-white hover:bg-yellow-500'
                            : 'bg-gray-300 text-gray-900 hover:text-white hover:bg-yellow-500'
                        )}
                        onClick={() => field.onChange('expense')}
                      >
                        Expense
                      </Button>
                    </div>
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Category"
                invalid={Boolean(errors.category)}
                errorMessage={errors.category?.message}
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <SelectAsyncPaginate
                      isClearable
                      //   isLoading={isLoading}
                      isDisabled={!watchData.type}
                      loadOptions={getCategoryList as any}
                      additional={{ page: 1 }}
                      placeholder="Select Category"
                      value={field.value}
                      cacheUniqs={[watchData.type]}
                      getOptionLabel={(option) => option.name!}
                      getOptionValue={(option) => option.id.toString()}
                      debounceTimeout={500}
                      onChange={(option) => field.onChange(option)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Rekening"
                invalid={Boolean(errors.rekening)}
                errorMessage={errors.rekening?.message}
              >
                <Controller
                  name="rekening"
                  control={control}
                  render={({ field }) => (
                    <SelectAsyncPaginate
                      isClearable
                      //   isLoading={isLoading}
                      loadOptions={getRekeningList as any}
                      additional={{ page: 1 }}
                      placeholder="Select Rekening"
                      value={field.value}
                      //   cacheUniqs={[watchData.category]}
                      getOptionLabel={(option) => option.name!}
                      getOptionValue={(option) => option.id.toString()}
                      debounceTimeout={500}
                      onChange={(option) => field.onChange(option)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Amount"
                invalid={Boolean(errors.amount)}
                errorMessage={errors.amount?.message}
              >
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <InputCurrency
                      placeholder="Rp. 0"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Description"
                className="w-full mb-2"
                invalid={Boolean(errors.description)}
                errorMessage={errors.description?.message}
              >
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      textArea
                      type="text"
                      autoComplete="off"
                      placeholder="description"
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              </FormItem>
            </div>
            <div className="text-right mt-6 flex justify-between items-center gap-2">
              {type === 'update' ? (
                <Button
                  className="ltr:mr-2 rtl:ml-2 bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                  variant="solid"
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash color="currentColor" size="24" variant="Outline" />
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                variant="solid"
                type="submit"
                loading={create.isPending || update.isPending}
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      </Dialog>

      <AlertConfirm
        open={confirmDelete}
        title="Delete Record"
        description="Are you sure want to delete this record?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default FinanceRecord
