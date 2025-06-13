import useDarkMode from '@/utils/hooks/useDarkMode'
import { motion } from 'framer-motion'
import { Moon, Sun1 } from 'iconsax-react'
import { useCallback } from 'react'

const ModeSwitcher = () => {
  const [isDark, setIsDark] = useDarkMode()

  const onSwitchChange = useCallback(
    (checked: boolean) => {
      setIsDark(checked ? 'dark' : 'light')
    },
    [setIsDark]
  )

  return (
    <div className="relative w-8 h-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: isDark ? 1 : 0, rotate: isDark ? 0 : -180 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center text-white cursor-pointer rounded-full"
        onClick={() => onSwitchChange(false)}
      >
        <Sun1 color="currentColor" size={24} variant="Bulk" />
      </motion.div>
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: isDark ? 0 : 1, rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center text-primary cursor-pointer rounded-full"
        onClick={() => onSwitchChange(true)}
      >
        <Moon color="currentColor" size={24} variant="Bulk" />
      </motion.div>
    </div>
  )
}

export default ModeSwitcher
