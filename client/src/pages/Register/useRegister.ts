import { useState } from 'react'
import { UserRegister } from '../../data/types/User'
import { Address } from '../../data/types/Address'
import { useHistory } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { registerAccount } from '../../store/user'

/**
 * Custom React hook that spearates the Register page logic.
 */
const useRegister = () => {
  const history = useHistory()
  const dispatch = useAppDispatch()

  const [adminData, setAdminData] = useState({} as UserRegister)
  const [buildingAddressData, setBuildingAddressData] = useState({} as Address)
  const [activeStep, setActiveStep] = useState(0)

  const reviewData = { admin: adminData, address: buildingAddressData }

  /**
   * Handles the next click event of the register admin sub-component.
   */
  const handleAdminNextClick = (adminData: UserRegister) => {
    setAdminData(adminData)
    setActiveStep(activeStep + 1)
  }

  /**
   * Handles the next click event of the register building sub-component.
   */
  const handleBuildingAddressNextClick = (buildingAddressData: Address) => {
    setBuildingAddressData(buildingAddressData)
    setActiveStep(activeStep + 1)
  }

  /**
   * Handles the back click event for sub-components.
   */
  const handleBackClick = () => setActiveStep(activeStep - 1)

  /**
   * Handles the register request.
   */
  const handleRegister = async () => {
    await dispatch(registerAccount(reviewData))
    history.push('/login')
  }

  return [activeStep, reviewData, handleAdminNextClick, handleBuildingAddressNextClick, handleBackClick, handleRegister] as const
}

export default useRegister
