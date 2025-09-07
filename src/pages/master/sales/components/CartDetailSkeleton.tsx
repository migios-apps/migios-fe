import { ScrollArea } from '@/components/shared/scroll-area'
import { Skeleton } from '@/components/ui'

const CartDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] items-start h-full">
      {/* Left Panel */}
      <div className="flex flex-col w-full">
        <div className="p-4 flex flex-col gap-3">
          {/* Header dengan lokasi dan tanggal */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Skeleton height={20} width={20} className="rounded" />
              <Skeleton height={20} width={120} />
            </div>
            <Skeleton height={36} width={150} className="rounded-md" />
          </div>

          {/* Search Bar */}
          <Skeleton height={44} className="rounded-md" />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="flex flex-col gap-3 overflow-y-auto p-4">
            {/* Item Cards */}
            {Array.from({ length: 2 }, (_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <Skeleton height={20} width="60%" className="mb-2" />
                    <Skeleton height={16} width="40%" className="mb-1" />
                    <Skeleton height={16} width="30%" />
                  </div>
                  <div className="text-right">
                    <Skeleton height={24} width={100} className="mb-1" />
                    <Skeleton height={16} width={80} />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <Skeleton height={16} width={60} />
                    <Skeleton height={16} width={40} />
                  </div>
                  <Skeleton height={20} width={20} className="rounded" />
                </div>
              </div>
            ))}

            {/* Invoice Summary */}
            <div className="flex justify-end mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 w-full max-w-md">
                <Skeleton height={24} width={150} className="mb-3" />

                <div className="space-y-2 mb-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton height={16} width={80} />
                      <Skeleton height={16} width={100} />
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mb-4">
                  <div className="flex justify-between mb-2">
                    <Skeleton height={20} width={60} />
                    <Skeleton height={20} width={120} />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton height={14} width={140} />
                    <Skeleton height={14} width={60} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel */}
      <div className="border-l border-gray-200 dark:border-gray-700 h-full flex flex-col">
        <ScrollArea className="h-[calc(100vh-490px)] flex flex-col gap-3 overflow-y-auto p-4 flex-1">
          {/* Member Field */}
          <div className="mb-4">
            <Skeleton height={16} width={80} className="mb-2" />
            <Skeleton height={40} className="rounded-md" />
          </div>

          {/* Sales Field */}
          <div className="mb-4">
            <Skeleton height={16} width={100} className="mb-2" />
            <Skeleton height={40} className="rounded-md" />
          </div>

          {/* Payment Amount */}
          <div className="mb-4">
            <Skeleton height={16} width={70} className="mb-2" />
            <Skeleton height={80} className="rounded-md" />
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <Skeleton height={16} width={120} className="mb-2" />
            <Skeleton height={40} className="rounded-md" />
          </div>
        </ScrollArea>

        {/* Bottom Action Area */}
        <div className="flex flex-col gap-2.5 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          {/* Payment Details */}
          <div className="space-y-2 mb-3">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton height={16} width={80} />
                <div className="flex items-center gap-2">
                  <Skeleton height={16} width={100} />
                  <Skeleton height={16} width={16} className="rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col md:flex-row md:justify-between items-start gap-2">
            <Skeleton height={40} width="40%" className="rounded-full" />
            <Skeleton height={40} width="55%" className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDetailSkeleton
