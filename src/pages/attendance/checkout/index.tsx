import { TableQueries } from '@/@types/common'
import { AdaptiveCard, Container, DebounceInput } from '@/components/shared'
import { ScrollArea } from '@/components/shared/scroll-area'
import {
  Alert,
  Avatar,
  Button,
  CameraScanner,
  Card,
  Form,
  FormItem,
  Input,
  Skeleton,
  Tabs,
} from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { CheckOutPayload } from '@/services/api/@types/attendance'
import {
  apiCheckOut,
  apiGetMemberAttendanceList,
  apiGetMemberAttendanceLogList,
} from '@/services/api/Attendance'
import handleApiError from '@/services/handleApiError'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import { Camera, Scan, SearchNormal1 } from 'iconsax-react'
import React, { useMemo, useState } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { CheckInFormSchema } from '../checkin/validation'
import { resetCheckOutValidation, useCheckOutValidation } from './validation'

const Checkout = () => {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState('')
  const [scanValue, setScanValue] = useState<string>('')
  const [tabName, setTabName] = React.useState<'code' | 'qr'>('code')
  const [dateRange, setDateRange] = React.useState<{
    start: Dayjs
    end: Dayjs
  }>({
    start: dayjs(),
    end: dayjs(),
  })
  const [openMultiSelectPackage, setOpenMultiSelectPackage] = useState(false)
  const [tableDataCheckIn, setTableDataCheckIn] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 8,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })
  const [tableDataCheckOut, setTableDataCheckOut] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })

  const formPorps = useCheckOutValidation()
  const {
    control,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit: handleSubmitCheckMemberCode,
  } = formPorps

  const {
    data: memberCheckIn,
    isFetchingNextPage: isFetchingMemberCheckIn,
    isLoading: isLoadingMemberCheckIn,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.memberAttendance, tableDataCheckIn],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMemberAttendanceList({
        page: tableDataCheckIn.pageIndex,
        per_page: tableDataCheckIn.pageSize,
        date: dayjs().startOf('day').format('YYYY-MM-DD'),
        ...(tableDataCheckIn.sort?.key !== ''
          ? {
              sort_column: tableDataCheckIn.sort?.key as string,
              sort_type: tableDataCheckIn.sort?.order as 'asc' | 'desc',
            }
          : {
              sort_column: 'attendance_date',
              sort_type: 'desc',
            }),
        search: [
          {
            search_column: 'need_checkin',
            search_condition: '=',
            search_text: '0',
          },
          ...(tableDataCheckIn.query === ''
            ? [{}]
            : ([
                {
                  search_operator: 'and',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: tableDataCheckIn.query,
                },
                {
                  search_operator: 'or',
                  search_column: 'code',
                  search_condition: 'like',
                  search_text: tableDataCheckIn.query,
                },
              ] as Filter[])),
        ],
      })
      return res
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.page !== lastPage.data.meta.total_page
        ? lastPage.data.meta.page + 1
        : undefined,
  })

  const listDataCheckIn = useMemo(
    () =>
      memberCheckIn
        ? memberCheckIn.pages.flatMap((page) => page.data.data)
        : [],
    [memberCheckIn]
  )
  const totalMemberCheckIn = memberCheckIn?.pages[0]?.data.meta.total ?? 0

  const {
    data: memberCheckOut,
    isFetchingNextPage: isFetchingMemberCheckOut,
    isLoading: isLoadingMemberCheckOut,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.memberAttendanceLog, tableDataCheckOut],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMemberAttendanceLogList({
        page: tableDataCheckOut.pageIndex,
        per_page: tableDataCheckOut.pageSize,
        date: dayjs().startOf('day').format('YYYY-MM-DD'),
        ...(tableDataCheckOut.sort?.key !== ''
          ? {
              sort_column: tableDataCheckOut.sort?.key as string,
              sort_type: tableDataCheckOut.sort?.order as 'asc' | 'desc',
            }
          : {
              sort_column: 'id',
              sort_type: 'desc',
            }),
        search: [
          {
            search_column: 'date',
            search_condition: '>=',
            search_text: dateRange.start.format('YYYY-MM-DD'),
          },
          {
            search_operator: 'and',
            search_column: 'date',
            search_condition: '<=',
            search_text: dateRange.end.format('YYYY-MM-DD'),
          },
          ...(tableDataCheckOut.query === ''
            ? [{}]
            : ([
                {
                  search_operator: 'and',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: tableDataCheckOut.query,
                },
                {
                  search_operator: 'or',
                  search_column: 'code',
                  search_condition: 'like',
                  search_text: tableDataCheckOut.query,
                },
              ] as Filter[])),
        ],
      })
      return res
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.page !== lastPage.data.meta.total_page
        ? lastPage.data.meta.page + 1
        : undefined,
  })

  const listDataCheckOut = useMemo(
    () =>
      memberCheckOut
        ? memberCheckOut.pages.flatMap((page) => page.data.data)
        : [],
    [memberCheckOut]
  )
  const totalMemberCheckOut = memberCheckOut?.pages[0]?.data.meta.total ?? 0

  const checkOut = useMutation({
    mutationFn: (data: CheckOutPayload) => apiCheckOut(data),
    onError: (error) => {
      const resError = handleApiError(error)
      setErrorMessage(resError.message as any)
    },
    onSuccess: (data) => {
      resetCheckOutValidation(formPorps)
      clearErrors()
      setErrorMessage('')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.memberAttendance] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.memberAttendanceLog],
      })
    },
  })

  const handleCheckOut = (code: string) => {
    if (code.length) {
      checkOut.mutate({
        code: code,
        date: dayjs().format('YYYY-MM-DD HH:mm'),
      })
    } else {
      setErrorMessage('Please enter member code')
    }
  }

  const onSubmitCheckOut: SubmitHandler<CheckInFormSchema> = (data) => {
    setErrorMessage('')
    if (data.code.length) {
      handleCheckOut(data.code)
    }
  }

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Check-Out</h3>
          </div>
          <div className="flex gap-6 w-full h-[calc(100vh-15rem)] flex-col lg:flex-row">
            <Card
              className="w-full max-w-2xl"
              // bodyClass="pt-0"
              // header={{
              //   content: 'Check-In',
              //   bordered: false,
              // }}
            >
              <Tabs
                className="w-full"
                defaultValue={tabName}
                onChange={(tab) => setTabName(tab as any)}
              >
                <div className="flex justify-center items-center w-full">
                  <Tabs.TabList>
                    <Tabs.TabNav
                      value="code"
                      icon={
                        <Scan color="currentColor" size={24} variant="Bulk" />
                      }
                    >
                      Member code
                    </Tabs.TabNav>
                    <Tabs.TabNav
                      value="qr"
                      icon={
                        <Camera color="currentColor" size={24} variant="Bulk" />
                      }
                    >
                      Camera QR
                    </Tabs.TabNav>
                  </Tabs.TabList>
                </div>
                <div className="pt-6">
                  <Tabs.TabContent value="code">
                    <div className="flex flex-col gap-4">
                      <Form
                        onSubmit={handleSubmitCheckMemberCode(onSubmitCheckOut)}
                      >
                        <FormItem
                          label=""
                          className="mb-0"
                          invalid={Boolean(errors.code)}
                          // errorMessage={errors.code?.message}
                        >
                          <Controller
                            name="code"
                            control={control}
                            render={({ field }) => (
                              <Input
                                autoFocus
                                size="lg"
                                placeholder="Enter member code..."
                                className="text-center rounded-xl border-2 border-primary"
                                prefix={<Scan variant="Bulk" />}
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                      </Form>
                      {errorMessage.length > 0 ? (
                        <Alert showIcon type="danger">
                          {errorMessage}
                        </Alert>
                      ) : null}
                      <div className="h-px bg-gray-200 dark:bg-gray-700 mb-2" />
                      <div className="flex justify-between items-center">
                        <h6 className="w-full">{`Members check-in (${totalMemberCheckIn})`}</h6>
                        <DebounceInput
                          size="sm"
                          placeholder="Search (name,code)..."
                          suffix={
                            <SearchNormal1 color="currentColor" size={24} />
                          }
                          handleOnchange={(value) => {
                            setTableDataCheckIn({
                              ...tableDataCheckIn,
                              query: value,
                              pageIndex: 1,
                            })
                          }}
                        />
                      </div>
                      <ScrollArea className="h-[calc(100vh-31rem)]">
                        <div className="space-y-4 pr-3">
                          {listDataCheckIn.map((member, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar
                                  size={40}
                                  shape="circle"
                                  src={member?.photo || ''}
                                />
                                <div className="flex flex-col">
                                  <div className="font-medium dark:text-white">
                                    {member.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {member.code}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {member.attendance_packages
                                      .map((item) => item.name)
                                      .join(', ')}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {member.attendance_date
                                      ? dayjs(member.attendance_date).format(
                                          'DD MMMM YYYY HH:mm'
                                        )
                                      : '-'}
                                  </div>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="default"
                                className="py-0 px-2 h-8"
                                onClick={() => {
                                  handleCheckOut(member.code)
                                }}
                              >
                                Check Out
                              </Button>
                            </div>
                          ))}

                          {isFetchingMemberCheckIn || isLoadingMemberCheckIn
                            ? Array.from({ length: 3 }).map((_, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3"
                                >
                                  <div className="flex items-center gap-2">
                                    <Skeleton
                                      variant="circle"
                                      className="h-10 w-10"
                                    />
                                    <div className="flex-1 space-y-2">
                                      <Skeleton className="h-6 w-32" />
                                      <Skeleton className="h-4 w-48" />
                                    </div>
                                  </div>
                                  <Skeleton
                                    variant="circle"
                                    className="h-7 w-16"
                                  />
                                </div>
                              ))
                            : null}
                        </div>
                      </ScrollArea>
                    </div>
                  </Tabs.TabContent>
                  <Tabs.TabContent value="qr">
                    <div className="flex justify-center items-center w-full">
                      <div className="max-w-xl w-full">
                        <FormItem
                          label=""
                          invalid={errorMessage !== ''}
                          errorMessage={errorMessage}
                        >
                          <CameraScanner
                            allowMultiple={false}
                            paused={tabName !== 'qr'}
                            tracker="boundingBox"
                            onScan={(result) => {
                              const value = result[result.length - 1].rawValue
                              if (scanValue !== value) {
                                setScanValue(value)
                                setTimeout(() => {
                                  handleCheckOut(value)
                                }, 1000)
                              }
                            }}
                            onError={(error) => console.log('error', error)}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </Tabs.TabContent>
                </div>
              </Tabs>
            </Card>

            <Card
              className="w-full"
              header={{
                content: `Members Check-out (${totalMemberCheckOut})`,
                bordered: false,
              }}
            >
              <ScrollArea className="h-[calc(100vh-21rem)]">
                <div className="space-y-4">
                  {listDataCheckOut.map((member, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3"
                    >
                      <div className="w-full flex items-center gap-2">
                        <Avatar
                          size={40}
                          shape="circle"
                          src={member?.photo || ''}
                        />
                        <div className="w-full flex justify-between items-center gap-4">
                          <div className="flex flex-col">
                            <div className="font-medium dark:text-white">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {member.code}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {member.attendance_packages
                                .map((item) => item.name)
                                .join(', ')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {member.date
                                ? dayjs(member.date).format(
                                    'DD MMMM YYYY HH:mm'
                                  )
                                : '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isFetchingMemberCheckOut || isLoadingMemberCheckOut
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-3"
                        >
                          <div className="flex items-center gap-2">
                            <Skeleton variant="circle" className="h-10 w-10" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-6 w-32" />
                              <Skeleton className="h-3 w-48" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </AdaptiveCard>
    </Container>
  )
}

export default Checkout
