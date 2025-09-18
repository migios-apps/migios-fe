import { TableQueries } from '@/@types/common'
import { DebounceInput } from '@/components/shared'
import { Avatar, Button, Checkbox, Dialog, Skeleton } from '@/components/ui'
import CloseButton from '@/components/ui/CloseButton'
import cn from '@/components/ui/utils/classNames'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { CheckCode, CheckInPayload } from '@/services/api/@types/attendance'
import { apiGetMemberPackages } from '@/services/api/MembeService'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { SearchNormal1 } from 'iconsax-react'
import React from 'react'

type DialogMultiSelectPackageProps = {
  data?: CheckCode | null
  open: boolean
  onClose: () => void
  onSubmit: (data: CheckInPayload['package']) => void
}

const DialogMultiSelectPackage: React.FC<DialogMultiSelectPackageProps> = ({
  open,
  onClose,
  data,
  onSubmit,
}) => {
  const [selectedId, setSelectedId] = React.useState<
    (CheckInPayload['package'][0] & { id: number })[]
  >([])
  const [tableData, setTableData] = React.useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })

  const {
    data: memberPackages,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.memberPackages, tableData, data?.code],
    initialPageParam: 1,
    enabled: open && !!data?.code,
    queryFn: async () => {
      const res = await apiGetMemberPackages(`${data?.code}`, {
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
            search_column: 'duration_status_code',
            search_condition: '=',
            search_text: '1',
          },
          ...(tableData.query === ''
            ? [{}]
            : ([
                {
                  search_column: 'package.name',
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

  const memberPackageList = React.useMemo(
    () =>
      memberPackages
        ? memberPackages.pages.flatMap((page) => page.data.data)
        : [],
    [memberPackages]
  )
  const total = memberPackages?.pages[0]?.data.meta.total
  return (
    <Dialog
      //   scrollBody
      contentClassName="!p-0"
      closable={false}
      isOpen={open}
      width={620}
      onClose={onClose}
      //   onRequestClose={onClose}
    >
      <div className="p-6 rounded-tl-2xl rounded-tr-2xl flex justify-between items-center gap-3 border-b bg-primary dark:border-gray-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar size={40} shape="circle" src={data?.photo || ''} />
            <div className="flex flex-col">
              <span className="font-bold text-white">{data?.name}</span>
              <span className="text-sm text-white">{data?.code}</span>
            </div>
          </div>
          <CloseButton
            absolute
            className="ltr:right-6 rtl:left-6 top-4.5"
            onClick={onClose}
          />
        </div>
      </div>
      <div className="px-6 py-4 flex flex-col h-full justify-between">
        <div className="flex justify-between items-center">
          <DebounceInput
            size="sm"
            placeholder="Search package..."
            suffix={<SearchNormal1 color="currentColor" size="24" />}
            handleOnchange={(value) => {
              setTableData({
                ...tableData,
                query: value,
                pageIndex: 1,
              })
            }}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex justify-between items-center gap-3">
            <div className="flex-1">
              <div className="font-bold text-lg">Select All</div>
            </div>
            <Checkbox
              checked={
                selectedId.length === memberPackageList.length &&
                memberPackageList.length > 0
              }
              onChange={(value: boolean) => {
                setSelectedId(
                  value
                    ? memberPackageList.map((item) => ({
                        id: item.id,
                        member_package_id: item.id as number,
                        member_class_id: item.class_id,
                      }))
                    : []
                )
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            {memberPackageList.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex justify-between items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-lg p-4',
                  selectedId.some((selected) => selected.id === item.id) &&
                    'bg-primary-subtle border-primary dark:border-primary'
                )}
              >
                <div className="flex-1">
                  <div className="font-semibold text-lg dark:text-white">
                    {item.package?.name}
                  </div>
                  <div className="text-sm dark:text-white">
                    Experied at {dayjs(item.end_date).format('DD MMM YYYY')}
                  </div>
                </div>
                <Checkbox
                  checked={selectedId.some(
                    (selected) => selected.id === item.id
                  )}
                  onChange={(
                    value: boolean,
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    setSelectedId(
                      value
                        ? [
                            ...selectedId,
                            {
                              id: item.id,
                              member_package_id: item.package_id as number,
                              member_class_id: item.class_id,
                            },
                          ]
                        : selectedId.filter(
                            (selected) => selected.id !== item.id
                          )
                    )
                  }}
                />
              </div>
            ))}

            {isFetchingNextPage || isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-3 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                  >
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="text-right mt-6">
          <Button
            disabled={selectedId.length === 0}
            variant="solid"
            className="rounded-full"
            onClick={() => {
              onSubmit(
                selectedId.map((item) => ({
                  member_package_id: item.member_package_id,
                  member_class_id: item.member_class_id,
                }))
              )
              onClose()
              setSelectedId([])
            }}
          >
            Check in with {selectedId.length} packages
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default DialogMultiSelectPackage
