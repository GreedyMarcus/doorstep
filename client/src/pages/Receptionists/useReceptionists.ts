import { useState, useEffect } from 'react'
import { EmployeeInfo } from '../../data/types/Company'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { receptionistsSelector, fetchReceptionists } from '../../store/building'

/**
 * Custom React hook that spearates the Receptionists page logic.
 */
const useReceptionists = () => {
  const dispatch = useAppDispatch()
  const receptionists = useSelector(receptionistsSelector)

  // Defines which receptionist is under editing
  const [editReceptionist, setEditReceptionist] = useState(null as EmployeeInfo | null)

  const handleReceptionistEditClick = (receptionist: EmployeeInfo) => setEditReceptionist(receptionist)
  const handleReceptionistEditFinish = () => setEditReceptionist(null)

  /**
   * Loads receptionists when component mounted.
   */
  useEffect(() => {
    dispatch(fetchReceptionists())
  }, [])

  return [receptionists, editReceptionist, handleReceptionistEditClick, handleReceptionistEditFinish] as const
}

export default useReceptionists
