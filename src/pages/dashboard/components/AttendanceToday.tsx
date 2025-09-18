import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Avatar } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { MemberAttendanceLogType } from '@/services/api/@types/attendance'
import { apiGetMemberAttendanceLogList } from '@/services/api/Attendance'
import { useInfiniteQuery } from '@tanstack/react-query'

const { Tr, Td, TBody, THead, Th } = Table

const orderStatusColor: Record<
  string,
  { label: string; dotClass: string; textClass: string }
> = {
  checkin: {
    label: 'Checked In',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-500',
  },
  checkout: {
    label: 'Checked Out',
    dotClass: 'bg-red-500',
    textClass: 'text-red-500',
  },
}

const OrderColumn = ({ row }: { row: MemberAttendanceLogType }) => {
  const navigate = useNavigate()

  const handleView = useCallback(() => {
    navigate(`/members/details/${row.code}`)
  }, [navigate, row])

  return (
    <div
      className="group cursor-pointer flex items-center gap-2"
      onClick={handleView}
    >
      <Avatar size={40} shape="circle" src={row.photo || ''} />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary">
          {row.name}
        </span>
        <span className="text-sm text-gray-500 font-semibold">{row.code}</span>
      </div>
    </div>
  )
}

const columnHelper = createColumnHelper<MemberAttendanceLogType>()

const columns = [
  columnHelper.accessor('id', {
    header: 'Member',
    cell: (props) => <OrderColumn row={props.row.original} />,
  }),
  columnHelper.accessor('date', {
    header: 'Tanggal',
    cell: (props) => {
      const row = props.row.original
      return <span>{dayjs(row.date).format('DD MMM YYYY HH:mm')}</span>
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    minSize: 300,
    cell: (props) => {
      const { status } = props.row.original
      return (
        <div className="flex items-center">
          <Badge className={orderStatusColor[status].dotClass} />
          <span
            className={`ml-2 rtl:mr-2 capitalize font-semibold ${orderStatusColor[status].textClass}`}
          >
            {orderStatusColor[status].label}
          </span>
        </div>
      )
    },
  }),
]

const AttendanceToday = () => {
  const navigate = useNavigate()

  const {
    data,
    // isFetchingNextPage,
    // isLoading
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.memberAttendanceLog],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMemberAttendanceLogList({
        page: 1,
        per_page: 6,
        search: [
          {
            search_column: 'date',
            search_condition: '>=',
            search_text: dayjs().format('YYYY-MM-DD'),
          },
          {
            search_operator: 'and',
            search_column: 'date',
            search_condition: '<=',
            search_text: dayjs().format('YYYY-MM-DD'),
          },
        ],
      })
      return res
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.page !== lastPage.data.meta.total_page
        ? lastPage.data.meta.page + 1
        : undefined,
  })

  const listData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )

  const table = useReactTable({
    data: listData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <div className="flex flex-col">
          <h4>Daftar kehadiran hari ini</h4>
          <p>Menampilkan daftar member check-in / check-out hari ini</p>
        </div>
        <Button size="sm" onClick={() => navigate('/attendance/history')}>
          Lihat semua
        </Button>
      </div>
      <Table>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                )
              })}
            </Tr>
          ))}
        </THead>
        <TBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </TBody>
      </Table>
    </Card>
  )
}

export default AttendanceToday
