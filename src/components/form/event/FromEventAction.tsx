import {
  CreateEventSchemaType,
  initialEventValues,
  validationEventSchema,
} from '@/components/form/event/events'
import { Button, Form } from '@/components/ui'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import FormEvent from './FormEvent'

const FromEventAction = () => {
  const defaultValue = {
    ...initialEventValues,
    club_id: 1,
    // class_id: null,
    // history_id: null,
    type: 'update', // 'update', 'delete'
    event_type: 'other', // 'package', 'other'
  }
  const formProps = useForm({
    resolver: yupResolver(validationEventSchema),
    defaultValues: {
      ...defaultValue,
    },
  })

  const {
    watch,
    formState: { errors },
  } = formProps

  console.log('formProps', { watch: watch(), errors })

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ]

  const onSubmit: SubmitHandler<CreateEventSchemaType> = (data) => {
    console.log('data', data)
  }

  return (
    <Form onSubmit={formProps.handleSubmit(onSubmit)}>
      <FormEvent
        formProps={formProps as any}
        frequencyOptions={frequencyOptions}
      />
      <Button
        type="submit"
        className="mt-5"
        size="lg"
        disabled={formProps.formState.isSubmitting}
      >
        Save
      </Button>
    </Form>
  )
}

export default FromEventAction
