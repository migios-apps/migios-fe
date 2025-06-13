import Switcher from '@/components/ui/Switcher/Switcher'
import { useThemeStore } from '@/store/themeStore'

const FooterSwitcher = () => {
  const { layout, setShowFooter } = useThemeStore()

  const onSwitchChange = (checked: boolean) => {
    setShowFooter(checked)
  }

  return (
    <Switcher
      checked={layout.showFooter}
      onChange={(checked) => onSwitchChange(checked)}
    />
  )
}

export default FooterSwitcher
