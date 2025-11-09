export const statusColor: Record<string, string> = {
  active:
    'w-fit bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
  inactive: 'w-fit bg-red-500 dark:bg-red-500 text-white dark:text-white',
  expired: 'w-fit bg-red-500 dark:bg-red-500 text-white dark:text-white',
  freeze: 'w-fit bg-blue-500 dark:bg-blue-500 text-white dark:text-white',
}

export const statusColorText: Record<string, string> = {
  active: 'text-gray-900 dark:text-gray-900',
  inactive: 'text-white dark:text-white',
  expired: 'text-white dark:text-white',
  freeze: 'text-white dark:text-white',
}

export const paymentStatusColor: Record<string, string> = {
  paid: 'w-fit bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
  part_paid:
    'w-fit bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900',
  unpaid: 'w-fit bg-yellow-700 dark:bg-yellow-700 text-white dark:text-white',
  overdue: 'w-fit bg-purple-500 dark:bg-purple-500 text-white dark:text-white',
  refunded: 'w-fit bg-red-300 dark:bg-red-300 text-gray-900 dark:text-gray-900',
  void: 'w-fit bg-red-500 dark:bg-red-500 text-white dark:text-white',
  pending:
    'w-fit bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900',
  completed:
    'w-fit bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
}

export const paymentStatusColorText: Record<string, string> = {
  paid: 'text-gray-900 dark:text-gray-900',
  part_paid: 'text-gray-900 dark:text-gray-900',
  unpaid: 'text-white dark:text-white',
  overdue: 'text-white dark:text-white',
  refunded: 'text-gray-900 dark:text-gray-900',
  void: 'text-white dark:text-white',
  pending: 'text-gray-900 dark:text-gray-900',
  completed: 'text-gray-900 dark:text-gray-900',
}

export const cuttingSessionStatusColor: Record<number, string> = {
  0: 'w-fit bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900', // pending
  1: 'w-fit bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900', // approved
  2: 'w-fit bg-red-500 dark:bg-red-500 text-white dark:text-white', // rejected
}

export const cuttingSessionStatusText: Record<number, string> = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
}
