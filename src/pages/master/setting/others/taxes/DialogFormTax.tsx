import { Button, Dialog, Form, FormItem, Input } from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateTaxesType } from '@/services/api/@types/settings/taxes'
import {
  apiCreateTax,
  apiDeleteTax,
  apiUpdateTax,
} from '@/services/api/settings/TaxesService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller } from 'react-hook-form'
import {
  CreateTaxSchema,
  ReturnTaxFormSchema,
  resetTaxForm,
} from './validation'

type DialogFormTaxProps = {
  type: 'create' | 'update'
  formProps: ReturnTaxFormSchema
  open: boolean
  onClose: () => void
}

const DialogFormTax: React.FC<DialogFormTaxProps> = ({
  type,
  formProps,
  open,
  onClose,
}) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const queryClient = useQueryClient()
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = formProps
  const watchData = watch()

  const handleClose = () => {
    resetTaxForm(formProps)
    onClose()
  }

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.taxList] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.taxDefaultSaleItem] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateTaxesType) => apiCreateTax(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateTaxesType) =>
      apiUpdateTax(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteTax(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmitTax = (data: CreateTaxSchema) => {
    if (type === 'update') {
      update.mutate({
        name: data.name,
        rate: data.rate,
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        name: data.name,
        rate: data.rate,
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
        width={500}
        onClose={handleClose}
        onRequestClose={handleClose}
      >
        <div className="flex flex-col h-full justify-between">
          <h6 className="text-xl font-bold mb-1">
            {type === 'create' ? 'Tarif Pajak Baru' : 'Ubah Tarif Pajak'}
          </h6>

          <Form className="mt-4" onSubmit={handleSubmit(onSubmitTax)}>
            <FormItem
              asterisk
              label="Nama"
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
                    placeholder="Nama"
                    {...field}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label="Rate"
              invalid={Boolean(errors.rate)}
              errorMessage={errors.rate?.message}
            >
              <Controller
                name="rate"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    autoComplete="off"
                    step="0.1"
                    placeholder="0.0"
                    suffix="%"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <div className="flex space-x-4">
              {type === 'update' ? (
                <Button
                  className="w-1/2 bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                  variant="solid"
                  type="button"
                  icon={
                    <Trash color="currentColor" size="24" variant="Outline" />
                  }
                  onClick={() => setConfirmDelete(true)}
                >
                  Hapus
                </Button>
              ) : (
                <Button
                  className="w-1/2"
                  variant="default"
                  type="button"
                  onClick={handleClose}
                >
                  Batal
                </Button>
              )}
              <Button className="w-1/2" variant="solid" type="submit">
                Simpan
              </Button>
            </div>
          </Form>
        </div>
      </Dialog>

      <AlertConfirm
        open={confirmDelete}
        title="Delete Tax"
        description="Are you sure want to delete this tax?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default DialogFormTax
