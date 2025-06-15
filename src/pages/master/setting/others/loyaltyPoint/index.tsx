import { TableQueries } from '@/@types/common'
import Loading from '@/components/shared/Loading'
import {
  Button,
  Card,
  Menu,
  Popover,
  Skeleton,
  Switcher,
} from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { ChangeStatusLoyaltyType } from '@/services/api/@types/settings/loyalty'
import {
  apiChangeStatusLoyalty,
  apiGetLoyaltyList,
} from '@/services/api/settings/LoyaltyService'
import { apiGetSettings } from '@/services/api/settings/settings'
import useInfiniteScroll from '@/utils/hooks/useInfiniteScroll'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { ArrowRight2, Box, SearchStatus1, TicketDiscount } from 'iconsax-react'
import React, { useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import LayoutOtherSetting from '../Layout'
import DialogFormDiscount from './DialogFormDiscount'
import DialogFormFreeItem from './DialogFormFreeItem'
import { resetLoyaltyForm, useLoyaltyForm } from './validation'

const LoyaltyPointSetting = () => {
  const queryClient = useQueryClient()
  const [tableData, setTableData] = React.useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)
  const [showFreeItemDialog, setShowFreeItemDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'create' | 'update'>('create')

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: [QUERY_KEY.settings],
    queryFn: () => apiGetSettings(),
    select: (res) => res.data,
  })

  const { data, isFetchingNextPage, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.loyaltyList, tableData],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const res = await apiGetLoyaltyList({
          page: pageParam,
          per_page: 3,
          sort_column: 'id',
          sort_type: 'desc',
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
  const totalData = data?.pages[0]?.data.meta.total ?? 0

  const { isLoading: isLoadingLoyalty, containerRef: containerRefLoyalty } =
    useInfiniteScroll({
      offset: '100px',
      shouldStop: !hasNextPage || !data || listData.length === 0,
      onLoadMore: async () => {
        if (hasNextPage && data && listData.length > 0) {
          await fetchNextPage()
        }
      },
    })

  const formProps = useLoyaltyForm()

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.loyaltyList] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.settings] })
  }

  const changeStatus = useMutation({
    mutationFn: (data: ChangeStatusLoyaltyType) => apiChangeStatusLoyalty(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const handleToggleLoyalty = (checked: boolean) => {
    changeStatus.mutate({
      loyalty_enabled: checked ? 1 : 0,
    })
  }

  const handleOpenDiscountDialog = () => {
    setDialogType('create')
    resetLoyaltyForm(formProps, {
      type: 'discount',
      name: '',
      enabled: true,
      points_required: 0,
      discount_type: 'percent',
    })
    setShowDiscountDialog(true)
  }

  const handleCloseDiscountDialog = () => {
    resetLoyaltyForm(formProps)
    setShowDiscountDialog(false)
  }

  const handleOpenFreeItemDialog = () => {
    setDialogType('create')
    resetLoyaltyForm(formProps, {
      type: 'free_item',
      name: '',
      enabled: true,
      points_required: 0,
      reward_items: [],
    })
    setShowFreeItemDialog(true)
  }

  const handleCloseFreeItemDialog = () => {
    resetLoyaltyForm(formProps)
    setShowFreeItemDialog(false)
  }

  return (
    <LayoutOtherSetting>
      <Loading loading={isLoading}>
        <div className="flex flex-col gap-2 max-w-2xl mx-auto">
          <Card>
            <div className="flex justify-between items-center py-3 px-4">
              <h4 className="text-xl font-semibold">Point Loyalitas</h4>
              <Switcher
                disabled={changeStatus.isPending || settingsLoading}
                checked={settingsData?.loyalty_enabled === 1}
                onChange={handleToggleLoyalty}
              />
            </div>
          </Card>

          <div
            ref={containerRefLoyalty}
            className="overflow-y-auto mt-3"
            style={{ height: 'calc(70vh - 0px)' }}
          >
            <div className="grid grid-cols-1 gap-4 mb-4">
              {data?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.data.data.map((item, index: number) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        setDialogType('update')
                        formProps.setValue('id', item.id)
                        formProps.setValue('name', item.name)
                        formProps.setValue(
                          'type',
                          item.type as 'discount' | 'free_item'
                        )
                        formProps.setValue(
                          'points_required',
                          item.points_required
                        )
                        formProps.setValue(
                          'discount_type',
                          item.discount_type as any
                        )
                        formProps.setValue(
                          'discount_value',
                          item.discount_value as any
                        )
                        formProps.setValue('enabled', item.enabled)
                        formProps.setValue('reward_items', item.items)

                        if (item.type === 'discount') {
                          setShowDiscountDialog(true)
                        } else {
                          setShowFreeItemDialog(true)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center text-lg">
                            {item.type === 'discount' ? (
                              <div className="text-rose-500">
                                <TicketDiscount
                                  size="32"
                                  color="currentColor"
                                  variant="Bold"
                                />
                              </div>
                            ) : (
                              <div className="text-emerald-500">
                                <Box
                                  size="32"
                                  color="currentColor"
                                  variant="Bold"
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">
                              {item.type === 'discount'
                                ? item.discount_type === 'percent'
                                  ? `Diskon ${item.discount_value}%`
                                  : `Diskon ${item.fdiscount_value}`
                                : item.name}
                            </h5>
                            <p className="text-xs text-gray-500">
                              {item.points_required} poin
                            </p>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          <ArrowRight2 size="24" color="currentColor" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </React.Fragment>
              ))}
              {isFetchingNextPage &&
                Array.from({ length: 12 }, (_, i) => i + 1).map((_, i) => (
                  <Skeleton key={i} height={120} className="rounded-xl" />
                ))}
            </div>
            {totalData > 0 && totalData === listData.length && (
              <p className="col-span-full text-center text-gray-300 dark:text-gray-500">
                No more loyalty point to load
              </p>
            )}
            {listData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-100 dark:bg-gray-900 rounded-lg">
                <div className="text-5xl mb-4 text-gray-500 dark:text-gray-200">
                  <SearchStatus1
                    color="currentColor"
                    size="64"
                    variant="Outline"
                  />
                </div>
                <h6 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Belum ada point loyalitas
                </h6>
                <p className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                  Aktifkan atau klik tombol dibawah untuk menambahkan point
                  loyalitas baru
                </p>
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <Popover>
            <Popover.PopoverTrigger asChild>
              <div className="absolute bottom-6 right-6">
                <Button
                  variant="solid"
                  shape="circle"
                  size="md"
                  icon={<HiPlus />}
                />
              </div>
            </Popover.PopoverTrigger>
            <Popover.PopoverContent
              align="end"
              className="bg-white dark:bg-gray-800 shadow-md p-2 rounded-xl border-gray-100 dark:border-gray-700 w-[200px]"
            >
              <Menu>
                <Menu.MenuItem
                  eventKey="discount"
                  onSelect={handleOpenDiscountDialog}
                >
                  <HiPlus /> Diskon
                </Menu.MenuItem>
                <Menu.MenuItem
                  eventKey="free-item"
                  onSelect={handleOpenFreeItemDialog}
                >
                  <HiPlus /> Item Gratis
                </Menu.MenuItem>
              </Menu>
            </Popover.PopoverContent>
          </Popover>

          {/* Dialog untuk menambahkan diskon */}
          <DialogFormDiscount
            formProps={formProps}
            type={dialogType}
            open={showDiscountDialog}
            onClose={handleCloseDiscountDialog}
            onSuccess={() => {
              if (
                dialogType === 'create' &&
                settingsData?.loyalty_enabled === 0
              ) {
                handleToggleLoyalty(true)
              }
            }}
          />

          {/* Dialog untuk menambahkan item gratis */}
          <DialogFormFreeItem
            type={dialogType}
            formProps={formProps}
            open={showFreeItemDialog}
            onClose={handleCloseFreeItemDialog}
            onSuccess={() => {
              if (
                dialogType === 'create' &&
                settingsData?.loyalty_enabled === 0
              ) {
                handleToggleLoyalty(true)
              }
            }}
          />
        </div>
      </Loading>
    </LayoutOtherSetting>
  )
}

export default LoyaltyPointSetting
