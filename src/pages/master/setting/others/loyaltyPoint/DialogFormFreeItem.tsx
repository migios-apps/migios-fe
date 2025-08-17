import { DebounceInput } from '@/components/shared'
import {
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  InputGroup,
  Skeleton,
  Tabs,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { CreateLoyaltyType } from '@/services/api/@types/settings/loyalty'
import { apiGetPackageList } from '@/services/api/PackageService'
import { apiGetProductList } from '@/services/api/ProductService'
import {
  apiCreateLoyalty,
  apiDeleteLoyalty,
  apiUpdateLoyalty,
} from '@/services/api/settings/LoyaltyService'
import classNames from '@/utils/classNames'
import useInfiniteScroll from '@/utils/hooks/useInfiniteScroll'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Add,
  ArchiveBox,
  Book,
  Box,
  CloseCircle,
  DocumentFilter,
  Minus,
  SearchStatus1,
  Trash,
} from 'iconsax-react'
import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import { TbSearch } from 'react-icons/tb'
import {
  CreateLoyaltySchema,
  ReturnLoyaltyFormSchema,
  resetLoyaltyForm,
} from './validation'

type DialogFormFreeItemProps = {
  formProps: ReturnLoyaltyFormSchema
  type: 'create' | 'update'
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

const DialogFormFreeItem: React.FC<DialogFormFreeItemProps> = ({
  type,
  open,
  onClose,
  formProps,
  onSuccess,
}) => {
  const queryClient = useQueryClient()
  const [showTab, setShowTab] = useState(false)
  const [tab, setTab] = useState<'package' | 'product'>('package')
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = formProps

  const watchData = watch()

  const handleClose = () => {
    setShowTab(false)
    resetLoyaltyForm(formProps)
    onClose()
  }

  const handlePrefecth = () => {
    onSuccess?.()
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.loyaltyList] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateLoyaltyType) => apiCreateLoyalty(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateLoyaltyType) =>
      apiUpdateLoyalty(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteLoyalty(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefecth,
  })

  const handleDelete = () => {
    deleteItem.mutate(watchData.id as number)
    setConfirmDelete(false)
    handleClose()
  }

  const handleFormSubmit = (data: CreateLoyaltySchema) => {
    if (type === 'update') {
      update.mutate({
        name: data.name as string,
        type: 'free_item',
        points_required: data.points_required,
        enabled: data.enabled,
        reward_items: data.reward_items as any[],
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        name: data.name as string,
        type: 'free_item',
        points_required: data.points_required,
        enabled: data.enabled,
        reward_items: data.reward_items as any[],
      })
      return
    }
  }

  const {
    data: packages,
    fetchNextPage: fetchNextPagePackages,
    hasNextPage: hasNextPagePackages,
    isFetchingNextPage: isFetchingNextPagePackages,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.packages, search],
    initialPageParam: 1,
    enabled: !!open,
    queryFn: async ({ pageParam }) => {
      const res = await apiGetPackageList({
        page: pageParam,
        per_page: 3,
        sort_column: 'id',
        sort_type: 'desc',
        search: [
          {
            search_column: 'enabled',
            search_condition: '=',
            search_text: 'true',
          },
          ...((search === ''
            ? []
            : [
                {
                  search_operator: 'and',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: search,
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

  const {
    data: products,
    fetchNextPage: fetchNextPageProducts,
    hasNextPage: hasNextPageProducts,
    isFetchingNextPage: isFetchingNextPageProducts,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.products, search],
    initialPageParam: 1,
    enabled: !!open,
    queryFn: async ({ pageParam }) => {
      const res = await apiGetProductList({
        page: pageParam,
        per_page: 3,
        sort_column: 'id',
        sort_type: 'desc',
        search: [
          ...((search === ''
            ? []
            : [
                {
                  search_operator: 'and',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: search,
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

  const listPackages = React.useMemo(
    () => (packages ? packages.pages.flatMap((page) => page.data.data) : []),
    [packages]
  )
  const totalPackage = packages?.pages[0]?.data.meta.total

  const listProducts = React.useMemo(
    () => (products ? products.pages.flatMap((page) => page.data.data) : []),
    [products]
  )
  const totalProduct = products?.pages[0]?.data.meta.total

  const { containerRef: containerRefPackage } = useInfiniteScroll({
    offset: '100px',
    shouldStop: !hasNextPagePackages || !packages || listPackages.length === 0,
    onLoadMore: async () => {
      if (hasNextPagePackages && packages && listPackages.length > 0) {
        await fetchNextPagePackages()
      }
    },
  })

  const { containerRef: containerRefProduct } = useInfiniteScroll({
    offset: '100px',
    shouldStop: !hasNextPageProducts || !products || listProducts.length === 0,
    onLoadMore: async () => {
      if (hasNextPageProducts && products && listProducts.length > 0) {
        await fetchNextPageProducts()
      }
    },
  })

  return (
    <Dialog
      scrollBody
      isOpen={open}
      width={600}
      onClose={handleClose}
      onRequestClose={handleClose}
    >
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex flex-col h-full justify-between">
          <h6 className="text-xl font-bold mb-2">
            {type === 'create' ? 'Tambah Item Gratis' : 'Ubah Item Gratis'}
          </h6>

          <FormItem
            label="Name"
            invalid={Boolean(errors.name)}
            errorMessage={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Name"
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Point yang diperlukan"
            invalid={Boolean(errors.points_required)}
            errorMessage={errors.points_required?.message}
            labelClass="w-full flex justify-between items-center"
            extraType="start"
          >
            <Controller
              name="points_required"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <InputGroup>
                      <Input
                        type="number"
                        autoComplete="off"
                        placeholder="0 Point"
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === '' ? 0 : Number(e.target.value)
                          field.onChange(value)
                        }}
                      />
                      <Button
                        type="button"
                        variant="default"
                        disabled={field.value <= 0}
                        onClick={() => {
                          const newValue = Number(field.value) - 1
                          if (newValue >= 1) {
                            field.onChange(newValue)
                          }
                        }}
                      >
                        <Minus color="currentColor" size="20" />
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                          const newValue = Number(field.value) + 1
                          field.onChange(newValue)
                        }}
                      >
                        <Add color="currentColor" size="20" />
                      </Button>
                    </InputGroup>
                  </>
                )
              }}
            />
          </FormItem>

          <FormItem
            label=""
            className={errors.reward_items ? '' : 'mb-0'}
            invalid={Boolean(errors.reward_items)}
            errorMessage={errors.reward_items?.message}
          >
            <div className="flex items-center gap-2 my-2">
              <DebounceInput
                placeholder="Cari package dan produk..."
                suffix={<TbSearch className="text-lg" />}
                handleOnchange={(value) => {
                  setSearch(value)
                }}
                onFocus={() => setShowTab(true)}
              />
              {showTab && (
                <div
                  className="flex justify-center items-center cursor-pointer text-red-400 hover:text-red-600"
                  onClick={() => setShowTab(false)}
                >
                  <CloseCircle
                    size="24"
                    color="currentColor"
                    variant="Outline"
                  />
                </div>
              )}
            </div>
          </FormItem>

          <div className="flex flex-col gap-3 mb-4">
            {showTab ? (
              <Tabs
                defaultValue={tab}
                onChange={(value) => setTab(value as 'package' | 'product')}
              >
                <Tabs.TabList>
                  <Tabs.TabNav
                    value="package"
                    className="w-full"
                    icon={
                      <DocumentFilter
                        color="currentColor"
                        size={24}
                        variant="Bulk"
                      />
                    }
                  >
                    Package Plan
                  </Tabs.TabNav>
                  <Tabs.TabNav
                    value="product"
                    className="w-full"
                    icon={<Box color="currentColor" size={24} variant="Bulk" />}
                  >
                    Product
                  </Tabs.TabNav>
                </Tabs.TabList>
                <Tabs.TabContent value="package">
                  <div className="flex flex-col gap-2 rounded-b-md border border-t-0 border-gray-300 dark:border-gray-700 mb-4">
                    <div
                      ref={containerRefPackage}
                      className="h-56 overflow-y-auto"
                    >
                      {listPackages.map((i, index) => {
                        const isExist = (
                          formProps.getValues('reward_items') || []
                        ).some((item) => item.package_id === i.id)
                        return (
                          <div
                            key={index}
                            className={classNames(
                              `flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`,
                              {
                                'bg-primary-subtle/70 hover:bg-primary-subtle':
                                  isExist,
                              }
                            )}
                            onClick={() => {
                              const currentItems =
                                formProps.getValues('reward_items') || []
                              const existingItemIndex = currentItems.findIndex(
                                (item) => item.package_id === i.id
                              )

                              if (existingItemIndex === -1) {
                                formProps.setValue('reward_items', [
                                  ...currentItems,
                                  {
                                    package_id: i.id,
                                    product_id: null,
                                    quantity: 1,
                                    name: i.name,
                                    foriginal_price: i.fprice,
                                    fprice: i.fprice,
                                    price: i.price,
                                  },
                                ])
                              }
                              setShowTab(false)
                              formProps.clearErrors('reward_items')
                            }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-200 dark:bg-gray-700 rounded-full">
                              {tab === 'product' ? (
                                <Box
                                  className="text-gray-500 dark:text-gray-400"
                                  color="currentColor"
                                  size={24}
                                  variant="Bold"
                                />
                              ) : tab === 'package' ? (
                                <Book
                                  className="text-gray-500 dark:text-gray-400"
                                  color="currentColor"
                                  size={24}
                                  variant="Bold"
                                />
                              ) : (
                                <ArchiveBox
                                  className="text-gray-500 dark:text-gray-400"
                                  color="currentColor"
                                  size={24}
                                  variant="Bold"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm dark:text-gray-200">
                                {i.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-300">
                                {i.fprice}
                              </div>
                            </div>
                            {isExist && (
                              <span className="text-primary font-bold">✓</span>
                            )}
                          </div>
                        )
                      })}
                      <div className="px-4">
                        {isFetchingNextPagePackages &&
                          Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (_, i) => (
                              <Skeleton
                                key={i}
                                height={60}
                                className="rounded-xl my-2"
                              />
                            )
                          )}
                      </div>
                      {totalPackage === listPackages.length && (
                        <p className="col-span-full text-center text-gray-300 dark:text-gray-500 my-2">
                          No more items to load
                        </p>
                      )}
                    </div>
                  </div>
                </Tabs.TabContent>
                <Tabs.TabContent value="product">
                  <div className="flex flex-col gap-2 rounded-b-md border border-t-0 border-gray-300 dark:border-gray-700 mb-4">
                    <div
                      ref={containerRefProduct}
                      className="h-56 overflow-y-auto"
                    >
                      {listProducts.map((i, index) => {
                        const isExist = (
                          formProps.getValues('reward_items') || []
                        ).some((item) => item.product_id === i.id)
                        return (
                          <div
                            key={index}
                            className={classNames(
                              `flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`,
                              {
                                'bg-primary-subtle/70 hover:bg-primary-subtle':
                                  isExist,
                              }
                            )}
                            onClick={() => {
                              const currentItems =
                                formProps.getValues('reward_items') || []
                              const existingItemIndex = currentItems.findIndex(
                                (item) => item.product_id === i.id
                              )

                              if (existingItemIndex === -1) {
                                formProps.setValue('reward_items', [
                                  ...currentItems,
                                  {
                                    package_id: null,
                                    product_id: i.id,
                                    quantity: 1,
                                    name: i.name,
                                    foriginal_price: i.fprice,
                                    fprice: i.fprice,
                                    price: i.price,
                                  },
                                ])
                              }
                              setShowTab(false)
                              formProps.clearErrors('reward_items')
                            }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-200 dark:bg-gray-700 rounded-full">
                              {tab === 'product' ? (
                                <Box
                                  className="text-gray-500 dark:text-gray-400"
                                  color="currentColor"
                                  size={24}
                                  variant="Bold"
                                />
                              ) : tab === 'package' ? (
                                <Book
                                  className="text-gray-500 dark:text-gray-400"
                                  color="currentColor"
                                  size={24}
                                  variant="Bold"
                                />
                              ) : (
                                <ArchiveBox
                                  className="text-gray-500 dark:text-gray-400"
                                  color="currentColor"
                                  size={24}
                                  variant="Bold"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm dark:text-gray-200">
                                {i.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-300">
                                {i.fprice}
                              </div>
                            </div>
                            {isExist && (
                              <span className="text-primary font-bold">✓</span>
                            )}
                          </div>
                        )
                      })}
                      <div className="px-4">
                        {isFetchingNextPageProducts &&
                          Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (_, i) => (
                              <Skeleton
                                key={i}
                                height={50}
                                className="rounded-xl my-2"
                              />
                            )
                          )}
                      </div>
                      {totalProduct === listProducts.length && (
                        <p className="col-span-full text-center text-gray-300 dark:text-gray-500 my-2">
                          No more items to load
                        </p>
                      )}
                    </div>
                  </div>
                </Tabs.TabContent>
              </Tabs>
            ) : (
              <div className="flex flex-col gap-2 my-2">
                {watchData.reward_items?.map((i, index) => {
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-200 dark:bg-gray-700 rounded-full">
                        {i.product_id !== null ? (
                          <Box
                            className="text-gray-500 dark:text-gray-400"
                            color="currentColor"
                            size={24}
                            variant="Bold"
                          />
                        ) : i.package_id !== null ? (
                          <Book
                            className="text-gray-500 dark:text-gray-400"
                            color="currentColor"
                            size={24}
                            variant="Bold"
                          />
                        ) : (
                          <ArchiveBox
                            className="text-gray-500 dark:text-gray-400"
                            color="currentColor"
                            size={24}
                            variant="Bold"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm dark:text-gray-200">
                          {i.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                          {i.foriginal_price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() => {
                            const currentItems =
                              formProps.getValues('reward_items') || []
                            const itemIndex = currentItems.findIndex(
                              (item) =>
                                (item.product_id === i.product_id &&
                                  item.product_id !== null) ||
                                (item.package_id === i.package_id &&
                                  item.package_id !== null)
                            )

                            if (itemIndex !== -1) {
                              const newQty =
                                currentItems[itemIndex].quantity - 1

                              if (newQty <= 0) {
                                const newItems = [...currentItems]
                                newItems.splice(itemIndex, 1)
                                formProps.setValue('reward_items', newItems)
                              } else {
                                const newItems = [...currentItems]
                                newItems[itemIndex] = {
                                  ...newItems[itemIndex],
                                  quantity: newQty,
                                }
                                formProps.setValue('reward_items', newItems)
                              }
                            }
                          }}
                        >
                          <Minus color="currentColor" size="16" />
                        </Button>

                        <span className="mx-2 font-medium">{i.quantity}</span>

                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() => {
                            const currentItems =
                              formProps.getValues('reward_items') || []
                            const itemIndex = currentItems.findIndex(
                              (item) =>
                                (item.product_id === i.product_id &&
                                  item.product_id !== null) ||
                                (item.package_id === i.package_id &&
                                  item.package_id !== null)
                            )

                            if (itemIndex !== -1) {
                              const newQty =
                                currentItems[itemIndex].quantity + 1
                              const newItems = [...currentItems]
                              newItems[itemIndex] = {
                                ...newItems[itemIndex],
                                quantity: newQty,
                              }
                              formProps.setValue('reward_items', newItems)
                            }
                          }}
                        >
                          <Add color="currentColor" size="16" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
                {watchData.reward_items?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <div className="text-5xl mb-4 text-gray-500 dark:text-gray-200">
                      <SearchStatus1
                        color="currentColor"
                        size="64"
                        variant="Outline"
                      />
                    </div>
                    <h6 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Belum ada item gratis
                    </h6>
                    <p className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                      Cari item yang ingin anda tambahkan sebagai item gratis
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            {type === 'update' ? (
              <Button
                className="w-1/2 bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                variant="solid"
                type="button"
                icon={
                  <Trash color="currentColor" size="24" variant="Outline" />
                }
                onClick={() => setConfirmDelete(true)}
              >
                Hapus
              </Button>
            ) : (
              <Button
                className="w-1/2"
                variant="default"
                type="button"
                onClick={handleClose}
              >
                Batal
              </Button>
            )}
            <Button
              className="w-1/2"
              variant="solid"
              type="submit"
              loading={create.isPending || update.isPending}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Form>

      <AlertConfirm
        open={confirmDelete}
        title="Delete Loyalty Free Item"
        description="Are you sure want to delete this loyalty free item?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </Dialog>
  )
}

export default DialogFormFreeItem
