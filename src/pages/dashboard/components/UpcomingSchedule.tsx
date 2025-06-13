import Card from '@/components/ui/Card'
import ScrollBar from '@/components/ui/ScrollBar'
import { useState } from 'react'

import {
  Badge,
  Button,
  DatePickerAIO,
  DatePickerAIOPropsValue,
} from '@/components/ui'
import { getMenuShortcutDatePickerByType } from '@/components/ui/hooks/useDatePicker'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { EventsData } from '@/services/api/@types/event'
import { apiGetEventList } from '@/services/api/EventService'
import { useSessionUser } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { isToday } from '../utils'

const ScheduledEvent = (props: EventsData) => {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-3">
        <Badge style={{ backgroundColor: props.background_color }} />
        <div>
          <div className="font-bold heading-text">{props.title}</div>
          <div className="font-normal capitalize">{props.event_type}</div>
        </div>
      </div>
      <div>
        <span className="font-semibold heading-text">
          {props.end && dayjs(props.end).format('hh:mm')}{' '}
        </span>
        <small>{props.end && dayjs(props.end).format('A')}</small>
      </div>
    </div>
  )
}

const UpcomingSchedule = () => {
  const navigate = useNavigate()
  const club = useSessionUser((state) => state.club)
  const defaultMenu = getMenuShortcutDatePickerByType('today').menu
  const [valueDateRangePicker, setValueDateRangePicker] =
    useState<DatePickerAIOPropsValue>({
      type: defaultMenu?.type,
      name: defaultMenu.name,
      date: [
        defaultMenu.options.defaultStartDate,
        defaultMenu.options.defaultEndDate,
      ],
    })

  const {
    data: eventList,
    // isLoading: loadingEvents
  } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [QUERY_KEY.events, valueDateRangePicker],
    enabled:
      !!valueDateRangePicker.date?.[0] && !!valueDateRangePicker.date?.[1],
    queryFn: async () => {
      const res = await apiGetEventList(Number(club.id), {
        start_date: dayjs(valueDateRangePicker.date?.[0]).format('YYYY-MM-DD'),
        end_date: dayjs(valueDateRangePicker.date?.[1]).format('YYYY-MM-DD'),
        show_all: true,
      })
      return res
    },
    select: (res) => res.data.data as EventsData[],
  })

  const handleViewAll = () => {
    navigate('/schedule')
  }

  return (
    <Card>
      <div className="flex flex-col">
        <DatePickerAIO
          variant="single"
          align="end"
          value={valueDateRangePicker}
          onChange={(value) => {
            setValueDateRangePicker(value)
          }}
        />
        <div className="w-full">
          <div className="my-4">
            <h5>
              Scehdule{' '}
              {isToday(dayjs(valueDateRangePicker.date[1]).toDate())
                ? 'today'
                : dayjs(valueDateRangePicker.date?.[1]).format('DD MMM')}
            </h5>
          </div>
          <div className="w-full">
            <ScrollBar className="overflow-y-auto h-[280px] xl:max-w-[280px]">
              <div className="flex flex-col gap-4">
                {eventList?.map((event, index) => (
                  <ScheduledEvent key={index} {...event} />
                ))}
              </div>
            </ScrollBar>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button className="w-full" variant="default" onClick={handleViewAll}>
          View all
        </Button>
      </div>
    </Card>
  )
}

export default UpcomingSchedule
