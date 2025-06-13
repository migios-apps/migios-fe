import { AdaptiveCard, Container } from '@/components/shared'
import Loading from '@/components/shared/Loading'
import {
  Button,
  Form,
  FormItem,
  Input,
  InputCurrency,
  InputGroup,
} from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import {
  CreateCommissionSchema,
  useCommissionForm,
} from '@/pages/master/setting/others/commission/validation'
import {
  CommissionSettingType,
  CreateCommissionSetting,
} from '@/services/api/@types/settings/commissions'
import {
  apiCreateCommissionSetting,
  apiGetCommissionList,
  apiUpdateCommissionSetting,
} from '@/services/api/settings/commission'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import LayoutOtherSetting from '../Layout'

const CommissionSetting = () => {
  const [formType, setFormType] = React.useState<'create' | 'update'>('update')
  const formProps = useCommissionForm()
  const queryClient = useQueryClient()
  const club = useSessionUser((state) => state.club)
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = formProps
  const watchData = watch()

  const { isLoading } = useQuery({
    queryKey: [QUERY_KEY.commissionSetting],
    queryFn: async () => {
      const res = await apiGetCommissionList()
      const commissionSetting = res.data[0] as CommissionSettingType | undefined
      if (commissionSetting) {
        setFormType('update')
        formProps.setValue('id', commissionSetting.id)
        formProps.setValue('club_id', commissionSetting.club_id)
        formProps.setValue('sales', commissionSetting.sales)
        formProps.setValue('sales_type', commissionSetting.sales_type)
        formProps.setValue('service', commissionSetting.service)
        formProps.setValue('session', commissionSetting.session)
        formProps.setValue('class', commissionSetting.class)
      }
      return res
    },
  })

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.commissionSetting] })
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateCommissionSetting) =>
      apiCreateCommissionSetting(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateCommissionSetting) =>
      apiUpdateCommissionSetting(Number(watchData.id), data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<CreateCommissionSchema> = (data) => {
    if (formType === 'update') {
      update.mutate({
        club_id: club?.id as number,
        sales: data.sales,
        sales_type: data.sales_type as 'percent' | 'nominal',
        service: data.service,
        session: data.session,
        class: data.class,
      })
      return
    }
    if (formType === 'create') {
      create.mutate({
        club_id: club?.id as number,
        sales: data.sales,
        sales_type: data.sales_type as 'percent' | 'nominal',
        service: data.service,
        session: data.session,
        class: data.class,
      })
      return
    }
  }

  return (
    <LayoutOtherSetting>
      <Loading loading={isLoading}>
        <Container>
          <AdaptiveCard>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h3>Pengaturan Komisi</h3>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                      label="Sales"
                      invalid={
                        Boolean(errors.sales) || Boolean(errors.sales_type)
                      }
                      errorMessage={
                        errors.sales?.message || errors.sales_type?.message
                      }
                      labelClass="w-full flex justify-between items-center"
                      extraType="start"
                    >
                      <Controller
                        name="sales"
                        control={control}
                        render={({ field }) => {
                          return (
                            <InputGroup>
                              {watchData.sales_type === 'nominal' ? (
                                <InputCurrency
                                  placeholder="Rp. 0"
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
                                  watchData.sales_type === 'percent'
                                    ? 'solid'
                                    : 'default'
                                }
                                onClick={() => {
                                  formProps.setValue('sales_type', 'percent')
                                  // formProps.setValue('sales', 0)
                                }}
                              >
                                %
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  watchData.sales_type === 'nominal'
                                    ? 'solid'
                                    : 'default'
                                }
                                onClick={() => {
                                  formProps.setValue('sales_type', 'nominal')
                                  // formProps.setValue('sales', 0)
                                }}
                              >
                                Rp
                              </Button>
                            </InputGroup>
                          )
                        }}
                      />
                    </FormItem>
                    <FormItem
                      label="Service"
                      invalid={Boolean(errors.service)}
                      errorMessage={errors.service?.message}
                    >
                      <Controller
                        name="service"
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
                      label="Session"
                      invalid={Boolean(errors.session)}
                      errorMessage={errors.session?.message}
                    >
                      <Controller
                        name="session"
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
                      label="Class"
                      invalid={Boolean(errors.class)}
                      errorMessage={errors.class?.message}
                    >
                      <Controller
                        name="class"
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
                  </div>
                  <div className="text-right mt-6 flex justify-end items-center gap-2">
                    <Button
                      variant="solid"
                      type="submit"
                      loading={create.isPending || update.isPending}
                    >
                      Simpan
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </AdaptiveCard>
        </Container>
      </Loading>
    </LayoutOtherSetting>
  )
}

export default CommissionSetting
