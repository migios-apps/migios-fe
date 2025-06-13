import { Button, Dialog, Form, FormItem, Input } from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import cn from '@/components/ui/utils/classNames'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateCategory } from '@/services/api/@types/finance'
import {
  apiCreateCategory,
  apiDeleteCategory,
  apiUpdateCategory,
} from '@/services/api/FinancialService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import {
  CreateCategorySchema,
  ReturnCategoryFormSchema,
} from './financeValidation'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnCategoryFormSchema
  onClose: () => void
}

const CategoryForm: React.FC<FormProps> = ({
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
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.financialCategory] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateCategory) => apiCreateCategory(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateCategory) =>
      apiUpdateCategory(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteCategory(id),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<CreateCategorySchema> = (data) => {
    if (type === 'update') {
      update.mutate({
        club_id: club?.id as number,
        name: data.name,
        type: data.type,
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        club_id: club?.id as number,
        name: data.name,
        type: data.type,
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
              {type === 'create' ? 'Create Category' : 'Update Category'}
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
        title="Delete Category"
        description="Are you sure want to delete this category?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default CategoryForm
