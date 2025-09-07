import { TableQueries } from '@/@types/common'
import {
  AdaptiveCard,
  Container,
  DataTable,
  DebounceInput,
} from '@/components/shared'
import { DataTableColumnDef } from '@/components/shared/DataTable'
import { Button, Tag, Tooltip } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import Tabs from '@/components/ui/Tabs/Tabs'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { paymentStatusColor } from '@/constants/utils'
import { Filter } from '@/services/api/@types/api'
import { SalesType } from '@/services/api/@types/sales'
import { apiGetSalesList } from '@/services/api/SalesService'
import { useSessionUser } from '@/store/authStore'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Add, Edit } from 'iconsax-react'
import React, { useMemo, useState } from 'react'
import { GoDotFill } from 'react-icons/go'
import { TbEye, TbSearch } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const Sales = () => {
  const navigate = useNavigate()
  const [tabName, setTabName] = React.useState('all')
  const club = useSessionUser((state) => state.club)
  const [tableData, setTableData] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.sales, tableData, club.id, tabName],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetSalesList({
        page: tableData.pageIndex,
        per_page: tableData.pageSize,
        ...(tableData.sort?.key !== ''
          ? {
              sort_column: tableData.sort?.key as string,
              sort_type: tableData.sort?.order as 'asc' | 'desc',
            }
          : {
              sort_column: 'id',
              sort_type: 'desc',
            }),
        search: [
          ...(tabName === 'all'
            ? [{}]
            : ([
                {
                  search_column: 'status',
                  search_condition: '=',
                  search_text: tabName,
                },
              ] as Filter[])),
          ...(tableData.query === ''
            ? [{}]
            : ([
                {
                  search_operator: 'and',
                  search_column: 'code',
                  search_condition: 'like',
                  search_text: tableData.query,
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

  const listData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const total = data?.pages[0]?.data.meta.total

  const columns = useMemo<DataTableColumnDef<SalesType>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Faktur',
        size: 10,
        enableColumnActions: false,
      },
      {
        accessorKey: 'due_date',
        header: 'Due Date',
        enableColumnActions: false,
        cell: ({ row }) => {
          return dayjs(row.original.due_date).format('DD-MM-YYYY')
        },
      },
      {
        accessorKey: 'amount',
        header: 'Total',
        size: 10,
        enableColumnActions: false,
        cell: ({ row }) => {
          return row.original.famount
        },
      },
      {
        header: 'Total Bayar',
        size: 10,
        enableColumnActions: false,
        cell: ({ row }) => {
          return row.original.ftotal_payments
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 10,
        enableColumnActions: false,
        cell: ({ row }) => {
          const status = row.original
          return (
            <div className="flex items-center">
              <Tag className={paymentStatusColor[status.status]}>
                <span className="capitalize">{status.fstatus}</span>
              </Tag>
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: 'Aksi',
        size: 10,
        enableColumnActions: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Tooltip title="View">
                <div
                  className={`text-xl cursor-pointer select-none font-semibold`}
                  role="button"
                  onClick={() => {
                    navigate(`/sales/${row.original.code}`)
                  }}
                >
                  <TbEye />
                </div>
              </Tooltip>
              <Tooltip title="Edit">
                <div
                  className={`text-xl cursor-pointer select-none font-semibold`}
                  role="button"
                  onClick={() => {
                    navigate(`/sales/${row.original.code}/edit`)
                  }}
                >
                  <Edit color="currentColor" size={24} />
                </div>
              </Tooltip>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Sales</h3>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <DebounceInput
              placeholder="Quick search..."
              suffix={<TbSearch className="text-lg" />}
              handleOnchange={(value) => {
                setTableData({
                  ...tableData,
                  query: value,
                  pageIndex: 1,
                })
              }}
            />
            <Button
              variant="solid"
              icon={
                <Add color="currentColor" size={24} className="w-5 h-5 mr-1" />
              }
              onClick={() => navigate('/sales/order')}
            >
              Add new
            </Button>
          </div>
          <Tabs defaultValue={tabName} onChange={setTabName}>
            <TabList>
              <TabNav value="all">
                <GoDotFill className="text-primary w-6 h-6" />
                All
              </TabNav>
              <TabNav value="paid">
                <GoDotFill className="text-emerald-200 w-6 h-6" />
                Paid
              </TabNav>
              <TabNav value="unpaid">
                <GoDotFill className="text-yellow-700 w-6 h-6" />
                Unpaid
              </TabNav>
              <TabNav value="part_paid">
                <GoDotFill className="text-yellow-500 w-6 h-6" />
                Outstanding
              </TabNav>
              <TabNav value="void">
                <GoDotFill className="text-red-500 w-6 h-6" />
                Cancelled
              </TabNav>
            </TabList>
            <div className="py-4">
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
                pinnedColumns={{
                  right: ['action'],
                }}
                onPaginationChange={(val) => {
                  setTableData({
                    ...tableData,
                    pageIndex: val,
                  })
                }}
                onSelectChange={(val) => {
                  setTableData({
                    ...tableData,
                    pageSize: val,
                    pageIndex: 1,
                  })
                }}
                onSort={(val) => {
                  setTableData({
                    ...tableData,
                    sort: val,
                  })
                }}
              />
            </div>
          </Tabs>
        </div>
      </AdaptiveCard>
    </Container>
  )
}

export default Sales
