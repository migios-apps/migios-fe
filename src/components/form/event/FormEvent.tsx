import {
  ReturnEventSchemaType,
  dayOfWeekOptions,
  endTypeOptions,
  frequencyOptions,
  resetFormByFrequency,
} from '@/components/form/event/events'
import {
  Button,
  Checkbox,
  DatePicker,
  FormItem,
  Input,
  Select,
  TimeInput,
} from '@/components/ui'
import dayjs from 'dayjs'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'

interface FormSectionBaseProps {
  formProps: ReturnEventSchemaType
  frequencyOptions: typeof frequencyOptions
  shwoTitle?: boolean
  showDescription?: boolean
}

const FormEvent: React.FC<FormSectionBaseProps> = ({
  formProps,
  frequencyOptions,
  shwoTitle = true,
  showDescription = true,
}) => {
  const {
    control,
    formState: { errors },
  } = formProps

  const watchData = formProps.watch()

  const {
    fields: selected_weekdays,
    append: appendWeekday,
    remove: removeWeekday,
  } = useFieldArray({
    control,
    name: 'selected_weekdays',
  })

  return (
    <div className="w-full flex flex-col gap-2">
      {shwoTitle ? (
        <FormItem
          label="Title"
          invalid={Boolean(errors.title)}
          errorMessage={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="Event title"
                {...field}
              />
            )}
          />
        </FormItem>
      ) : null}
      {showDescription ? (
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
                placeholder="description"
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </FormItem>
      ) : null}
      {watchData.title && (
        <div
          className="px-2 py-1 rounded-2xl min-w-28 flex flex-col"
          style={{
            backgroundColor: `${watchData.background_color}`,
            color: `${watchData.color}`,
          }}
        >
          <span className="text-base font-semibold">{watchData.title}</span>
          <span>{watchData.description}</span>
        </div>
      )}
      <div className="flex justify-start gap-2 items-center">
        <FormItem
          label="Background Color"
          className="w-full mb-2"
          invalid={Boolean(errors.background_color)}
          errorMessage={errors.background_color?.message}
        >
          <Controller
            name="background_color"
            control={control}
            render={({ field }) => (
              <Input
                type="color"
                placeholder="background color"
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Color"
          className="w-full mb-2"
          invalid={Boolean(errors.color)}
          errorMessage={errors.color?.message}
        >
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <Input
                type="color"
                placeholder="Color"
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </FormItem>
      </div>
      <FormItem
        label="Frequency"
        className="w-full"
        invalid={Boolean(errors.frequency)}
        errorMessage={errors.frequency?.message}
      >
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isSearchable={false}
              placeholder="Please Select"
              value={frequencyOptions.filter(
                (option) => option.value === field.value
              )}
              options={frequencyOptions}
              onChange={(option) => {
                field.onChange(option?.value)
                resetFormByFrequency(formProps, option?.value)
              }}
            />
          )}
        />
      </FormItem>
      {watchData.frequency && (
        <>
          <div className="w-full flex flex-col md:flex-row gap-2">
            <FormItem
              label="Start Date"
              className="w-full"
              invalid={Boolean(errors.start)}
              errorMessage={errors.start?.message}
            >
              <Controller
                name="start"
                control={control}
                render={({ field }) => {
                  if (
                    watchData.frequency === 'hourly' ||
                    watchData.frequency === 'daily'
                  ) {
                    return (
                      <DatePicker.DateTimepicker
                        inputFormat="DD-MM-YYYY HH:mm"
                        amPm={false}
                        placeholder="Start Date"
                        {...field}
                        value={field.value ? dayjs(field.value).toDate() : null}
                      />
                    )
                  } else {
                    return (
                      <DatePicker
                        inputFormat="DD-MM-YYYY"
                        placeholder="Start Date"
                        {...field}
                        value={field.value ? dayjs(field.value).toDate() : null} //dayjs(field.value).toDate()}
                      />
                    )
                  }
                }}
              />
            </FormItem>
            <FormItem
              label="End Date"
              className="w-full"
              invalid={Boolean(errors.end)}
              errorMessage={errors.end?.message}
            >
              <Controller
                name="end"
                control={control}
                render={({ field }) => {
                  if (
                    watchData.frequency === 'hourly' ||
                    watchData.frequency === 'daily'
                  ) {
                    return (
                      <DatePicker.DateTimepicker
                        inputFormat="DD-MM-YYYY HH:mm"
                        amPm={false}
                        placeholder="End Date"
                        {...field}
                        value={field.value ? dayjs(field.value).toDate() : null}
                      />
                    )
                  } else {
                    return (
                      <DatePicker
                        inputFormat="DD-MM-YYYY"
                        placeholder="End Date"
                        {...field}
                        value={field.value ? dayjs(field.value).toDate() : null}
                      />
                    )
                  }
                }}
              />
            </FormItem>
          </div>

          <FormItem
            label="End Type"
            className="w-full"
            invalid={Boolean(errors.end_type)}
            errorMessage={errors.end_type?.message}
          >
            <Controller
              name="end_type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isSearchable={false}
                  placeholder="Please Select"
                  value={endTypeOptions.filter(
                    (option) => option.value === field.value
                  )}
                  options={endTypeOptions}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          {/* {watchData.frequency === 'daily' && (
                <FormItem
                  label="Interval"
                  invalid={Boolean(errors.interval)}
                  errorMessage={errors.interval?.message}
                >
                  <Controller
                    name="interval"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        autoComplete="off"
                        placeholder="Event interval"
                        {...field}
                      />
                    )}
                  />
                </FormItem>
              )} */}
          {watchData.frequency === 'monthly' && (
            <FormItem
              // asterisk
              label="Select Week"
              invalid={Boolean(errors.week_number)}
              errorMessage={errors.week_number?.message}
            >
              <Controller
                name="week_number"
                control={control}
                render={({ field }) => (
                  <Checkbox.Group
                    {...field}
                    value={field.value?.map((n) => String(n))}
                    className="grid grid-cols-2 gap-2"
                    onChange={(val) =>
                      field.onChange(val.map((n) => Number(n)))
                    }
                  >
                    {[1, 2, 3, 4, -1].map((week) => (
                      <Checkbox
                        key={week}
                        name={field.name}
                        value={String(week)}
                      >
                        {week === -1 ? 'Last Week' : `Week ${week}`}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
              />
            </FormItem>
          )}
          {watchData.frequency === 'yearly' && (
            <FormItem
              // asterisk
              label="Select Month"
              invalid={Boolean(errors.selected_months)}
              errorMessage={errors.selected_months?.message}
            >
              <Controller
                name="selected_months"
                control={control}
                render={({ field }) => (
                  <Checkbox.Group
                    {...field}
                    value={field.value?.map((n) => String(n))}
                    className="grid grid-cols-2 md:grid-cols-3 gap-2"
                    onChange={(val) =>
                      field.onChange(val.map((n) => Number(n)))
                    }
                  >
                    {[...Array(12).keys()].map((month) => (
                      <Checkbox
                        key={month}
                        name={field.name}
                        value={String(month)}
                      >
                        {dayjs(new Date(0, month)).format('MMMM')}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
              />
            </FormItem>
          )}

          {(watchData.frequency === 'weekly' ||
            watchData.frequency === 'monthly' ||
            watchData.frequency === 'yearly') && (
            <FormItem
              label="Weekdays"
              {...(selected_weekdays.length === 0
                ? {
                    invalid: Boolean(errors.selected_weekdays),
                    errorMessage:
                      errors.selected_weekdays?.message ??
                      errors.selected_weekdays?.root?.message,
                  }
                : {})}
            >
              <div className="flex flex-col gap-3">
                {selected_weekdays.map((weekday, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-x-2"
                    >
                      <FormItem
                        label=""
                        className="w-full mb-2"
                        invalid={Boolean(
                          errors.selected_weekdays?.[index]?.day_of_week
                        )}
                        errorMessage={
                          errors.selected_weekdays?.[index]?.day_of_week
                            ?.message
                        }
                      >
                        <Controller
                          name={`selected_weekdays.${index}.day_of_week`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isSearchable={false}
                              placeholder="Please Select"
                              value={dayOfWeekOptions.filter(
                                (option) => option.value === field.value
                              )}
                              options={dayOfWeekOptions}
                              onChange={(option) =>
                                field.onChange(option?.value)
                              }
                            />
                          )}
                        />
                      </FormItem>
                      <div className="flex justify-center gap-2 w-full">
                        <div className="flex justify-center gap-2 w-full">
                          <FormItem
                            label=""
                            className="w-full mb-2"
                            invalid={Boolean(
                              errors.selected_weekdays?.[index]?.start_time
                            )}
                            errorMessage={
                              errors.selected_weekdays?.[index]?.start_time
                                ?.message
                            }
                          >
                            <Controller
                              name={`selected_weekdays.${index}.start_time`}
                              control={control}
                              render={({ field }) => {
                                const timeValue = field.value
                                  ? new Date(
                                      `${dayjs().format('YYYY-MM-DD')}T${field.value}:00`
                                    )
                                  : undefined

                                return (
                                  <TimeInput
                                    {...field}
                                    value={timeValue}
                                    onChange={(e) => {
                                      field.onChange(
                                        e ? dayjs(e).format('HH:mm') : undefined
                                      )
                                    }}
                                  />
                                )
                              }}
                            />
                          </FormItem>
                          <FormItem
                            label=""
                            className="w-full mb-2"
                            invalid={Boolean(
                              errors.selected_weekdays?.[index]?.end_time
                            )}
                            errorMessage={
                              errors.selected_weekdays?.[index]?.end_time
                                ?.message
                            }
                          >
                            <Controller
                              name={`selected_weekdays.${index}.end_time`}
                              control={control}
                              render={({ field }) => {
                                const timeValue = field.value
                                  ? new Date(
                                      `${dayjs().format('YYYY-MM-DD')}T${field.value}:00`
                                    )
                                  : undefined

                                return (
                                  <TimeInput
                                    {...field}
                                    value={timeValue}
                                    onChange={(e) => {
                                      field.onChange(
                                        e ? dayjs(e).format('HH:mm') : undefined
                                      )
                                    }}
                                  />
                                )
                              }}
                            />
                          </FormItem>
                        </div>
                        <Button
                          className="w-auto bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 px-3"
                          variant="solid"
                          color="red"
                          type="button"
                          onClick={() => {
                            removeWeekday(index)
                          }}
                        >
                          <Trash
                            color="currentColor"
                            size="24"
                            variant="Outline"
                          />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-col mt-4">
                <Button
                  className="w-full"
                  type="button"
                  onClick={() => {
                    appendWeekday({
                      day_of_week: '',
                      start_time:
                        watchData?.selected_weekdays?.[0]?.start_time || '',
                      end_time:
                        watchData?.selected_weekdays?.[0]?.end_time || '',
                    })
                  }}
                >
                  Add Weekday Schedule
                </Button>
              </div>
            </FormItem>
          )}
        </>
      )}
    </div>
  )
}

export default FormEvent
