import FileNotFound from '@/assets/svg/FileNotFound'
import type { CheckboxProps } from '@/components/ui/Checkbox'
import Checkbox from '@/components/ui/Checkbox'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import type { SkeletonProps } from '@/components/ui/Skeleton'
import type { TableProps } from '@/components/ui/Table'
import Table from '@/components/ui/Table'
import useDarkMode from '@/utils/hooks/useDarkMode'
import {
  CellContext,
  Column,
  ColumnDef,
  ColumnPinningState,
  ColumnSort,
  Row,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import classNames from 'classnames'
import { CSSProperties } from 'preact/compat'
import type {
  ChangeEvent,
  ForwardedRef,
  ReactNode,
  SyntheticEvent,
} from 'react'
import {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { RiPushpin2Line, RiUnpinFill } from 'react-icons/ri'
import { Dropdown, DropdownRef } from '../ui'
import Loading from './Loading'
import TableRowSkeleton from './loaders/TableRowSkeleton'

export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

export type DataTableColumnDef<T> = ColumnDef<T> & {
  enableColumnActions?: boolean
}

type DataTableProps<T> = {
  columns: DataTableColumnDef<T>[]
  customNoDataIcon?: ReactNode
  data?: unknown[]
  loading?: boolean
  noData?: boolean
  onCheckBoxChange?: (checked: boolean, row: T) => void
  onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
  onPaginationChange?: (page: number) => void
  onSelectChange?: (num: number) => void
  onSort?: (sort: OnSortParam) => void
  pageSizes?: number[]
  selectable?: boolean
  skeletonAvatarColumns?: number[]
  skeletonAvatarProps?: SkeletonProps
  pagingData?: {
    total: number
    pageIndex: number
    pageSize: number
  }
  checkboxChecked?: (row: T) => boolean
  indeterminateCheckboxChecked?: (row: Row<T>[]) => boolean
  pinnedColumns?: { left?: string[]; right?: string[] }
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement
  getRowCanExpand?: (row: Row<T>) => boolean
} & TableProps

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
  onChange: (event: CheckBoxChangeEvent) => void
  indeterminate: boolean
  onCheckBoxChange?: (event: CheckBoxChangeEvent) => void
  onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px #cacaca inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px #cacaca inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
    width: column.getSize(),
    minWidth: column.getSize(),
  }
}

const IndeterminateCheckbox = (props: IndeterminateCheckboxProps) => {
  const {
    indeterminate,
    onChange,
    onCheckBoxChange,
    onIndeterminateCheckBoxChange,
    ...rest
  } = props

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate])

  const handleChange = (e: CheckBoxChangeEvent) => {
    onChange(e)
    onCheckBoxChange?.(e)
    onIndeterminateCheckBoxChange?.(e)
  }

  return (
    <Checkbox
      ref={ref}
      className="mb-0"
      onChange={(_, e) => handleChange(e)}
      {...rest}
    />
  )
}

export type DataTableResetHandle = {
  resetSorting: () => void
  resetSelected: () => void
}

function _DataTable<T>(
  props: DataTableProps<T>,
  ref: ForwardedRef<DataTableResetHandle>
) {
  const [isDark] = useDarkMode()
  const {
    skeletonAvatarColumns,
    columns: columnsProp = [],
    data = [],
    customNoDataIcon,
    loading,
    noData,
    onCheckBoxChange,
    onIndeterminateCheckBoxChange,
    onPaginationChange,
    onSelectChange,
    onSort,
    pageSizes = [10, 25, 50, 100],
    selectable = false,
    skeletonAvatarProps,
    pagingData = {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    },
    checkboxChecked,
    indeterminateCheckboxChecked,
    pinnedColumns,
    renderSubComponent,
    getRowCanExpand,
    ...rest
  } = props

  const { pageSize, pageIndex, total } = pagingData

  const [sorting, setSorting] = useState<ColumnSort[] | null>(null)
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: pinnedColumns?.left || [],
    right: pinnedColumns?.right || [],
  })

  const dropdownRef = useRef<DropdownRef>(null)

  const handleDropdownClick = (e: MouseEvent) => {
    e.stopPropagation()
    dropdownRef.current?.handleDropdownOpen()
  }

  const handleDropdownItemClick = (
    e: SyntheticEvent,
    callback?: () => void
  ) => {
    e.stopPropagation()
    callback?.()
  }

  const pageSizeOption = useMemo(
    () =>
      pageSizes.map((number) => ({
        value: number,
        label: `${number} / page`,
      })),
    [pageSizes]
  )

  useEffect(() => {
    if (Array.isArray(sorting)) {
      const sortOrder =
        sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
      const id = sorting.length > 0 ? sorting[0].id : ''
      onSort?.({ order: sortOrder, key: id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  const handleIndeterminateCheckBoxChange = (
    checked: boolean,
    rows: Row<T>[]
  ) => {
    if (!loading) {
      onIndeterminateCheckBoxChange?.(checked, rows)
    }
  }

  const handleCheckBoxChange = (checked: boolean, row: T) => {
    if (!loading) {
      onCheckBoxChange?.(checked, row)
    }
  }

  const finalColumns: ColumnDef<T>[] = useMemo(() => {
    const columns = columnsProp

    if (selectable) {
      return [
        {
          id: 'select',
          maxSize: 50,
          header: ({ table }) => (
            <IndeterminateCheckbox
              checked={
                indeterminateCheckboxChecked
                  ? indeterminateCheckboxChecked(table.getRowModel().rows)
                  : table.getIsAllRowsSelected()
              }
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              onIndeterminateCheckBoxChange={(e) => {
                handleIndeterminateCheckBoxChange(
                  e.target.checked,
                  table.getRowModel().rows
                )
              }}
            />
          ),
          cell: ({ row }) => (
            <IndeterminateCheckbox
              checked={
                checkboxChecked
                  ? checkboxChecked(row.original)
                  : row.getIsSelected()
              }
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              onCheckBoxChange={(e) =>
                handleCheckBoxChange(e.target.checked, row.original)
              }
            />
          ),
        },
        ...columns,
      ]
    }
    return columns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsProp, selectable, loading, checkboxChecked])

  const table = useReactTable<any>({
    data,

    columns: finalColumns as ColumnDef<unknown | object | any[], any>[],
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (sorter) => {
      setSorting(sorter as ColumnSort[])
    },
    state: {
      columnPinning: {
        left: columnPinning.left || [],
        right: columnPinning.right || [],
      },
      sorting: sorting as ColumnSort[],
    },
  })

  const resetSorting = () => {
    table.resetSorting()
  }

  const resetSelected = () => {
    table.resetRowSelection(true)
  }

  useImperativeHandle(ref, () => ({
    resetSorting,
    resetSelected,
  }))

  const handlePaginationChange = (page: number) => {
    if (!loading) {
      resetSelected()
      onPaginationChange?.(page)
    }
  }

  const handleSelectChange = (value?: number) => {
    if (!loading) {
      onSelectChange?.(Number(value))
    }
  }

  return (
    <Loading loading={Boolean(loading && data.length !== 0)} type="cover">
      <Table {...rest}>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnDef = header.column
                  .columnDef as DataTableColumnDef<T>
                return (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={classNames(
                      'w-full',
                      isDark
                        ? 'dark:bg-gray-950 dark:text-gray-100'
                        : 'bg-gray-100'
                    )}
                    style={{
                      ...(getCommonPinningStyles(header.column) as any),
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {header.isPlaceholder ? null : (
                        <div
                          className={classNames(
                            'flex items-center gap-1',
                            header.column.getCanSort() &&
                              'cursor-pointer select-none point',
                            loading && 'pointer-events-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <Sorter sort={header.column.getIsSorted()} />
                          )}
                        </div>
                      )}

                      {!header.isPlaceholder &&
                        columnDef.enableColumnActions !== false &&
                        header.column.getCanPin() && (
                          <Dropdown
                            ref={dropdownRef}
                            renderTitle={
                              <div
                                className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"
                                onClick={() => handleDropdownClick}
                              >
                                <PiDotsThreeOutlineVerticalFill />
                              </div>
                            }
                            placement="bottom-end"
                          >
                            {header.column.getIsPinned() !== 'left' ? (
                              <Dropdown.Item
                                eventKey="left"
                                onClick={(e) =>
                                  handleDropdownItemClick(e, () => {
                                    header.column.pin('left')
                                    setColumnPinning({
                                      ...columnPinning,
                                      right: columnPinning.right?.filter(
                                        (id) => id !== header.column.id
                                      ),
                                      left: [
                                        header.column.id,
                                        ...(columnPinning.left as string[]),
                                      ],
                                    })
                                  })
                                }
                              >
                                <RiPushpin2Line className="rotate-90 w-5 h-5" />
                                <span>Pin left</span>
                              </Dropdown.Item>
                            ) : null}
                            {header.column.getIsPinned() ? (
                              <Dropdown.Item
                                eventKey="unpin"
                                onClick={(e) =>
                                  handleDropdownItemClick(e, () => {
                                    header.column.pin(false)
                                    setColumnPinning({
                                      ...columnPinning,
                                      left: columnPinning.left?.filter(
                                        (id) => id !== header.column.id
                                      ),
                                      right: columnPinning.right?.filter(
                                        (id) => id !== header.column.id
                                      ),
                                    })
                                  })
                                }
                              >
                                <RiUnpinFill className="w-5 h-5" />
                                <span>Unpin</span>
                              </Dropdown.Item>
                            ) : null}
                            {header.column.getIsPinned() !== 'right' ? (
                              <Dropdown.Item
                                eventKey="right"
                                onClick={(e) =>
                                  handleDropdownItemClick(e, () => {
                                    header.column.pin('right')
                                    setColumnPinning({
                                      ...columnPinning,
                                      right: [
                                        header.column.id,
                                        ...(columnPinning.right as string[]),
                                      ],
                                      left: columnPinning.left?.filter(
                                        (id) => id !== header.column.id
                                      ),
                                    })
                                  })
                                }
                              >
                                <RiPushpin2Line className="-rotate-90 w-5 h-5" />
                                <span>Pin right</span>
                              </Dropdown.Item>
                            ) : null}
                          </Dropdown>
                        )}
                    </div>
                  </Th>
                )
              })}
            </Tr>
          ))}
        </THead>
        {loading && data.length === 0 ? (
          <TableRowSkeleton
            columns={(finalColumns as Array<T>).length}
            rows={pagingData.pageSize}
            avatarInColumns={skeletonAvatarColumns}
            avatarProps={skeletonAvatarProps}
          />
        ) : (
          <TBody>
            {noData ? (
              <Tr>
                <Td
                  className="hover:bg-transparent"
                  colSpan={finalColumns.length}
                >
                  <div className="flex flex-col items-center gap-4">
                    {customNoDataIcon ? (
                      customNoDataIcon
                    ) : (
                      <>
                        <FileNotFound />
                        <span className="font-semibold">No data found!</span>
                      </>
                    )}
                  </div>
                </Td>
              </Tr>
            ) : (
              table
                .getRowModel()
                .rows.slice(0, pageSize)
                .map((row) => {
                  return (
                    <Fragment key={row.id}>
                      <Tr>
                        {row.getVisibleCells().map((cell) => {
                          const { column } = cell
                          const isPinned = column.getIsPinned()
                          return (
                            <Td
                              key={cell.id}
                              className={classNames(
                                isDark
                                  ? isPinned
                                    ? 'dark:bg-gray-900 hover:dark:bg-gray-800'
                                    : 'dark:bg-gray-900 dark:text-gray-100'
                                  : 'bg-white'
                              )}
                              style={{
                                ...(getCommonPinningStyles(column) as any),
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Td>
                          )
                        })}
                      </Tr>
                      {row.getIsExpanded() && (
                        <Tr>
                          <Td colSpan={row.getVisibleCells().length}>
                            {renderSubComponent?.({ row })}
                          </Td>
                        </Tr>
                      )}
                    </Fragment>
                  )
                })
            )}
          </TBody>
        )}
      </Table>
      <div className="flex items-center justify-between mt-4">
        <Pagination
          pageSize={pageSize}
          currentPage={pageIndex}
          total={total}
          onChange={handlePaginationChange}
        />
        <div style={{ minWidth: 130 }}>
          <Select
            size="sm"
            menuPlacement="top"
            isSearchable={false}
            value={pageSizeOption.filter((option) => option.value === pageSize)}
            options={pageSizeOption}
            onChange={(option) => handleSelectChange(option?.value)}
          />
        </div>
      </div>
    </Loading>
  )
}

const DataTable = forwardRef(_DataTable) as <T>(
  props: DataTableProps<T> & {
    ref?: ForwardedRef<DataTableResetHandle>
  }
) => ReturnType<typeof _DataTable>

export type { CellContext, ColumnDef, Row }
export default DataTable
