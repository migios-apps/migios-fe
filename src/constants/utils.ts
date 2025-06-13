export const statusColor: Record<string, string> = {
  active:
    'w-fit bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
  inactive: 'w-fit bg-red-500 dark:bg-red-500 text-white dark:text-white',
  expired: 'w-fit bg-red-500 dark:bg-red-500 text-white dark:text-white',
  freeze: 'w-fit bg-blue-500 dark:bg-blue-500 text-white dark:text-white',
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
