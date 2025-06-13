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
import {
  CheckCode,
  CheckInPayload,
  CheckMemberCodePayload,
  CheckOutPayload,
} from '@/services/api/@types/attendance'
import {
  apiCheckIn,
  apiCheckMemberCode,
  apiCheckOut,
  apiGetMemberAttendanceList,
} from '@/services/api/Attendance'
import handleApiError from '@/services/handleApiError'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Camera, Scan, SearchNormal1 } from 'iconsax-react'
import React, { useMemo, useState } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom'
import DialogMultiSelectPackage from './DialogMultiSelectPackage'
import {
  CheckInFormSchema,
  resetCheckInValidation,
  useCheckInValidation,
} from './validation'

const CheckIn = () => {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState('')
  const [scanValue, setScanValue] = useState<string>('')
  const [tabName, setTabName] = React.useState<'code' | 'qr'>('code')
  const [member, setMember] = useState<CheckCode | null>(null)
  const [openMultiSelectPackage, setOpenMultiSelectPackage] = useState(false)
  const [tableDataNotCheckIn, setTableDataNotCheckIn] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 8,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })
  const [tableDataCheckIn, setTableDataCheckIn] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })

  const formPorps = useCheckInValidation()
  const {
    control,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit: handleSubmitCheckMemberCode,
  } = formPorps

  const {
    data: memberNotCheckIn,
    isFetchingNextPage: isFetchingMemberNotCheckIn,
    isLoading: isLoadingMemberNotCheckIn,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.memberAttendance, tableDataNotCheckIn],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMemberAttendanceList({
        page: tableDataNotCheckIn.pageIndex,
        per_page: tableDataNotCheckIn.pageSize,
        date: dayjs().startOf('day').format('YYYY-MM-DD'),
        ...(tableDataNotCheckIn.sort?.key !== ''
          ? {
              sort_column: tableDataNotCheckIn.sort?.key as string,
              sort_type: tableDataNotCheckIn.sort?.order as 'asc' | 'desc',
            }
          : {
              sort_column: 'id',
              sort_type: 'desc',
            }),
        search: [
          {
            search_column: 'need_checkin',
            search_condition: '=',
            search_text: '1',
          },
          ...(tableDataNotCheckIn.query === ''
            ? ([
                {
                  search_operator: 'and',
                  search_column: 'total_active_package',
                  search_condition: '>',
                  search_text: '0',
                },
                {
                  search_operator: 'and',
                  search_column: 'membership_status_code',
                  search_condition: '=',
                  search_text: '1',
                },
              ] as Filter[])
            : ([
                {
                  search_operator: 'and',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: tableDataNotCheckIn.query,
                },
                {
                  search_operator: 'or',
                  search_column: 'code',
                  search_condition: 'like',
                  search_text: tableDataNotCheckIn.query,
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

  const listDataNotCheckIn = useMemo(
    () =>
      memberNotCheckIn
        ? memberNotCheckIn.pages.flatMap((page) => page.data.data)
        : [],
    [memberNotCheckIn]
  )
  const totalMemberNotCheckIn = memberNotCheckIn?.pages[0]?.data.meta.total ?? 0

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

  const chekMemberCode = useMutation({
    mutationFn: (data: CheckMemberCodePayload) => apiCheckMemberCode(data),
    onError: (error) => {
      const resError = handleApiError(error)
      setErrorMessage(resError.message as any)
    },
    onSuccess: (data) => {
      setErrorMessage('')
      const { member_packages, total_active_package, ...res } = data.data
      setMember(data.data)
      if (total_active_package > 1) {
        setOpenMultiSelectPackage(true)
      } else if (total_active_package === 1) {
        handleCheckIn({
          code: res.code,
          date: dayjs().format('YYYY-MM-DD HH:mm'),
          location_type: 'in',
          package: member_packages.map((pkg) => ({
            member_package_id: pkg.id,
            member_class_id: pkg.class_id,
          })),
        })
      }
    },
  })

  const handleCheckMemberCode = (code: string) => {
    chekMemberCode.mutate({
      code: code,
      date: dayjs().format('YYYY-MM-DD HH:mm'),
    })
  }

  const onSubmitCheckCode: SubmitHandler<CheckInFormSchema> = (data) => {
    setErrorMessage('')
    if (data.code.length) {
      handleCheckMemberCode(data.code)
    }
  }

  const checkIn = useMutation({
    mutationFn: (data: CheckInPayload) => apiCheckIn(data),
    onError: (error) => {
      const resError = handleApiError(error)
      setErrorMessage(resError.message as any)
    },
    onSuccess: (data) => {
      setErrorMessage('')
      resetCheckInValidation(formPorps)
      clearErrors()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.memberAttendance] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.memberAttendance] })
    },
  })

  const handleCheckIn = (data: CheckInPayload) => {
    checkIn.mutate(data)
  }

  const checkOut = useMutation({
    mutationFn: (data: CheckOutPayload) => apiCheckOut(data),
    onError: (error) => {
      const resError = handleApiError(error)
      setErrorMessage(resError.message as any)
    },
    onSuccess: (data) => {
      setErrorMessage('')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.memberAttendance] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.memberAttendance] })
    },
  })

  const handleCheckOut = (data: CheckOutPayload) => {
    checkOut.mutate(data)
  }

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Check-In</h3>
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
                        onSubmit={handleSubmitCheckMemberCode(
                          onSubmitCheckCode
                        )}
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
                        <h6 className="w-full">{`Members hasn't check in (${totalMemberNotCheckIn})`}</h6>
                        <DebounceInput
                          size="sm"
                          placeholder="Search (name,code)..."
                          suffix={
                            <SearchNormal1 color="currentColor" size="24" />
                          }
                          handleOnchange={(value) => {
                            setTableDataNotCheckIn({
                              ...tableDataNotCheckIn,
                              query: value,
                              pageIndex: 1,
                            })
                          }}
                        />
                      </div>
                      <ScrollArea className="h-[calc(100vh-31rem)]">
                        <div className="space-y-4 pr-3">
                          {listDataNotCheckIn.map((member, index) => (
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
                                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {member?.name}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-100">
                                    {member?.code}
                                  </span>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="default"
                                className="py-0 px-2 h-8"
                                onClick={() =>
                                  handleCheckMemberCode(member.code)
                                }
                              >
                                Check In
                              </Button>
                            </div>
                          ))}

                          {isFetchingMemberNotCheckIn ||
                          isLoadingMemberNotCheckIn
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
                                  handleCheckMemberCode(value)
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
                content: `Members Check-ins (${totalMemberCheckIn})`,
                extra: (
                  <DebounceInput
                    size="sm"
                    placeholder="Search (name,code)..."
                    suffix={<SearchNormal1 color="currentColor" size={24} />}
                    handleOnchange={(value) => {
                      setTableDataCheckIn({
                        ...tableDataCheckIn,
                        query: value,
                        pageIndex: 1,
                      })
                    }}
                  />
                ),
                bordered: false,
              }}
            >
              <ScrollArea className="h-[calc(100vh-25rem)]">
                <div className="space-y-4">
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
                      {/* <Button
                        type="button"
                        variant="default"
                        className="py-0 px-2 h-8"
                        onClick={() => {
                          handleCheckOut({
                            code: member.code,
                            date: dayjs().format('YYYY-MM-DD HH:mm'),
                          })
                        }}
                      >
                        Check Out
                      </Button> */}
                    </div>
                  ))}

                  {isFetchingMemberCheckIn || isLoadingMemberCheckIn
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
              <Link
                to={'/attendance/history'}
                className="w-full flex mt-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                ALL CHECK-INS
              </Link>
            </Card>
          </div>
          <DialogMultiSelectPackage
            data={member}
            open={openMultiSelectPackage}
            onClose={() => setOpenMultiSelectPackage(false)}
            onSubmit={(value) => {
              handleCheckIn({
                code: member!.code,
                date: dayjs().format('YYYY-MM-DD HH:mm'),
                location_type: 'in',
                package: value,
              })
            }}
          />
        </div>
      </AdaptiveCard>
    </Container>
  )
}

export default CheckIn
