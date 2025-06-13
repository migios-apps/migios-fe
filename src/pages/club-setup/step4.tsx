import { Avatar, Button, Card, Checkbox } from '@/components/ui'
import { Faker, id_ID } from '@faker-js/faker'
import { ArrowRight2 } from 'iconsax-react'
import { HiOutlineUser } from 'react-icons/hi'
import { ReturnClubFormSchema } from './validation'

type PropsType = {
  onFinished?: () => void
  formProps: ReturnClubFormSchema
  isLoading?: boolean
}

const customFaker = new Faker({
  locale: [id_ID],
})

function createRandomUser() {
  return {
    name: customFaker.name.fullName(),
    email: customFaker.internet.email()?.toLowerCase(),
    photo: customFaker.image.avatar(),
    address: customFaker.address.streetAddress(),
    identity_number: '123456789',
    identity_type: customFaker.helpers.arrayElement(['ktp', 'sim', 'passport']),
    birth_date: customFaker.date.birthdate(),
    gender: customFaker.helpers.arrayElement(['m', 'f']),
    phone: customFaker.phone.number({ style: 'international' }),
    notes: 'dummy notes',
    goals: 'dummy goals',
    join_date: new Date(),
  }
}

const users = customFaker.helpers.multiple(createRandomUser, {
  count: 2,
})

const Step4: React.FC<PropsType> = ({ onFinished, formProps, isLoading }) => {
  const { watch, setValue } = formProps
  const watchData = watch()
  const dataMembers = watchData.members || []
  return (
    <div className="relative max-w-[35rem]">
      <h2>Tambahkan member percobaan?</h2>
      <span className="text-lg">
        Menambahkan member percobaan akan memberi Anda pengalaman pertama
        menggunakan Migios.
      </span>
      <div className="w-full flex flex-col mt-4 gap-4">
        {users.map((user, index) => (
          <Card key={index} bordered bodyClass="p-2 px-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar src={user.photo} icon={<HiOutlineUser />} />
                <div className="flex flex-col">
                  <h6>{user.name}</h6>
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
              <Checkbox
                checked={dataMembers.some(
                  (member) => member.email === user.email
                )}
                onChange={(value) => {
                  if (value) {
                    setValue('members', [...dataMembers, user])
                  } else {
                    setValue(
                      'members',
                      dataMembers.filter(
                        (member) => member.email !== user.email
                      )
                    )
                  }
                }}
              />
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-end w-full mt-8">
        <div></div>
        <Button
          type="submit"
          variant="solid"
          size="md"
          className="mt-4 min-w-32 rounded-full"
          icon={
            <ArrowRight2 color="currentColor" size={18} variant="Outline" />
          }
          iconAlignment="end"
          loading={isLoading}
          onClick={onFinished}
        >
          Selesai
        </Button>
      </div>
    </div>
  )
}

export default Step4
