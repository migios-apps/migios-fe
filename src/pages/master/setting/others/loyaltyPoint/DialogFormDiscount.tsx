import {
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  InputCurrency,
  InputGroup,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateLoyaltyType } from '@/services/api/@types/settings/loyalty'
import {
  apiCreateLoyalty,
  apiDeleteLoyalty,
  apiUpdateLoyalty,
} from '@/services/api/settings/LoyaltyService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Add, Minus, Trash } from 'iconsax-react'
import React from 'react'
import { Controller } from 'react-hook-form'
import {
  CreateLoyaltySchema,
  ReturnLoyaltyFormSchema,
  resetLoyaltyForm,
} from './validation'

type DialogFormDiscountProps = {
  formProps: ReturnLoyaltyFormSchema
  open: boolean
  type: 'create' | 'update'
  onClose: () => void
  onSuccess?: () => void
}

const DialogFormDiscount: React.FC<DialogFormDiscountProps> = ({
  formProps,
  open,
  type,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient()
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = formProps

  const watchData = watch()

  const handleClose = () => {
    resetLoyaltyForm(formProps)
    onClose()
  }

  const handlePrefecth = () => {
    onSuccess?.()
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.loyaltyList] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateLoyaltyType) => apiCreateLoyalty(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateLoyaltyType) =>
      apiUpdateLoyalty(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteLoyalty(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefecth,
  })

  const handleDelete = () => {
    deleteItem.mutate(watchData.id as number)
    setConfirmDelete(false)
    handleClose()
  }

  const handleFormSubmit = (data: CreateLoyaltySchema) => {
    if (type === 'update') {
      update.mutate({
        name: 'Discount',
        discount_type: data.discount_type as 'percent' | 'nominal',
        discount_value: data.discount_value as number,
        reward_items: [],
        type: 'discount',
        points_required: data.points_required,
        enabled: data.enabled,
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        name: 'Discount',
        discount_type: data.discount_type as 'percent' | 'nominal',
        discount_value: data.discount_value as number,
        reward_items: [],
        type: 'discount',
        points_required: data.points_required,
        enabled: data.enabled,
      })
      return
    }
  }

  return (
    <Dialog
      scrollBody
      isOpen={open}
      width={400}
      onClose={handleClose}
      onRequestClose={handleClose}
    >
      <div className="flex flex-col h-full justify-between">
        <h6 className="text-xl font-bold mb-2">
          {type === 'create' ? 'Diskon Baru' : 'Ubah Diskon'}
        </h6>

        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormItem
            label="Point yang diperlukan"
            invalid={Boolean(errors.points_required)}
            errorMessage={errors.points_required?.message}
            labelClass="w-full flex justify-between items-center"
            extraType="start"
          >
            <Controller
              name="points_required"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <InputGroup>
                      <Input
                        type="number"
                        autoComplete="off"
                        placeholder="0 Point"
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === '' ? 0 : Number(e.target.value)
                          field.onChange(value)
                        }}
                      />
                      <Button
                        type="button"
                        variant="default"
                        disabled={field.value <= 0}
                        onClick={() => {
                          const newValue = Number(field.value) - 1
                          if (newValue >= 1) {
                            field.onChange(newValue)
                          }
                        }}
                      >
                        <Minus color="currentColor" size="20" />
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                          const newValue = Number(field.value) + 1
                          field.onChange(newValue)
                        }}
                      >
                        <Add color="currentColor" size="20" />
                      </Button>
                    </InputGroup>
                  </>
                )
              }}
            />
          </FormItem>

          <FormItem
            label="Jumlah Diskon"
            invalid={Boolean(errors.discount_value)}
            errorMessage={errors.discount_value?.message}
          >
            <Controller
              name="discount_value"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <InputGroup>
                      {watchData.discount_type === 'nominal' ? (
                        <InputCurrency
                          placeholder="0"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      ) : (
                        <Input
                          type="number"
                          autoComplete="off"
                          placeholder="0"
                          {...field}
                        />
                      )}
                      <Button
                        type="button"
                        variant={
                          watchData.discount_type === 'percent'
                            ? 'solid'
                            : 'default'
                        }
                        onClick={() => {
                          formProps.setValue('discount_type', 'percent')
                          formProps.setValue('discount_value', undefined)
                        }}
                      >
                        %
                      </Button>
                      <Button
                        type="button"
                        variant={
                          watchData.discount_type === 'nominal'
                            ? 'solid'
                            : 'default'
                        }
                        onClick={() => {
                          formProps.setValue('discount_type', 'nominal')
                          formProps.setValue('discount_value', undefined)
                        }}
                      >
                        Rp
                      </Button>
                    </InputGroup>
                  </>
                )
              }}
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

        <AlertConfirm
          open={confirmDelete}
          title="Delete Loyalty Discount"
          description="Are you sure want to delete this loyalty discount?"
          type="delete"
          loading={deleteItem.isPending}
          onClose={() => setConfirmDelete(false)}
          onLeftClick={() => setConfirmDelete(false)}
          onRightClick={handleDelete}
        />
      </div>
    </Dialog>
  )
}

export default DialogFormDiscount
