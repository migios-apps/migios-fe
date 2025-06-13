import useInfiniteScroll from '@/utils/hooks/useInfiniteScroll'
import React from 'react'

const InfiniteScrollExample = () => {
  const [items, setItems] = React.useState<string[]>(
    Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)
  )
  const [hasMore, setHasMore] = React.useState(true)

  const fetchMoreData = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if there are more items to load
    if (items.length >= 500) {
      setHasMore(false)
      return
    }

    // Append new items to the list
    setItems((prev) => [
      ...prev,
      ...Array.from({ length: 12 }, (_, i) => `Item ${prev.length + i + 1}`),
    ])
  }

  const {
    isLoading: isLoadingPackage,
    containerRef: containerRefPackage,
    // targetRef,
  } = useInfiniteScroll({
    offset: '100px',
    shouldStop: !hasMore,
    onLoadMore: fetchMoreData,
  })

  return (
    <div className="p-4">
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => {
          setItems(Array.from({ length: 39 }, (_, i) => `Item ${i + 1}`))
          setHasMore(true)
        }}
      >
        Reset
      </button>
      <div
        ref={containerRefPackage}
        className="overflow-y-auto border border-gray-300 p-4"
        style={{ height: 'calc(100vh - 110px)' }}
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded shadow text-center"
            >
              {item}
            </div>
          ))}
        </div>
        {/* <div ref={targetRef}></div> */}
        {isLoadingPackage && (
          <p className="col-span-full text-center">Loading more items...</p>
        )}
        {!hasMore && (
          <p className="col-span-full text-center">No more items to load</p>
        )}
      </div>
    </div>
  )
}

export default InfiniteScrollExample
