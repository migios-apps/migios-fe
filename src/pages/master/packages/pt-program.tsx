import { TableQueries } from '@/@types/common'
import FormPtProgram from '@/components/form/package/FormPtProgram'
import {
  resetPackagePtTrainerForm,
  usePackagePtTrainerForm,
} from '@/components/form/package/package'
import { DataTable, DebounceInput, UsersAvatarGroup } from '@/components/shared'
import { DataTableColumnDef } from '@/components/shared/DataTable'
import { Button, Tag, Tooltip } from '@/components/ui'
import { PackageType } from '@/constants'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { statusColor } from '@/constants/utils'
import { Filter } from '@/services/api/@types/api'
import { PackageDetail } from '@/services/api/@types/package'
import { apiGetPackageList } from '@/services/api/PackageService'
import { useSessionUser } from '@/store/authStore'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Add, Edit } from 'iconsax-react'
import React from 'react'
import { TbSearch } from 'react-icons/tb'
import LayoutPackages from './Layout'

const PTtrainer = () => {
  const club = useSessionUser((state) => state.club)
  const [tableData, setTableData] = React.useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })
  const [showForm, setShowForm] = React.useState<boolean>(false)
  const [formType, setFormType] = React.useState<'create' | 'update'>('create')

  const formProps = usePackagePtTrainerForm()

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.packagePtProgram, tableData],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetPackageList({
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
          {
            search_column: 'type',
            search_condition: '=',
            search_text: PackageType.PT_PROGRAM,
          },
          ...((tableData.query === ''
            ? []
            : [
                {
                  search_operator: 'and',
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

  const columns = React.useMemo<DataTableColumnDef<PackageDetail>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        minSize: 220,
      },
      {
        accessorKey: 'fprice',
        header: 'Price',
      },
      {
        header: 'Discount',
        cell: ({ row }) => {
          const data = row.original
          if (!data.is_promo) return null

          return <>{data.fdiscount}</>
        },
      },
      {
        accessorKey: 'fsell_price',
        header: 'Sell Price',
        minSize: 180,
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        size: 10,
        cell: ({ row }) => {
          return <div className="capitalize">{row.original.fduration}</div>
        },
      },
      {
        accessorKey: 'loyalty_point',
        header: 'Earn Point',
      },
      {
        accessorKey: 'enabled',
        header: 'Status',
        size: 10,
        cell: (props) => {
          const row = props.row.original
          const status = row.enabled ? 'active' : 'inactive'
          return (
            <div className="flex items-center">
              <Tag className={statusColor[status]}>
                <span className="capitalize">{status}</span>
              </Tag>
            </div>
          )
        },
      },
      {
        header: 'Trainer',
        cell: ({ row }) => {
          if (row.original.allow_all_trainer) {
            return (
              <div className="flex items-center">
                <Tag className={statusColor['active']}>
                  <span className="capitalize">All Trainer</span>
                </Tag>
              </div>
            )
          } else {
            return (
              <UsersAvatarGroup
                avatarProps={{
                  className: '-mr-2 border-2 border-white dark:border-500',
                  // size: 28,
                }}
                imgKey="photo"
                avatarGroupProps={{ maxCount: 3 }}
                chained={false}
                users={row.original.trainers as any[]}
              />
            )
          }
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 10,
        enableColumnActions: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Tooltip title="Edit">
                <div
                  className={`text-xl cursor-pointer select-none font-semibold`}
                  role="button"
                  onClick={() => {
                    setShowForm(true)
                    setFormType('update')
                    formProps.setValue('id', row.original.id)
                    formProps.setValue('name', row.original.name)
                    formProps.setValue('price', row.original.price)
                    formProps.setFocus('photo', row.original.photo as any)
                    formProps.setValue('is_promo', row.original.is_promo)
                    formProps.setValue(
                      'discount_type',
                      row.original.discount_type
                    )
                    formProps.setValue('discount', row.original.discount)
                    formProps.setValue(
                      'loyalty_point',
                      row.original.loyalty_point
                    )
                    formProps.setValue('description', row.original.description)
                    // formProps.setValue(
                    //   'max_member',
                    //   row.original.max_member as number
                    // )
                    // formProps.setValue('maxTrainer', row.original.maxTrainer)
                    formProps.setValue('duration', row.original.duration)
                    formProps.setValue(
                      'duration_type',
                      row.original.duration_type
                    )
                    formProps.setValue(
                      'session_duration',
                      row.original.session_duration
                    )
                    formProps.setValue('enabled', row.original.enabled)
                    formProps.setValue(
                      'allow_all_trainer',
                      row.original.allow_all_trainer
                    )
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
    <LayoutPackages>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-4">
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
            onClick={() => {
              resetPackagePtTrainerForm(formProps)
              setShowForm(true)
              setFormType('create')
            }}
          >
            Add new
          </Button>
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

        <FormPtProgram
          open={showForm}
          type={formType}
          formProps={formProps}
          onClose={() => setShowForm(false)}
        />
      </div>
    </LayoutPackages>
  )
}

export default PTtrainer
