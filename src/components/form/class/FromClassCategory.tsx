import { Button, Dialog, Form, FormItem, Input } from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateClassCategoryPage } from '@/services/api/@types/class'
import {
  apiCreateClassCategory,
  apiDeleteClassCategory,
  apiUpdateClassCategory,
} from '@/services/api/ClassService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import {
  ClassCategoryPageFormSchema,
  ReturnClassCategoryPageFormSchema,
  resetClassCategoryPageForm,
} from './validation'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnClassCategoryPageFormSchema
  onClose: () => void
}

const FromClassCategory: React.FC<FormProps> = ({
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
    resetClassCategoryPageForm(formProps)
    onClose()
  }

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.financialCategory] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateClassCategoryPage) => apiCreateClassCategory(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateClassCategoryPage) =>
      apiUpdateClassCategory(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteClassCategory(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<ClassCategoryPageFormSchema> = (data) => {
    if (type === 'update') {
      update.mutate({
        club_id: club?.id as number,
        name: data.name,
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        club_id: club?.id as number,
        name: data.name,
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

export default FromClassCategory
