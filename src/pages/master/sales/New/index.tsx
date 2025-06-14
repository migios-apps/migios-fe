import { DebounceInput } from '@/components/shared'
import ModeSwitcher from '@/components/template/ThemeConfigurator/ModeSwitcher'
import { Button, Select, Skeleton, Tabs } from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import CloseButton from '@/components/ui/CloseButton'
import { currencyFormat } from '@/components/ui/InputCurrency/currencyFormat'
import { SelectAsyncPaginate } from '@/components/ui/Select'
import { ReturnAsyncSelect } from '@/components/ui/Select/SelectAsync'
import { categoryPackage } from '@/constants'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { TrainerPackageTypes } from '@/services/api/@types/package'
import { apiGetPackageList } from '@/services/api/PackageService'
import { apiGetProductList } from '@/services/api/ProductService'
import { apiGetTrainerList } from '@/services/api/TrainerService'
import { useSessionUser } from '@/store/authStore'
import useFormPersist from '@/utils/hooks/useFormPersist'
import useInfiniteScroll from '@/utils/hooks/useInfiniteScroll'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { Box, DocumentFilter, Warning2 } from 'iconsax-react'
import React, { Fragment } from 'react'
import { useFieldArray } from 'react-hook-form'
import { TbSearch } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import FormAddItemSale from './components/FormAddItemSale'
import FormAddPayment from './components/FormAddPayment'
import ItemPackageCard from './components/ItemPackageCard'
import ItemProductCard from './components/ItemProductCard'
import PackageCard from './components/PackageCard'
import ProductCard from './components/ProductCard'
import { calculateDetailPayment } from './utils/calculateDetailPayment'
import {
  defaultValueTransaction,
  resetTransactionForm,
  useTransactionForm,
  useTransactionItemForm,
} from './validation'

const { TabNav, TabList, TabContent } = Tabs

const New = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const club = useSessionUser((state) => state.club)
  const [tab, setTab] = React.useState('package')
  const [searchPackage, setSearchPackage] = React.useState('')
  const [searchProduct, setSearchProduct] = React.useState('')
  const [packageCategory, setPackageCategory] = React.useState('')
  const [trainer, setTrainer] = React.useState<TrainerPackageTypes | null>(null)
  const [openAddItem, setOpenAddItem] = React.useState(false)
  const [formItemType, setFormItemType] = React.useState<'create' | 'update'>(
    'create'
  )
  const [indexItem, setIndexItem] = React.useState(0)
  const [openAddPayment, setOpenAddPayment] = React.useState(false)
  const [confirmClose, setConfirmClose] = React.useState(false)

  const formPropsItem = useTransactionItemForm()
  const transactionSchema = useTransactionForm()
  const watchTransaction = transactionSchema.watch()

  // console.log('transactionSchema', transactionSchema.watch())
  // console.log('error transaction', transactionSchema.formState.errors)

  useFormPersist('migios_pos', {
    defaultValue: defaultValueTransaction,
    watch: transactionSchema.watch,
    setValue: transactionSchema.setValue,
    storage: window.localStorage,
    restore: (data: any) => {
      Object.keys(data).forEach((key: any) => {
        return transactionSchema.setValue(key, data[key], {
          shouldValidate: true,
          shouldDirty: true,
        })
      })
    },
  })

  const {
    // fields: items,
    append: appendTransactionItem,
    update: updateTransactionItem,
    remove: removeTransactionItem,
  } = useFieldArray({
    control: transactionSchema.control,
    name: 'items',
  })

  const calculate = calculateDetailPayment({
    items: watchTransaction.items,
    discount_type: watchTransaction.discount_type,
    discount: watchTransaction.discount || 0,
    tax_rate: 0,
  })

  // console.log('items', items)

  const {
    data: packages,
    fetchNextPage: fetchNextPagePackages,
    hasNextPage: hasNextPagePackages,
    isFetchingNextPage: isFetchingNextPagePackages,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.packages,
      searchPackage,
      club.id,
      packageCategory,
      trainer,
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await apiGetPackageList({
        page: pageParam,
        per_page: 12,
        sort_column: 'id',
        sort_type: 'desc',
        search: [
          {
            search_column: 'enabled',
            search_condition: '=',
            search_text: 'true',
          },
          ...(packageCategory !== ''
            ? ([
                {
                  search_operator: 'and',
                  search_column: 'type',
                  search_condition: '=',
                  search_text: packageCategory,
                },
              ] as Filter[])
            : []),
          ...((searchPackage === ''
            ? []
            : [
                {
                  search_operator: 'and',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: searchPackage,
                },
              ]) as Filter[]),
          ...(trainer !== null
            ? ([
                {
                  search_operator: 'and',
                  search_column: 'trainers.id',
                  search_condition: '=',
                  search_text: trainer.id.toString(),
                },
                {
                  search_operator: 'or',
                  search_column: 'instructors.id',
                  search_condition: '=',
                  search_text: trainer.id.toString(),
                },
                {
                  search_operator: 'or',
                  search_column: 'allow_all_trainer',
                  search_condition: '=',
                  search_text: 'true',
                },
                {
                  search_operator: 'or',
                  search_column: 'classes.allow_all_instructor',
                  search_condition: '=',
                  search_text: 'true',
                },
              ] as Filter[])
            : []),
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
    queryKey: [QUERY_KEY.products, searchProduct],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await apiGetProductList({
        page: pageParam,
        per_page: 12,
        sort_column: 'id',
        sort_type: 'desc',
        search: [
          ...((searchProduct === ''
            ? []
            : [
                {
                  search_operator: 'and',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: searchProduct,
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

  const getTrainerList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<TrainerPackageTypes, GroupBase<TrainerPackageTypes>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetTrainerList({
        page: additional?.page,
        per_page: 10,
        sort_column: 'id',
        sort_type: 'desc',
        search: [
          (inputValue || '').length > 0
            ? ({
                search_column: 'name',
                search_condition: 'like',
                search_text: `${inputValue}`,
              } as any)
            : null,
          {
            search_operator: 'and',
            search_column: 'enabled',
            search_condition: '=',
            search_text: 'true',
          },
        ],
      })
      return new Promise<ReturnAsyncSelect>((resolve) => {
        resolve({
          options: response.data.data,
          hasMore: response.data.data.length >= 1,
          additional: {
            page: additional!.page + 1,
          },
        })
      })
    },
    []
  )

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1) // Kembali jika ada riwayat
    } else {
      navigate('/') // Fallback ke halaman tertentu
    }
  }

  return (
    <>
      <div className="w-full flex justify-between border-b border-gray-300 dark:border-gray-700 items-center gap-4 p-4 shadow-sm">
        <h5>Point Of Sale</h5>
        <div className="ltr:right-6 rtl:left-6 top-4.5">
          <div className="flex justify-start gap-4">
            <ModeSwitcher />
            <CloseButton
              onClick={() => {
                if (watchTransaction.items.length > 0) {
                  setConfirmClose(true)
                } else {
                  handleBack()
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] items-start h-full">
        <Tabs value={tab} onChange={(tab) => setTab(tab)}>
          <TabList>
            <TabNav
              value="package"
              icon={
                <DocumentFilter color="currentColor" size={24} variant="Bulk" />
              }
            >
              Package Plan
            </TabNav>
            <TabNav
              value="product"
              icon={<Box color="currentColor" size={24} variant="Bulk" />}
            >
              Product
            </TabNav>
          </TabList>
          <TabContent value="package">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4">
              <Select
                isClearable
                isSearchable={false}
                placeholder="Filter by category"
                className="md:max-w-[200px] w-full"
                value={categoryPackage.filter(
                  (option) => option.value === packageCategory
                )}
                options={categoryPackage}
                onChange={(option) => setPackageCategory(option?.value || '')}
              />
              <SelectAsyncPaginate
                isClearable
                isLoading={isFetchingNextPagePackages}
                loadOptions={getTrainerList as any}
                additional={{ page: 1 }}
                placeholder="Filter by trainer"
                className="md:max-w-[200px] w-full"
                value={trainer}
                getOptionLabel={(option) => option.name!}
                getOptionValue={(option) => option.id.toString()}
                debounceTimeout={500}
                onChange={(option) => setTrainer(option!)}
              />
              <DebounceInput
                defaultValue={searchPackage}
                placeholder="Search name..."
                suffix={<TbSearch className="text-lg" />}
                handleOnchange={(value) => {
                  setSearchPackage(value)
                  queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY.packages],
                  })
                }}
              />
            </div>
            <div
              ref={containerRefPackage}
              className="overflow-y-auto p-4"
              style={{ height: 'calc(100vh - 195px)' }}
            >
              <div
                className="grid gap-4 mb-4"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                }}
              >
                {packages?.pages.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page.data.data.map((item, index: number) => (
                      <PackageCard
                        key={index}
                        disabled={watchTransaction.items
                          ?.map((trx) => trx.package_id)
                          ?.includes(item.id)}
                        item={item}
                        formProps={formPropsItem}
                        onClick={() => {
                          setOpenAddItem(true)
                          setFormItemType('create')
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
                {isFetchingNextPagePackages &&
                  Array.from({ length: 12 }, (_, i) => i + 1).map((_, i) => (
                    <Skeleton key={i} height={120} className="rounded-xl" />
                  ))}
              </div>
              {totalPackage === listPackages.length && (
                <p className="col-span-full text-center text-gray-300 dark:text-gray-500">
                  No more items to load
                </p>
              )}
            </div>
          </TabContent>
          <TabContent value="product">
            <div className="p-4">
              <DebounceInput
                defaultValue={searchProduct}
                placeholder="Search name..."
                suffix={<TbSearch className="text-lg" />}
                handleOnchange={(value) => {
                  setSearchProduct(value)
                  queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY.products],
                  })
                }}
              />
            </div>
            <div
              ref={containerRefProduct}
              className="overflow-y-auto p-4"
              style={{ height: 'calc(100vh - 195px)' }}
            >
              <div
                className="grid gap-4 mb-4"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                }}
              >
                {products?.pages.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page.data.data.map((item, index: number) => (
                      <ProductCard
                        key={index}
                        item={item}
                        disabled={
                          item.quantity === 0 ||
                          watchTransaction.items
                            ?.map((trx) => trx.product_id)
                            ?.includes(item.id)
                        }
                        formProps={formPropsItem}
                        onClick={() => {
                          setOpenAddItem(true)
                          setFormItemType('create')
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
                {isFetchingNextPageProducts &&
                  Array.from({ length: 12 }, (_, i) => i + 1).map((_, i) => (
                    <Skeleton key={i} height={120} className="rounded-xl" />
                  ))}
              </div>
              {totalProduct === listProducts.length && (
                <p className="col-span-full text-center text-gray-300 dark:text-gray-500">
                  No more items to load
                </p>
              )}
            </div>
          </TabContent>
        </Tabs>
        <div className="border-l border-gray-200 dark:border-gray-700 h-full">
          <div
            className="flex flex-col gap-3 overflow-y-auto p-4"
            style={{ height: 'calc(100vh - 280px)' }}
          >
            {watchTransaction.items?.map((item, index) => {
              return (
                <Fragment key={index}>
                  {item.item_type === 'product' ? (
                    <ItemProductCard
                      item={item}
                      onClick={() => {
                        formPropsItem.reset(item)
                        setIndexItem(index)
                        setOpenAddItem(true)
                        setFormItemType('update')
                      }}
                    />
                  ) : (
                    <ItemPackageCard
                      item={item}
                      onClick={() => {
                        formPropsItem.reset(item)
                        setIndexItem(index)
                        setOpenAddItem(true)
                        setFormItemType('update')
                      }}
                    />
                  )}
                </Fragment>
              )
            })}
          </div>
          <div className="h-[210px] flex flex-col justify-between p-4 pb-0 text-base">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="font-bold">Sub total</span>
                <span>{currencyFormat(calculate.subtotal)}</span>
              </div>
              <span className="text-primary cursor-pointer">Add discount</span>
              <div className="flex justify-between">
                <span className="font-bold">Tax</span>
                <span>{currencyFormat(calculate.taxAmount)}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{currencyFormat(calculate.totalAmount)}</span>
              </div>
              <div className="flex justify-between italic">
                <span>Potential to earn points</span>
                <span>+{calculate.loyalty_point} Pts</span>
              </div>
            </div>

            <Button
              className="rounded-full"
              variant="solid"
              disabled={watchTransaction.items?.length === 0}
              onClick={() => setOpenAddPayment(true)}
            >
              Pay now
            </Button>
          </div>
        </div>
      </div>

      <FormAddItemSale
        open={openAddItem}
        type={formItemType}
        formProps={formPropsItem}
        index={indexItem}
        onChange={(item, type) => {
          if (type === 'create') {
            appendTransactionItem(item)
          } else if (type === 'update') {
            updateTransactionItem(indexItem, item)
          }
        }}
        onDelete={(index) => {
          removeTransactionItem(index || indexItem)
        }}
        onClose={() => setOpenAddItem(false)}
      />

      <FormAddPayment
        open={openAddPayment}
        formProps={transactionSchema}
        onClose={() => setOpenAddPayment(false)}
      />

      <AlertConfirm
        open={confirmClose}
        icon={
          <div className="bg-red-100 p-4 rounded-full">
            <Warning2 size="40" color="#FF8A65" variant="Bulk" />
          </div>
        }
        title="Close Page"
        description="Are you sure you want to close this page?"
        type="delete"
        leftTitle="Keep cart"
        rightTitle="Delete cart"
        onClose={() => setConfirmClose(false)}
        onLeftClick={() => {
          setConfirmClose(false)
          handleBack()
        }}
        onRightClick={() => {
          resetTransactionForm(transactionSchema)
          window.localStorage.setItem(
            'migios_pos',
            JSON.stringify({
              ...defaultValueTransaction,
              _timestamp: Date.now(),
            })
          )
          handleBack()
          setConfirmClose(false)
        }}
      />
    </>
  )
}

export default New
