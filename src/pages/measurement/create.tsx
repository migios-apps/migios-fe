import FormPageMeasurement from '@/components/form/measurement/FormPageMeasurement'
import { useMeasurementForm } from '@/components/form/measurement/validation'
import { useNavigate } from 'react-router-dom'

const CreateMeasurement = () => {
  const formProps = useMeasurementForm()
  const navigate = useNavigate()

  const onClose = () => {
    navigate('/measurement')
  }

  return (
    <FormPageMeasurement
      type="create"
      formProps={formProps}
      onSuccess={onClose}
    />
  )
}

export default CreateMeasurement
