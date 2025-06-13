import { TableQueries } from '@/@types/common'
import CategoryForm from '@/components/form/finance/CategoryForm'
import {
  resetCategoryForm,
  useCategoryForm,
} from '@/components/form/finance/financeValidation'
import { DebounceInput } from '@/components/shared'
import DataTable, { DataTableColumnDef } from '@/components/shared/DataTable'
import { Button, Tooltip } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { CategoryDetail } from '@/services/api/@types/finance'
import { apiGetCategoryList } from '@/services/api/FinancialService'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Add, Edit } from 'iconsax-react'
import React from 'react'
import { TbSearch } from 'react-icons/tb'
import LayoutFinance from '../Layout'

const Category = () => {
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

  const formProps = useCategoryForm()

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.financialCategory, tableData],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetCategoryList({
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

  const columns = React.useMemo<DataTableColumnDef<CategoryDetail>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        enableColumnActions: false,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        enableColumnActions: false,
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 10,
        maxSize: 10,
        minSize: 10,
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
                    formProps.setValue('type', row.original.type)
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
    <LayoutFinance>
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
              resetCategoryForm(formProps)
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
        <CategoryForm
          open={showForm}
          type={formType}
          formProps={formProps}
          onClose={() => setShowForm(false)}
        />
      </div>
    </LayoutFinance>
  )
}

export default Category
