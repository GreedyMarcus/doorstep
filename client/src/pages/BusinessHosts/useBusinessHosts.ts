import { useState, useEffect } from 'react'
import { EmployeeInfo } from '../../data/types/Company'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { businessHostsSelector, fetchBusinessHosts } from '../../store/company'

/**
 * Custom React hook that spearates the Business hosts page logic.
 */
const useBusinessHosts = () => {
  const dispatch = useAppDispatch()
  const businessHosts = useSelector(businessHostsSelector)

  // Defines which business host is under editing
  const [editingBusinessHost, setEditingBusinessHost] = useState(null as EmployeeInfo | null)

  const handleBusinessHostEditClick = (host: EmployeeInfo) => setEditingBusinessHost(host)
  const handleBusinessHostEditFinish = () => setEditingBusinessHost(null)

  /**
   * Loads business hosts when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchBusinessHosts())
  }, [])

  return [businessHosts, editingBusinessHost, handleBusinessHostEditClick, handleBusinessHostEditFinish] as const
}

export default useBusinessHosts
