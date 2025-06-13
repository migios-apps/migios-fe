import { TableQueries } from '@/@types/common'
import { DebounceInput } from '@/components/shared'
import DataTable, { DataTableColumnDef } from '@/components/shared/DataTable'
import {
  Avatar,
  DatePickerAIO,
  DatePickerAIOPropsValue,
  Tag,
} from '@/components/ui'
import { getMenuShortcutDatePickerByType } from '@/components/ui/hooks/useDatePicker'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { MemberAttendanceLogType } from '@/services/api/@types/attendance'
import { apiGetMemberAttendanceLogList } from '@/services/api/Attendance'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import { TbSearch } from 'react-icons/tb'

const History = () => {
  const [dateRange, setDateRange] = React.useState<{
    start: Dayjs
    end: Dayjs
  }>({ start: dayjs(), end: dayjs() })
  const [tableData, setTableData] = React.useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  })

  const defaultMenu = getMenuShortcutDatePickerByType('all').menu
  const [valueDateRangePicker, setValueDateRangePicker] =
    React.useState<DatePickerAIOPropsValue>({
      type: defaultMenu?.type,
      name: defaultMenu.name,
      date: [
        defaultMenu.options.defaultStartDate,
        defaultMenu.options.defaultEndDate,
      ],
    })

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.memberAttendanceLog, tableData, valueDateRangePicker],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMemberAttendanceLogList({
        page: tableData.pageIndex,
        per_page: tableData.pageSize,
        ...(tableData.sort?.key !== ''
          ? {
              sort_column: tableData.sort?.key as string,
              sort_type: tableData.sort?.order as 'asc' | 'desc',
            }
          : { sort_column: 'id', sort_type: 'desc' }),
        search: [
          ...((valueDateRangePicker.type === 'all'
            ? []
            : [
                {
                  search_column: 'date',
                  search_condition: '>=',
                  search_text: dayjs(valueDateRangePicker.date[0]).format(
                    'YYYY-MM-DD'
                  ),
                },
                {
                  search_operator: 'and',
                  search_column: 'date',
                  search_condition: '<=',
                  search_text: dayjs(valueDateRangePicker.date[1]).format(
                    'YYYY-MM-DD'
                  ),
                },
              ]) as Filter[]),
          ...((tableData.query === ''
            ? []
            : [
                {
                  search_operator: 'and',
                  search_column: 'code',
                  search_condition: 'like',
                  search_text: tableData.query,
                },
                {
                  search_operator: 'or',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: tableData.query,
                },
              ]) as Filter[]),
        ],
      })
      return res
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.page !== lastPage.data.meta.total_page
        ? lastPage.data.meta.page + 1
        : undefined,
  })

  const listData = React.useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const total = data?.pages[0]?.data.meta.total

  const columns = React.useMemo<DataTableColumnDef<MemberAttendanceLogType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row: { original: row } }) => {
          return (
            <div className="flex items-center gap-2">
              <Avatar size={40} shape="circle" src={row.photo || ''} />
              <div className="flex flex-col">
                <span
                  className={`font-semibold text-gray-900 dark:text-gray-100`}
                >
                  {row.name}
                </span>
                <span className="text-sm text-gray-500 font-semibold">
                  {row.code}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
          return dayjs(row.original.date).format('DD MMMM YYYY HH:mm')
        },
      },
      {
        accessorKey: 'location_type',
        header: 'Location',
        cell: ({ row }) => {
          return row.original.location_type === 'in' ? 'In Gym' : 'Outside Gym'
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          return row.original.status === 'checkin' ? (
            <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded">
              Checked In
            </Tag>
          ) : (
            <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
              Checked Out
            </Tag>
          )
        },
      },
      {
        id: 'attendance_packages',
        header: 'Attendance for',
        cell: ({ row }) => {
          return (
            <div className="flex flex-wrap gap-2">
              {row.original.attendance_packages.map((item) => (
                <Tag key={item.id}>{item.name}</Tag>
              ))}
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h3>History Attendance</h3>
        <DatePickerAIO
          variant="range"
          align="end"
          value={valueDateRangePicker}
          onChange={(value) => {
            setValueDateRangePicker(value)
          }}
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-4">
        <DebounceInput
          placeholder="Quick search (member code or name)..."
          suffix={<TbSearch className="text-lg" />}
          handleOnchange={(value) => {
            setTableData({ ...tableData, query: value, pageIndex: 1 })
          }}
        />
      </div>
      <div className="mt-1">
        <DataTable
          columns={columns}
          data={listData}
          noData={!isLoading && listData.length === 0}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          loading={isLoading || isFetchingNextPage}
          pagingData={{
            total: total as number,
            pageIndex: tableData.pageIndex as number,
            pageSize: tableData.pageSize as number,
          }}
          onPaginationChange={(val) => {
            setTableData({ ...tableData, pageIndex: val })
          }}
          onSelectChange={(val) => {
            setTableData({ ...tableData, pageSize: val, pageIndex: 1 })
          }}
          onSort={(val) => {
            setTableData({ ...tableData, sort: val })
          }}
        />
      </div>
    </div>
  )
}

export default History
