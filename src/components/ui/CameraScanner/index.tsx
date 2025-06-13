import {
  IScannerProps,
  Scanner,
  boundingBox,
  centerText,
  outline,
} from '@yudiel/react-qr-scanner'
import React from 'react'

export interface CameraScannerProps extends IScannerProps {
  tracker?: 'outline' | 'boundingBox' | 'centerText'
}

const CameraScanner: React.FC<CameraScannerProps> = ({ tracker, ...props }) => {
  return (
    <Scanner
      classNames={{
        container: 'camera_scanner',
        video: 'camera_video absolute',
      }}
      components={{
        audio: true,
        onOff: true,
        torch: true,
        zoom: true,
        finder: true,
        tracker: () => {
          switch (tracker) {
            case 'outline':
              return outline
            case 'boundingBox':
              return boundingBox
            case 'centerText':
              return centerText
            default:
              return undefined
          }
        },
        ...props.components,
      }}
      {...props}
    />
  )
}

export default CameraScanner
