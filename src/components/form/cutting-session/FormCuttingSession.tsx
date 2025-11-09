import {
  Avatar,
  Button,
  DatePicker,
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import SelectAsyncPaginate, {
  ReturnAsyncSelect,
} from '@/components/ui/Select/SelectAsync'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateCuttingSession } from '@/services/api/@types/cutting-session'
import { EmployeeDetail } from '@/services/api/@types/employee'
import { MemberDetail } from '@/services/api/@types/member'
import {
  apiCreateCuttingSession,
  apiDeleteCuttingSession,
  apiUpdateCuttingSession,
} from '@/services/api/CuttingSessionService'
import { apiGetEmployeeList } from '@/services/api/EmployeeService'
import {
  apiGetMemberList,
  apiGetMemberPackages,
} from '@/services/api/MembeService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Add, Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler, useFieldArray } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import {
  CuttingSessionFormSchema,
  ReturnCuttingSessionFormSchema,
} from './validation'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnCuttingSessionFormSchema
  onClose: () => void
  statusCode?: number | null
}

const FormCuttingSession: React.FC<FormProps> = ({
  open,
  type,
  formProps,
  onClose,
  statusCode,
}) => {
  const queryClient = useQueryClient()
  const club = useSessionUser((state) => state.club)
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = formProps
  const watchData = watch()
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const {
    fields: exerciseFields,
    append: appendExercise,
    remove: removeExercise,
  } = useFieldArray({
    control,
    name: 'exercises',
  })

  const { data: memberPackages } = useQuery({
    queryKey: [QUERY_KEY.memberPackages, watchData.member?.code],
    queryFn: async () => {
      if (!watchData.member?.code) return { data: { data: [] } }
      const res = await apiGetMemberPackages(watchData.member.code, {
        page: 1,
        per_page: 100,
        search: [
          {
            search_column: 'duration_status_code',
            search_condition: '=',
            search_text: '1',
          },
        ],
      })
      return res
    },
    enabled: !!watchData.member?.code,
    select: (res) => res.data.data,
  })

  React.useEffect(() => {
    if (!watchData.member?.id) {
      setValue('member_package_id', 0)
      setValue('member_package', null)
    }
  }, [watchData.member?.id, setValue])

  const getMemberList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<MemberDetail, GroupBase<MemberDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetMemberList({
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

  const getTrainerList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<EmployeeDetail, GroupBase<EmployeeDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetEmployeeList({
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
            search_column: 'type',
            search_condition: '=',
            search_text: 'trainer',
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

  const handleClose = () => {
    formProps.reset({})
    onClose()
  }

  const handlePrefetch = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cuttingSessions] })
    handleClose()
  }

  const create = useMutation({
    mutationFn: (data: CreateCuttingSession) => apiCreateCuttingSession(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefetch,
  })

  const update = useMutation({
    mutationFn: (data: CreateCuttingSession) =>
      apiUpdateCuttingSession(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefetch,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteCuttingSession(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefetch,
  })

  const onSubmit: SubmitHandler<CuttingSessionFormSchema> = (data) => {
    const payload: CreateCuttingSession = {
      club_id: club?.id as number,
      member_id: data.member_id,
      member_package_id: data.member_package_id,
      trainer_id: data.trainer_id,
      type: data.type,
      session_cut: data.session_cut,
      description: data.description || null,
      due_date: dayjs(data.due_date).format('YYYY-MM-DD'),
      start_date: dayjs(data.start_date).format('YYYY-MM-DD HH:mm'),
      end_date: dayjs(data.end_date).format('YYYY-MM-DD HH:mm'),
      exercises: data.exercises || [],
    }

    if (type === 'update') {
      update.mutate(payload)
      return
    }
    if (type === 'create') {
      create.mutate(payload)
      return
    }
  }

  const handleDelete = () => {
    deleteItem.mutate(watchData.id as number)
    setConfirmDelete(false)
    handleClose()
  }

  const typeOptions = [
    { label: 'PT Program', value: 'pt_program' },
    { label: 'Class', value: 'class' },
    { label: 'Service', value: 'service' },
  ]

  return (
    <>
      <Dialog
        scrollBody
        width={620}
        isOpen={open}
        onClose={handleClose}
        onRequestClose={handleClose}
      >
        <div className="flex flex-col h-full justify-between">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h5 className="mb-4">
              {type === 'create'
                ? 'Create Cutting Session'
                : 'Update Cutting Session'}
            </h5>
            <div className="">
              <FormItem
                asterisk
                label="Member"
                invalid={Boolean(errors.member_id)}
                errorMessage={errors.member_id?.message}
              >
                <Controller
                  name="member"
                  control={control}
                  render={({ field }) => (
                    <SelectAsyncPaginate
                      isClearable
                      loadOptions={getMemberList as any}
                      additional={{ page: 1 }}
                      placeholder="Select Member"
                      value={field.value}
                      cacheUniqs={[watchData.member]}
                      getOptionLabel={(option) => option.name!}
                      getOptionValue={(option) => `${option.id}`}
                      debounceTimeout={500}
                      formatOptionLabel={({ name, photo }) => {
                        return (
                          <div className="flex justify-start items-center gap-2">
                            <Avatar
                              size="sm"
                              {...(photo && { src: photo || '' })}
                              {...(!photo && { icon: <HiOutlineUser /> })}
                            />
                            <span className="text-sm">{name}</span>
                          </div>
                        )
                      }}
                      onChange={(option) => {
                        field.onChange(option)
                        setValue('member_id', option?.id || 0)
                        setValue('member_package_id', 0)
                        setValue('member_package', null)
                      }}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Member Package"
                invalid={Boolean(errors.member_package_id)}
                errorMessage={errors.member_package_id?.message}
              >
                <Controller
                  name="member_package"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isSearchable={false}
                      placeholder="Select Member Package"
                      value={
                        memberPackages?.find(
                          (pkg) => pkg.id === watchData.member_package_id
                        )
                          ? {
                              label:
                                memberPackages.find(
                                  (pkg) =>
                                    pkg.id === watchData.member_package_id
                                )?.package?.name || '',
                              value: watchData.member_package_id,
                            }
                          : null
                      }
                      options={memberPackages?.map((pkg) => ({
                        label: `${pkg.package?.name || ''} (${pkg.session_duration} sessions)`,
                        value: pkg.id,
                      }))}
                      isDisabled={!watchData.member_id}
                      onChange={(option) => {
                        field.onChange(option)
                        setValue('member_package_id', option?.value || 0)
                      }}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Trainer"
                invalid={Boolean(errors.trainer_id)}
                errorMessage={errors.trainer_id?.message}
              >
                <Controller
                  name="trainer"
                  control={control}
                  render={({ field }) => (
                    <SelectAsyncPaginate
                      isClearable
                      loadOptions={getTrainerList as any}
                      additional={{ page: 1 }}
                      placeholder="Select Trainer"
                      value={field.value}
                      cacheUniqs={[watchData.trainer]}
                      getOptionLabel={(option) => option.name!}
                      getOptionValue={(option) => `${option.id}`}
                      debounceTimeout={500}
                      formatOptionLabel={({ name, photo }) => {
                        return (
                          <div className="flex justify-start items-center gap-2">
                            <Avatar
                              size="sm"
                              {...(photo && { src: photo || '' })}
                              {...(!photo && { icon: <HiOutlineUser /> })}
                            />
                            <span className="text-sm">{name}</span>
                          </div>
                        )
                      }}
                      onChange={(option) => {
                        field.onChange(option)
                        setValue('trainer_id', option?.id || 0)
                      }}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Type"
                invalid={Boolean(errors.type)}
                errorMessage={errors.type?.message}
              >
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isSearchable={false}
                      placeholder="Select Type"
                      value={typeOptions.find(
                        (opt) => opt.value === field.value
                      )}
                      options={typeOptions}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Session Cut"
                invalid={Boolean(errors.session_cut)}
                errorMessage={errors.session_cut?.message}
              >
                <Controller
                  name="session_cut"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      autoComplete="off"
                      placeholder="Session Cut"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        field.onChange(value)
                      }}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Start Date"
                invalid={Boolean(errors.start_date)}
                errorMessage={errors.start_date?.message}
              >
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker.DateTimepicker
                      inputFormat="DD-MM-YYYY HH:mm"
                      amPm={false}
                      placeholder="Start Date"
                      {...field}
                      value={field.value ? dayjs(field.value).toDate() : null}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                asterisk
                label="End Date"
                invalid={Boolean(errors.end_date)}
                errorMessage={errors.end_date?.message}
              >
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker.DateTimepicker
                      inputFormat="DD-MM-YYYY HH:mm"
                      amPm={false}
                      placeholder="End Date"
                      {...field}
                      value={field.value ? dayjs(field.value).toDate() : null}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Due Date"
                invalid={Boolean(errors.due_date)}
                errorMessage={errors.due_date?.message}
              >
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      inputFormat="DD-MM-YYYY"
                      placeholder="Due Date"
                      {...field}
                      value={field.value ? dayjs(field.value).toDate() : null}
                      onChange={(date) => {
                        field.onChange(
                          date ? dayjs(date).format('YYYY-MM-DD') : ''
                        )
                      }}
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
                      placeholder="Description"
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              </FormItem>

              {/* Exercises Section */}
              <div className="w-full mb-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">Exercises</label>
                  <Button
                    type="button"
                    size="sm"
                    variant="plain"
                    icon={<Add size={16} />}
                    onClick={() =>
                      appendExercise({
                        name: '',
                        sets: 1,
                        reps: 1,
                        weight_kg: 0,
                        rpe: 1,
                      })
                    }
                  >
                    Add Exercise
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Tambahkan daftar latihan yang dilakukan dalam sesi ini. Setiap
                  latihan mencakup nama, jumlah set, repetisi per set, beban
                  (kg), dan tingkat effort (RPE 1-10).
                </p>
                {exerciseFields.length === 0 && (
                  <p className="text-sm text-gray-500 mb-3">
                    No exercises added. Click &quot;Add Exercise&quot; to add
                    one.
                  </p>
                )}
                {exerciseFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-semibold text-sm">
                        Exercise {index + 1}
                      </h6>
                      <Button
                        type="button"
                        size="sm"
                        variant="plain"
                        className="text-red-500 hover:text-red-600"
                        icon={<Trash size={16} />}
                        onClick={() => removeExercise(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormItem
                        asterisk
                        label="Exercise Name"
                        invalid={Boolean(errors.exercises?.[index]?.name)}
                        errorMessage={errors.exercises?.[index]?.name?.message}
                      >
                        <Controller
                          name={`exercises.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              autoComplete="off"
                              placeholder="Exercise Name"
                              {...field}
                            />
                          )}
                        />
                      </FormItem>
                      <FormItem
                        asterisk
                        label="Sets"
                        invalid={Boolean(errors.exercises?.[index]?.sets)}
                        errorMessage={errors.exercises?.[index]?.sets?.message}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                          Jumlah set yang dilakukan (minimal 1)
                        </p>
                        <Controller
                          name={`exercises.${index}.sets`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              autoComplete="off"
                              placeholder="Sets"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0
                                field.onChange(value)
                              }}
                            />
                          )}
                        />
                      </FormItem>
                      <FormItem
                        asterisk
                        label="Reps"
                        invalid={Boolean(errors.exercises?.[index]?.reps)}
                        errorMessage={errors.exercises?.[index]?.reps?.message}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                          Jumlah repetisi per set (minimal 1)
                        </p>
                        <Controller
                          name={`exercises.${index}.reps`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              autoComplete="off"
                              placeholder="Reps"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0
                                field.onChange(value)
                              }}
                            />
                          )}
                        />
                      </FormItem>
                      <FormItem
                        asterisk
                        label="Weight (Kg)"
                        invalid={Boolean(errors.exercises?.[index]?.weight_kg)}
                        errorMessage={
                          errors.exercises?.[index]?.weight_kg?.message
                        }
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                          Beban yang digunakan dalam kilogram (minimal 0)
                        </p>
                        <Controller
                          name={`exercises.${index}.weight_kg`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              autoComplete="off"
                              placeholder="Weight (Kg)"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0
                                field.onChange(value)
                              }}
                            />
                          )}
                        />
                      </FormItem>
                      <FormItem
                        asterisk
                        label="RPE (1-10)"
                        invalid={Boolean(errors.exercises?.[index]?.rpe)}
                        errorMessage={errors.exercises?.[index]?.rpe?.message}
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                          Rating of Perceived Exertion - tingkat effort yang
                          dirasakan (skala 1-10, minimal 1, maksimal 10)
                        </p>
                        <Controller
                          name={`exercises.${index}.rpe`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="number"
                              autoComplete="off"
                              placeholder="RPE (1-10)"
                              min={1}
                              max={10}
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1
                                field.onChange(
                                  value > 10 ? 10 : value < 1 ? 1 : value
                                )
                              }}
                            />
                          )}
                        />
                      </FormItem>
                    </div>
                  </div>
                ))}
              </div>
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
        title="Delete Cutting Session"
        description="Are you sure want to delete this Cutting Session?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default FormCuttingSession
