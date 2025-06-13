import { Button, Dialog, Form, FormItem, Input } from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import InputCurrency from '@/components/ui/InputCurrency'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateProduct } from '@/services/api/@types/product'
import {
  apiCreateProduct,
  apiDeleteProduct,
  apiUpdateProduct,
} from '@/services/api/ProductService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { CreateProductSchema, ReturnProductFormSchema } from './validation'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnProductFormSchema
  onClose: () => void
}

const FormProduct: React.FC<FormProps> = ({
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
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.products] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateProduct) => apiCreateProduct(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateProduct) =>
      apiUpdateProduct(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteProduct(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<CreateProductSchema> = (data) => {
    if (type === 'update') {
      update.mutate({
        club_id: club?.id as number,
        name: data.name,
        description: data.description,
        price: data.price,
        photo: data.photo,
        quantity: data.quantity,
        sku: data.sku,
        code: data.code,
        hpp: data.hpp,
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        club_id: club?.id as number,
        name: data.name,
        description: data.description,
        price: data.price,
        photo: data.photo,
        quantity: data.quantity,
        sku: data.sku,
        code: data.code,
        hpp: data.hpp,
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
              {type === 'create' ? 'Create Product' : 'Update Product'}
            </h5>
            <div className="">
              <div>Photo coming soon</div>
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
                label="Quantity"
                invalid={Boolean(errors.quantity)}
                errorMessage={errors.quantity?.message}
              >
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      autoComplete="off"
                      placeholder="Quantity"
                      {...field}
                    />
                  )}
                />
              </FormItem>
              <div className="w-full flex flex-col md:flex-row items-start gap-0 md:gap-2">
                <FormItem
                  label="Hpp"
                  className="w-full"
                  invalid={Boolean(errors.hpp)}
                  errorMessage={errors.hpp?.message}
                >
                  <Controller
                    name="hpp"
                    control={control}
                    render={({ field }) => (
                      <InputCurrency
                        placeholder="Rp. 0"
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </FormItem>
                <FormItem
                  label="Sale Price"
                  className="w-full"
                  invalid={Boolean(errors.price)}
                  errorMessage={errors.price?.message}
                >
                  <Controller
                    name="price"
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
              </div>
              <div className="w-full flex flex-col md:flex-row items-start gap-0 md:gap-2">
                {/* sku */}
                <FormItem
                  label="Sku"
                  className="w-full"
                  invalid={Boolean(errors.sku)}
                  errorMessage={errors.sku?.message}
                >
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Sku"
                        {...field}
                        value={field.value ?? ''}
                      />
                    )}
                  />
                </FormItem>
                {/* code */}
                <FormItem
                  label="Code"
                  className="w-full"
                  invalid={Boolean(errors.code)}
                  errorMessage={errors.code?.message}
                >
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Code"
                        {...field}
                        value={field.value ?? ''}
                      />
                    )}
                  />
                </FormItem>
              </div>
              {/* description */}
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
        title="Delete Product"
        description="Are you sure want to delete this product?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default FormProduct
