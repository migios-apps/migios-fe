import { Button, Dialog, Form } from '@/components/ui'
import React, { useEffect } from 'react'
import FormEvent from '../event/FormEvent'
import {
  validationEventSchema,
  initialEventValues,
  CreateEventSchemaType,
  EventType,
} from '@/components/form/event/events'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ReturnClassPageFormSchema } from './validation'
import { useSessionUser } from '@/store/authStore'
import dayjs from 'dayjs'

type FormProps = {
  open: boolean
  formProps: ReturnClassPageFormSchema
  onClose: () => void
}

const FormClassEvent: React.FC<FormProps> = ({ open, formProps, onClose }) => {
  const club = useSessionUser((state) => state.club)
  const watchClass = formProps.watch()
  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    // { label: 'Yearly', value: 'yearly' },
  ]
  const defaultValue = {
    ...initialEventValues,
    history_id: null,
    // type: 'update', // 'update', 'delete'
    event_type: EventType.class, // 'package', 'other'
    club_id: club?.id,
    class_id: watchClass?.id,
    title: watchClass.name,
    description: watchClass.description,
  }
  const formEventProps = useForm({
    resolver: yupResolver(validationEventSchema),
    defaultValues: {
      ...defaultValue,
      title: watchClass.name ?? 'Untitled',
      description: watchClass.description ?? '',
    },
  })

  // console.log('formEventProps', {
  //   watch: formEventProps.watch(),
  //   error: formEventProps.formState.errors,
  // })

  useEffect(() => {
    if (open) {
      if (watchClass.events && watchClass.events.length > 0) {
        const event = watchClass.events[0]
        formEventProps.reset(event)

        formEventProps.setValue(
          'start',
          dayjs(event.start).format('YYYY-MM-DD HH:mm')
        )
        formEventProps.setValue(
          'end',
          dayjs(event.end).format('YYYY-MM-DD HH:mm')
        )

        // if (watchClass.name) {
        //   formEventProps.setValue('title', `${watchClass.name}`)
        // }
        // if (watchClass.description) {
        //   formEventProps.setValue('description', watchClass.description)
        // }
      } else {
        formEventProps.reset(defaultValue)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onSubmit: SubmitHandler<CreateEventSchemaType> = (data) => {
    formProps.setValue('events', [
      {
        ...data,
        start: dayjs(data.start).format('YYYY-MM-DD HH:mm'),
        end: dayjs(data.end).format('YYYY-MM-DD HH:mm'),
      },
    ])
    formEventProps.reset(defaultValue)
    onClose()
  }
  return (
    <Dialog
      scrollBody
      width={620}
      isOpen={open}
      onClose={onClose}
      // onRequestClose={handleClose}
    >
      <div className="flex flex-col h-full justify-between">
        <h5 className="mb-4">Event</h5>
        <Form onSubmit={formEventProps.handleSubmit(onSubmit)}>
          <FormEvent
            shwoTitle={false}
            showDescription={false}
            formProps={formEventProps}
            frequencyOptions={frequencyOptions}
          />
          <Button
            type="submit"
            className="mt-5"
            size="lg"
            disabled={formEventProps.formState.isSubmitting}
          >
            Save
          </Button>
        </Form>
      </div>
    </Dialog>
  )
}

export default FormClassEvent
