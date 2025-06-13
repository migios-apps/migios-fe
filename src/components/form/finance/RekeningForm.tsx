import {
  Button,
  Checkbox,
  Dialog,
  Form,
  FormItem,
  Input,
  Switcher,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import InputCurrency from '@/components/ui/InputCurrency'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateRekening } from '@/services/api/@types/finance'
import {
  apiCreateRekening,
  apiDeleteRekening,
  apiUpdateRekening,
} from '@/services/api/FinancialService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import {
  CreateRekeningSchema,
  ReturnRekeningFormSchema,
} from './financeValidation'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnRekeningFormSchema
  onClose: () => void
}

const RekeningForm: React.FC<FormProps> = ({
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
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.financialRekening] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateRekening) => apiCreateRekening(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateRekening) =>
      apiUpdateRekening(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteRekening(id),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<CreateRekeningSchema> = (data) => {
    if (type === 'update') {
      update.mutate({
        name: data.name,
        number: data.number,
        balance: data.balance,
        enabled: data.enabled,
        club_id: club?.id as number,
        show_in_payment: data.show_in_payment,
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        club_id: club?.id as number,
        name: data.name,
        number: data.number,
        balance: data.balance,
        enabled: data.enabled,
        show_in_payment: data.show_in_payment,
      })
      return
    }
  }

  const handleDelete = () => {
    deleteItem.mutate(watchData.id as number)
    setConfirmDelete(false)
    handleClose()
  }
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
              {type === 'create' ? 'Create Rekening' : 'Update Rekening'}
            </h5>
            <div className="">
              <FormItem
                asterisk
                label="Name"
                invalid={Boolean(errors.name)}
                errorMessage={errors.name?.message}
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      autoComplete="off"
                      placeholder="Name"
                      {...field}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Balance"
                invalid={Boolean(errors.balance)}
                errorMessage={errors.balance?.message}
              >
                <Controller
                  name="balance"
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
                label=""
                className="w-full"
                invalid={Boolean(errors.show_in_payment)}
                errorMessage={errors.show_in_payment?.message}
              >
                <Controller
                  name="show_in_payment"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-1">
                      <Switcher
                        checked={Boolean(field.value === 1)}
                        onChange={(checked) => {
                          field.onChange(checked ? 1 : 0)
                        }}
                      />
                      <span>Show in Payment</span>
                    </div>
                  )}
                />
              </FormItem>
              <FormItem
                label=""
                className="w-full"
                invalid={Boolean(errors.enabled)}
                errorMessage={errors.enabled?.message}
              >
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={field.value ?? false} {...field}>
                      {field.value ? 'Enabled' : 'Disabled'}
                    </Checkbox>
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
        title="Delete Rekening"
        description="Are you sure want to delete this rekening?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default RekeningForm
