import {
  Popover as _Popover,
  PopoverTrigger as _PopoverTrigger,
  PopoverContent as _PopoverContent,
} from './Popover'

export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
} from './Popover'

type CompoundedComponent = typeof _Popover & {
  PopoverTrigger: typeof _PopoverTrigger
  PopoverContent: typeof _PopoverContent
}

const Popover = _Popover as CompoundedComponent

Popover.PopoverTrigger = _PopoverTrigger
Popover.PopoverContent = _PopoverContent

export { Popover }

export default Popover
