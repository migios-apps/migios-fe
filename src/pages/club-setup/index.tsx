import { useAuth } from '@/auth'
import Logo from '@/components/template/Logo'
import { Button, Steps } from '@/components/ui'
import appConfig from '@/configs/app.config'
import {
  BulkCreateClubDto,
  BulkCreateClubResponse,
} from '@/services/api/@types/club'
import { apiBulkCreateClub } from '@/services/api/ClubService'
import handleApiError from '@/services/handleApiError'
import { useThemeStore } from '@/store/themeStore'
import cn from '@/utils/classNames'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'
import Step5 from './step5'
import {
  FormValues,
  aboutCLubSchema,
  allSchema,
  allaowNextSchema,
  memberSchema,
  profileClubSchema,
  programSchema,
} from './validation'

const { clubsAuthenticatedEntryPath } = appConfig

const Onboarding = () => {
  const { setClubData, signOut, user } = useAuth()
  const total_user_clubs = user?.total_user_clubs ?? 0
  const setWelcome = useThemeStore((state) => state.setWelcome)
  const mode = useThemeStore((state) => state.mode)
  const [activeStep, setActiveStep] = React.useState(0)
  const [formSchema, setFormSchema] = React.useState(allaowNextSchema)

  React.useEffect(() => {
    switch (activeStep) {
      case 0:
        setFormSchema(profileClubSchema)
        break
      case 1:
        setFormSchema(aboutCLubSchema)
        break
      case 2:
        setFormSchema(programSchema)
        break
      case 3:
        setFormSchema(memberSchema)
        break
      default:
        activeStep > 0
          ? setFormSchema(allSchema)
          : setFormSchema(profileClubSchema)
        break
    }
  }, [activeStep])

  const formProps = useForm<FormValues>({
    shouldUnregister: false,
    resolver: yupResolver(formSchema as any),
    mode: 'all',
    defaultValues: {
      // name: 'ok gym',
      // phone: '+628123456789',
      email: user?.email,
      // address: 'Jl. Jend. Sudirman No. 123',
    },
  })

  const { handleSubmit } = formProps

  const handleNext = handleSubmit(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  })

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const createNewClub = useMutation({
    mutationFn: (data: BulkCreateClubDto) => apiBulkCreateClub(data),
    onError: (error) => {
      const resError = handleApiError(error)
      console.log('error create', resError)
    },
    onSuccess: (data: BulkCreateClubResponse) => {
      setWelcome(true)
      setClubData(data.data)
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const body = {
      name: data.name,
      photo: data.photo || null,
      phone: data.phone,
      email: data.email,
      address: data.address,
      about_club: {
        total_staff: data.about_club?.total_staff || null,
        total_member: data.about_club?.total_member || null,
        total_location: data.about_club?.total_location || null,
        how_did_find_us: data.about_club?.how_did_find_us || null,
      },
      programs: data.programs
        ? (data.programs as BulkCreateClubDto['programs'])
        : [],
      members: data.members
        ? (data.members as unknown as BulkCreateClubDto['members'])
        : [],
    }
    createNewClub.mutate(body)
  }

  if (total_user_clubs > 0) {
    return <Navigate replace to={clubsAuthenticatedEntryPath} />
  }

  return (
    <>
      <div className="w-full flex justify-between items-center gap-4 px-4 pt-3 pb-2">
        {activeStep > 0 ? (
          <Button
            variant="plain"
            size="sm"
            onClick={() => {
              handleBack()
            }}
          >
            Kembali
          </Button>
        ) : (
          <div></div>
        )}
        <div className="ltr:right-6 rtl:left-6 top-4.5">
          <div className="flex justify-start gap-4">
            <Button variant="plain" size="sm" onClick={() => signOut()}>
              Keluar
            </Button>
          </div>
        </div>
      </div>
      {activeStep === 4 ? (
        <div className="w-full h-[calc(100vh-300px)] flex justify-center items-center mt-4">
          <Step5 />
        </div>
      ) : (
        <div className="relative flex w-full items-center justify-center bg-white dark:bg-gray-900">
          <div className="w-full p-4 pt-0 z-20">
            <div className="flex flex-col gap-4 justify-center items-center w-full relative">
              <div className="w-full max-w-[35rem] flex flex-col justify-center items-center gap-8">
                <Logo
                  type="streamline"
                  mode={mode}
                  imgClass="mx-auto"
                  logoWidth={80}
                />
                <Steps className="w-full" current={activeStep}>
                  <Steps.Item />
                  <Steps.Item />
                  <Steps.Item />
                  <Steps.Item />
                </Steps>
              </div>
              <div className="w-full flex justify-center items-center mt-4">
                {activeStep === 0 && (
                  <Step1 formProps={formProps} onNext={handleNext} />
                )}
                {activeStep === 1 && (
                  <Step2
                    formProps={formProps}
                    onNext={handleNext}
                    onSkip={() => setActiveStep(2)}
                  />
                )}
                {activeStep === 2 && (
                  <Step3
                    formProps={formProps}
                    onNext={handleNext}
                    onSkip={() => setActiveStep(3)}
                  />
                )}
                {activeStep === 3 && (
                  <Step4
                    formProps={formProps}
                    isLoading={createNewClub.isPending}
                    onFinished={handleSubmit(onSubmit)}
                  />
                )}
                {/* {(activeStep === 4 || activeStep === 5) && <Step5 />} */}
              </div>
            </div>
          </div>
          <div
            className={cn(
              'absolute inset-0',
              '[background-size:20px_20px]',
              '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
              'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
            )}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-gray-900"></div>
        </div>
      )}
    </>
  )
}

export default Onboarding
