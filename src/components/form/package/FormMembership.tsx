import {
  MembershipFormSchema,
  ReturnMembershipFormSchema,
  durationTypeOptions,
} from '@/components/form/package/package'
import {
  Button,
  Checkbox,
  Dialog,
  Form,
  FormItem,
  Input,
  InputGroup,
  Select,
  Switcher,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import InputCurrency from '@/components/ui/InputCurrency'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreatePackageDto } from '@/services/api/@types/package'
import {
  apiCreatePackage,
  apiDeletePackage,
  apiUpdatePackage,
} from '@/services/api/PackageService'
import { useSessionUser } from '@/store/authStore'
import calculateDiscountAmount from '@/utils/calculateDiscountAmount'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnMembershipFormSchema
  onClose: () => void
}

const FormMembership: React.FC<FormProps> = ({
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
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.packageMembership] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreatePackageDto) => apiCreatePackage(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreatePackageDto) =>
      apiUpdatePackage(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeletePackage(id),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<MembershipFormSchema> = (data) => {
    if (type === 'update') {
      update.mutate({
        club_id: club?.id as number,
        name: data.name,
        description: data.description,
        price: data.price,
        type: 'membership',
        duration: data.duration,
        duration_type: data.duration_type as CreatePackageDto['duration_type'],
        session_duration: data.session_duration,
        enabled: data.enabled,
        allow_all_trainer: data.allow_all_trainer,
        is_promo: data.is_promo,
        discount_type:
          (data.discount_type as CreatePackageDto['discount_type']) ||
          'nominal',
        discount: data.discount || 0,
        loyalty_point: data.loyalty_point,
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        club_id: club?.id as number,
        name: data.name,
        description: data.description,
        price: data.price,
        type: 'membership',
        duration: data.duration,
        duration_type: data.duration_type as CreatePackageDto['duration_type'],
        session_duration: data.session_duration,
        enabled: data.enabled,
        allow_all_trainer: data.allow_all_trainer,
        is_promo: data.is_promo,
        discount_type:
          (data.discount_type as CreatePackageDto['discount_type']) ||
          'nominal',
        discount: data.discount || 0,
        loyalty_point: data.loyalty_point,
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
              {type === 'create'
                ? 'Create Membership Package'
                : 'Update Membership Package'}
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
                label="Price"
                invalid={Boolean(errors.price)}
                errorMessage={errors.price?.message}
              >
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <InputCurrency
                      placeholder="Price"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label=""
                invalid={Boolean(errors.is_promo) || Boolean(errors.discount)}
                errorMessage={
                  errors.is_promo?.message || errors.discount?.message
                }
                labelClass="w-full flex justify-between items-center"
                extraType="start"
                extra={
                  <Controller
                    name="is_promo"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-1">
                        <Switcher
                          name="is_promo"
                          checked={Boolean(field.value)}
                          onChange={(checked) => {
                            field.onChange(checked ? 1 : 0)
                            formProps.setValue(
                              'discount_type',
                              checked ? 'nominal' : undefined
                            )
                            formProps.setValue('discount', undefined)
                          }}
                        />
                        <span>Set as Promo</span>
                      </div>
                    )}
                  />
                }
              >
                {watchData.is_promo ? (
                  <Controller
                    name="discount"
                    control={control}
                    render={({ field }) => {
                      const { famount } = calculateDiscountAmount({
                        price: watchData.price,
                        discount_type: watchData.discount_type as any,
                        discount_amount: field.value as number,
                      })
                      return (
                        <>
                          <InputGroup className="mt-3">
                            {watchData.discount_type === 'nominal' ? (
                              <InputCurrency
                                placeholder="Discount amount"
                                value={field.value}
                                onValueChange={field.onChange}
                              />
                            ) : (
                              <Input
                                type="number"
                                autoComplete="off"
                                placeholder="10%"
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
                                formProps.setValue('discount', undefined)
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
                                formProps.setValue('discount', undefined)
                              }}
                            >
                              Rp
                            </Button>
                          </InputGroup>
                          <span className="text-xs italic">
                            Sell Price {famount}
                          </span>
                        </>
                      )
                    }}
                  />
                ) : null}
              </FormItem>
              <FormItem
                label="Loyalty points earned"
                invalid={Boolean(errors.loyalty_point)}
                errorMessage={errors.loyalty_point?.message}
              >
                <Controller
                  name="loyalty_point"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      autoComplete="off"
                      suffix="Pts"
                      {...field}
                    />
                  )}
                />
              </FormItem>
              <div className="w-full flex flex-col md:flex-row items-center gap-0 md:gap-4">
                <FormItem
                  asterisk
                  label="Duration"
                  className="w-full"
                  invalid={Boolean(errors.duration)}
                  errorMessage={errors.duration?.message}
                >
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        autoComplete="off"
                        placeholder="duration"
                        {...field}
                      />
                    )}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Duration Type"
                  className="w-full"
                  invalid={Boolean(errors.duration_type)}
                  errorMessage={errors.duration_type?.message}
                >
                  <Controller
                    name="duration_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isSearchable={false}
                        placeholder="Please Select"
                        value={durationTypeOptions.filter(
                          (option) => option.value === field.value
                        )}
                        options={durationTypeOptions}
                        onChange={(option) => field.onChange(option?.value)}
                      />
                    )}
                  />
                </FormItem>
              </div>
              <FormItem
                label="Description"
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
                      rows={1}
                      {...field}
                      value={field.value ?? ''}
                    />
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
                    <Checkbox checked={field.value} {...field}>
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
        title="Delete Membership Package"
        description="Are you sure want to delete this membership package?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default FormMembership
