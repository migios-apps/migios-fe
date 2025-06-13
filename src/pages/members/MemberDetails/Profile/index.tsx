import { MemberDetail } from '@/services/api/@types/member'
import dayjs from 'dayjs'
import { QRCode } from 'react-qrcode-logo'

interface ProfileProps {
  data: MemberDetail
}
type CustomerInfoFieldProps = {
  title?: string
  value?: string
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
  return (
    <div>
      <span className="font-semibold">{title}</span>
      <p className="heading-text font-bold">{value}</p>
    </div>
  )
}

const Profile = ({ data }: ProfileProps) => {
  return (
    <>
      <div className="w-full flex gap-y-6 gap-x-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomerInfoField title="Name" value={data.name} />
          <CustomerInfoField title="Email" value={data.email} />
          <CustomerInfoField title="Phone" value={data.phone} />
          <CustomerInfoField
            title="Date of birth"
            value={dayjs(data?.birth_date).format('DD/MM/YYYY')}
          />
          <CustomerInfoField
            title="Gender"
            value={data.gender === 'm' ? 'Male' : 'Female'}
          />
          <CustomerInfoField title="Address" value={data.address} />
          <CustomerInfoField
            title="Identity number"
            value={data.identity_number}
          />
          <CustomerInfoField title="Identity type" value={data.identity_type} />
          <CustomerInfoField
            title="Join date"
            value={dayjs(data.join_date).format('DD MMM YYYY')}
          />
          <CustomerInfoField
            title="Status"
            value={data.enabled ? 'Active' : 'Inactive'}
          />
        </div>
        <div className="flex flex-col gap-2">
          <QRCode
            value={data.code} // here you should keep the link/value(string) for which you are generation promocode
            size={240} // the dimension of the QR code (number)
            // logoImage="https://ionicframework.com/docs/icons/logo-react-icon.png" // URL of the logo you want to use, make sure it is a dynamic url
            logoHeight={65}
            logoWidth={65}
            logoOpacity={1}
            enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
            qrStyle="dots" // type of qr code, wether you want dotted ones or the square ones
            eyeRadius={16} // radius of the promocode eye
            id={'QR'}
          />
        </div>
      </div>
    </>
  )
}

export default Profile
