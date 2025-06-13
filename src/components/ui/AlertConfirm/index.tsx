import classNames from '@/utils/classNames'
import { Trash } from 'iconsax-react'
import React, { JSX } from 'react'
import ReactModal from 'react-modal'
import Button from '../Button'
import Dialog from '../Dialog'

interface AlertConfirmProps {
  title: JSX.Element | string
  description?: JSX.Element | string
  open: boolean
  loading?: boolean
  zIndex?: number
  type?: 'delete' | 'confirm'
  icon?: JSX.Element | null
  leftTitle?: JSX.Element | string
  rightTitle?: JSX.Element | string
  leftButtonClassName?: string
  rightButtonClassName?: string
  closable?: boolean
  className?: string
  onClose?: () => void
  onLeftClick: () => void
  onRightClick: () => void
  onRequestClose?: ReactModal.Props['onRequestClose']
}

const DeleteIcon = () => {
  return (
    <div className="bg-red-100 p-4 rounded-full">
      <Trash size="40" color="#FF8A65" variant="Bulk" />
    </div>
  )
}

const AlertConfirm: React.FC<AlertConfirmProps> = ({
  title,
  description,
  open,
  loading,
  type = 'confirm',
  icon = type === 'delete' ? <DeleteIcon /> : null,
  leftTitle = 'Cancel',
  rightTitle = 'Confirm',
  leftButtonClassName,
  rightButtonClassName,
  className = '!w-[320px]',
  closable = false,
  onClose,
  onLeftClick,
  onRightClick,
  onRequestClose,
}) => {
  return (
    <Dialog
      isOpen={open}
      closable={closable}
      className={className}
      onClose={onClose}
      onRequestClose={onRequestClose}
    >
      <div className="flex flex-col justify-center items-center">
        {icon && <div className="mb-2">{icon}</div>}
        <h4 className="mb-2">{title}</h4>
        <p className="text-center text-base">{description}</p>
        {/* <div className="flex justify-between items-center mt-6 gap-4 w-full"> */}
        <div className="w-full flex flex-col md:flex-row md:justify-between mt-6 items-start gap-4">
          <Button
            className={classNames(
              'w-full',
              // type === 'confirm' ? 'border-red-500 text-red-500' : '',
              type === 'delete' ? 'border-primary text-primary' : '',
              leftButtonClassName
            )}
            variant="default"
            onClick={onLeftClick}
          >
            {leftTitle}
          </Button>
          <Button
            className={classNames(
              'w-full',
              type === 'delete' ? 'bg-red-500 text-white' : '',
              rightButtonClassName
            )}
            variant="solid"
            loading={loading}
            onClick={onRightClick}
          >
            {rightTitle}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default AlertConfirm
