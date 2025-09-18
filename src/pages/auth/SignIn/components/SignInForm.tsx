import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'
import PasswordInput from '@/components/shared/PasswordInput'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import classNames from '@/utils/classNames'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { ZodType } from 'zod'
import { z } from 'zod'

interface SignInFormProps extends CommonProps {
  disableSubmit?: boolean
  passwordHint?: string | ReactNode
  setMessage?: (message: string) => void
}

type SignInFormSchema = {
  email: string
  password: string
}

const validationSchema: ZodType<SignInFormSchema> = z.object({
  email: z
    .string({ required_error: 'Please enter your email' })
    .min(1, { message: 'Please enter your email' }),
  password: z
    .string({ required_error: 'Please enter your password' })
    .min(1, { message: 'Please enter your password' }),
})

const SignInForm = (props: SignInFormProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const { disableSubmit = false, className, setMessage, passwordHint } = props

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignInFormSchema>({
    defaultValues: {
      email: 'john@example.com',
      password: 'password',
    },
    resolver: zodResolver(validationSchema),
  })

  const { signIn } = useAuth()

  const onSignIn = async (values: SignInFormSchema) => {
    const { email, password } = values

    if (!disableSubmit) {
      setSubmitting(true)

      const result = await signIn({ email, password })

      if (result?.status === 'failed') {
        setMessage?.(result.message)
      }
    }

    setSubmitting(false)
  }

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit(onSignIn)}>
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
          label="Password"
          invalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          className={classNames(
            passwordHint && 'mb-0',
            errors.password?.message && 'mb-8'
          )}
        >
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PasswordInput
                type="text"
                placeholder="Password"
                autoComplete="off"
                {...field}
              />
            )}
          />
        </FormItem>
        {passwordHint}
        <Button block loading={isSubmitting} variant="solid" type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </Form>
    </div>
  )
}

export default SignInForm
