import { TableQueries } from '@/@types/common'
import {
  AdaptiveCard,
  Container,
  DebounceInput,
  UsersAvatarGroup,
} from '@/components/shared'
import DataTable, { DataTableColumnDef } from '@/components/shared/DataTable'
import { Button, Pagination, Select, Tooltip } from '@/components/ui'
import { paginationOptions } from '@/constants'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { Role } from '@/services/api/@types/settings/role'
import { apiGetRoleList } from '@/services/api/settings/Role'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Add, Eye } from 'iconsax-react'
import React from 'react'
import { TbArrowRight, TbLayoutGrid, TbSearch, TbTable } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import DrawerDetail from './components/DrawerDetail'

const RolesPermissions = () => {
  const navigate = useNavigate()
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
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid')
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null)
  const [showDrawerDetail, setShowDrawerDetail] = React.useState<boolean>(false)

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.rolesPermissions, tableData],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetRoleList({
        page: tableData.pageIndex,
        per_page: tableData.pageSize,
        ...(tableData.sort?.key !== ''
          ? {
              sort_column: tableData.sort?.key as string,
              sort_type: tableData.sort?.order as 'asc' | 'desc',
            }
          : {
              sort_column: 'id',
              sort_type: 'asc',
            }),
        search: [
          ...((tableData.query === ''
            ? []
            : [
                {
                  search_column: 'display_name',
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

  const columns = React.useMemo<DataTableColumnDef<Role>[]>(
    () => [
      {
        accessorKey: 'display_name',
        header: 'Name',
      },
      {
        accessorKey: 'users',
        header: 'Users',
        cell: ({ row }) => {
          return (
            <UsersAvatarGroup
              avatarProps={{
                className:
                  'cursor-pointer -mr-2 border-2 border-white dark:border-gray-500',
                size: 28,
              }}
              avatarGroupProps={{ maxCount: 3 }}
              chained={false}
              imgKey="photo"
              nameKey="name"
              users={row.original.users as any}
            />
          )
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        enableColumnActions: false,
      },
      {
        id: 'actions',
        header: '',
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
                    setSelectedRole(row.original)
                    setShowDrawerDetail(true)
                  }}
                >
                  <Eye color="currentColor" size={24} />
                </div>
              </Tooltip>
            </div>
          )
        },
      },
    ],

    []
  )

  return (
    <>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Roles & Permissions</h3>
              <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Button
                      variant={viewMode === 'grid' ? 'solid' : 'default'}
                      className="rounded-tr-none rounded-br-none"
                      size="sm"
                      icon={<TbLayoutGrid className="text-lg" />}
                      onClick={() => setViewMode('grid')}
                    />
                    <Button
                      variant={viewMode === 'table' ? 'solid' : 'default'}
                      className="rounded-tl-none rounded-bl-none"
                      size="sm"
                      icon={<TbTable className="text-lg" />}
                      onClick={() => setViewMode('table')}
                    />
                  </div>
                </div>
                <DebounceInput
                  placeholder="Search"
                  suffix={<TbSearch className="text-lg" />}
                  className="w-fit"
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
                    <Add
                      color="currentColor"
                      size={24}
                      className="w-5 h-5 mr-1"
                    />
                  }
                  onClick={() => {
                    navigate(`/settings/roles-permissions/create`)
                  }}
                >
                  Add new
                </Button>
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {listData.map((role) => (
                  <div
                    key={role.id}
                    className="flex flex-col justify-between rounded-2xl p-5 bg-gray-100 dark:bg-gray-700 min-h-[140px]"
                  >
                    <div className="flex items-center justify-between">
                      <h6 className="font-bold">{role.display_name}</h6>
                    </div>
                    <p className="mt-2">{role.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-col">
                        <div className="-ml-2">
                          <UsersAvatarGroup
                            avatarProps={{
                              className:
                                'cursor-pointer -mr-2 border-2 border-white dark:border-gray-500',
                              size: 28,
                            }}
                            avatarGroupProps={{ maxCount: 3 }}
                            chained={false}
                            imgKey="photo"
                            nameKey="name"
                            users={role.users as any}
                          />
                        </div>
                      </div>
                      <Button
                        variant="plain"
                        size="sm"
                        className="py-0 h-auto"
                        icon={<TbArrowRight />}
                        iconAlignment="end"
                        onClick={() => {
                          setSelectedRole(role)
                          setShowDrawerDetail(true)
                        }}
                      >
                        Edit role
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center flex-col md:flex-row md:justify-between items-center gap-2 mt-3">
              <div style={{ minWidth: 150 }}>
                <Select
                  size="sm"
                  className="w-full"
                  menuPlacement="top"
                  isSearchable={false}
                  defaultValue={paginationOptions[0]}
                  value={paginationOptions.find(
                    (option) => option.value === tableData.pageSize
                  )}
                  options={paginationOptions}
                  onChange={(selected) => {
                    setTableData({
                      ...tableData,
                      pageSize: selected?.value,
                      pageIndex: 1,
                    })
                  }}
                />
              </div>
              <Pagination
                displayTotal
                total={total}
                pageSize={tableData.pageSize}
                currentPage={tableData.pageIndex}
                onChange={(value) => {
                  setTableData({
                    ...tableData,
                    pageIndex: value,
                  })
                }}
              />
            </div>

            {viewMode === 'table' && (
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
                  //   pinnedColumns={{
                  //     right: ['actions'],
                  //   }}
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
            )}
          </div>
        </AdaptiveCard>
      </Container>

      <DrawerDetail
        role={selectedRole!}
        isOpen={showDrawerDetail}
        onDrawerClose={() => setShowDrawerDetail(false)}
      />
    </>
  )
}

export default RolesPermissions
