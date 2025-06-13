import { Container } from '@/components/shared'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import { Button, Card, Form, FormItem, Input, Switcher } from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import { Permission } from '@/services/api/@types/settings/permission'
import { CreateRole } from '@/services/api/@types/settings/role'
import {
  apiCreateRole,
  apiDeleteRole,
  apiUpdateRole,
} from '@/services/api/settings/Role'
import classNames from '@/utils/classNames'
import { useMutation } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import {
  CreateRolePermissionFormSchema,
  ReturnRolePermissionFormSchema,
  resetRolePermissionForm,
} from './validation'

interface Props {
  type: 'create' | 'update'
  formProps: ReturnRolePermissionFormSchema
  allPermissions: Permission[]
  onSuccess?: () => void
}

const RolePermissionsForm: React.FC<Props> = ({
  type,
  formProps,
  allPermissions,
  onSuccess,
}) => {
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = formProps
  const watchData = watch()
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const groupedPermissions = allPermissions.reduce<
    Record<string, Permission[]>
  >((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = []
    acc[perm.category].push(perm)
    return acc
  }, {})

  const togglePermission = (id: number) => {
    const current = watchData.permissions || []
    if (current.includes(id)) {
      setValue(
        'permissions',
        current.filter((pid) => pid !== id)
      )
    } else {
      setValue('permissions', [...current, id])
    }
  }

  const clearPermissions = () => {
    setValue('permissions', [])
  }

  const selectAllPermissions = () => {
    const allPermissionIds = allPermissions.map((perm) => perm.id)
    setValue('permissions', allPermissionIds)
  }

  const toggleAllPermissions = () => {
    const currentPermissions = watchData.permissions || []
    const allPermissionIds = allPermissions.map((perm) => perm.id)

    // Check if all permissions are already selected
    const allSelected = allPermissionIds.every((id) =>
      currentPermissions.includes(id)
    )

    if (allSelected) {
      clearPermissions()
    } else {
      selectAllPermissions()
    }
  }

  const areAllPermissionsSelected = () => {
    const currentPermissions = watchData.permissions || []
    const allPermissionIds = allPermissions.map((perm) => perm.id)
    return allPermissionIds.every((id) => currentPermissions.includes(id))
  }

  const handleClose = () => {
    onSuccess?.()
    resetRolePermissionForm(formProps)
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateRole) => apiCreateRole(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handleClose,
  })

  const update = useMutation({
    mutationFn: (data: CreateRole) =>
      apiUpdateRole(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handleClose,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteRole(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handleClose,
  })

  const internalSubmit: SubmitHandler<CreateRolePermissionFormSchema> = (
    data
  ) => {
    const selectedPermissions = allPermissions.filter((p) =>
      data.permissions?.includes(p.id)
    )
    // onSubmit({
    //   display_name: data.display_name,
    //   description: data?.description,
    //   permissions: selectedPermissions,
    // })
    if (type === 'create') {
      create.mutate({
        display_name: data.display_name,
        description: data?.description,
        permissions: selectedPermissions,
      })
    } else {
      update.mutate({
        display_name: data.display_name,
        description: data?.description,
        permissions: selectedPermissions,
      })
    }
  }

  const handleDelete = () => {
    deleteItem.mutate(watchData.id as number)
    setConfirmDelete(false)
    handleClose()
  }

  return (
    <>
      <Form onSubmit={handleSubmit(internalSubmit)}>
        <div className="flex flex-col gap-4">
          <Card>
            <FormItem
              asterisk
              label="Role Name"
              invalid={Boolean(errors.display_name)}
              errorMessage={errors.display_name?.message}
            >
              <Controller
                name="display_name"
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
              label="Description"
              className="mb-0"
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
                    placeholder="Description"
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </FormItem>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Assign Permission</h3>
                <button
                  type="button"
                  className="text-red-500 hover:underline text-sm"
                  onClick={clearPermissions}
                >
                  Clear Permission
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Select All
                </span>
                <Switcher
                  checked={areAllPermissionsSelected()}
                  onChange={toggleAllPermissions}
                />
              </div>
            </div>

            {errors.permissions && (
              <p className="text-red-500 text-sm mb-2">
                {errors.permissions.message}
              </p>
            )}

            {Object.entries(groupedPermissions).map(
              ([category, perms], index) => (
                <div
                  key={category}
                  className={classNames(
                    'border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-6 bg-gray-50 dark:bg-gray-800',
                    index === Object.entries(groupedPermissions).length - 1 &&
                      'mb-0'
                  )}
                >
                  <h4 className="font-semibold text-gray-700 mb-3 dark:text-gray-200">
                    {category}
                  </h4>
                  <div className="space-y-4">
                    {perms.map((perm) => (
                      <Controller
                        key={perm.id}
                        control={control}
                        name="permissions"
                        render={({ field }) => {
                          const selected = watchData.permissions || []
                          return (
                            <div className="flex justify-between items-start border-b border-gray-100 pb-3 dark:border-gray-700">
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  {perm.display_name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {perm.description}
                                </p>
                              </div>
                              <Switcher
                                checked={selected.includes(perm.id)}
                                onChange={() => togglePermission(perm.id)}
                              />
                            </div>
                          )
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </Card>
        </div>
        <BottomStickyBar>
          <Container>
            <div className="flex items-center justify-between px-8">
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                variant="plain"
                icon={<TbArrowNarrowLeft />}
                onClick={() => history.back()}
              >
                Back
              </Button>
              <div className="flex items-center">
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
            </div>
          </Container>
        </BottomStickyBar>
      </Form>

      <AlertConfirm
        open={confirmDelete}
        title="Delete Role"
        description="Are you sure want to delete this role?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default RolePermissionsForm
