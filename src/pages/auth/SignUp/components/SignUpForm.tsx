import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import { PhoneInput } from '@/components/ui'

interface SignUpFormProps extends CommonProps {
  disableSubmit?: boolean
  setMessage?: (message: string) => void
}

type SignUpFormSchema = {
  name: string
  password: string
  email: string
  phone: string
  confirmPassword: string
}

const validationSchema: ZodType<SignUpFormSchema> = z
  .object({
    name: z.string({ required_error: 'Please enter your name' }),
    email: z.string({ required_error: 'Please enter your email' }),
    phone: z.string({ required_error: 'Please enter your phone number' }),
    password: z.string({ required_error: 'Password Required' }),
    confirmPassword: z.string({
      required_error: 'Confirm Password Required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password not match',
    path: ['confirmPassword'],
  })

const SignUpForm = (props: SignUpFormProps) => {
  const { disableSubmit = false, className, setMessage } = props

  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const { signUp } = useAuth()

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(validationSchema),
  })

  const onSignUp = async (values: SignUpFormSchema) => {
    const { name, password, email, phone } = values

    if (!disableSubmit) {
      setSubmitting(true)
      const result = await signUp({
        name,
        password,
        email,
        phone,
      })

      if (result?.status === 'failed') {
        setMessage?.(result.message)
      }

      setSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit(onSignUp)}>
        <FormItem
          label="Full Name"
          invalid={Boolean(errors.name)}
          errorMessage={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Full Name"
                autoComplete="off"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Email"
          invalid={Boolean(errors.email)}
          errorMessage={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                placeholder="Email"
                autoComplete="off"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          asterisk
          label="Phone Number"
          invalid={Boolean(errors.phone)}
          errorMessage={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput placeholder="+62 *** *** ***" {...field} />
            )}
          />
        </FormItem>
        <FormItem
          label="Password"
          invalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                type="password"
                autoComplete="off"
                placeholder="Password"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Confirm Password"
          invalid={Boolean(errors.confirmPassword)}
          errorMessage={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                type="password"
                autoComplete="off"
                placeholder="Confirm Password"
                {...field}
              />
            )}
          />
        </FormItem>
        <Button block loading={isSubmitting} variant="solid" type="submit">
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </Form>
    </div>
  )
}

export default SignUpForm
