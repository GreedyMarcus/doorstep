import useInput from '../../components/hooks/useInput'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import {
  activeConsentFormSelector,
  fetchConsentFormById,
  createConsentFormVersion,
  updateConsentFormVersion,
  activateConsentFormVersion
} from '../../store/consentForm'

interface ConsentFormDetailsHookProps {
  consentFormId: number
}

/**
 * Custom React hook that spearates the Consent form details logic.
 */
const useConsentFormDetails = ({ consentFormId }: ConsentFormDetailsHookProps) => {
  const dispatch = useAppDispatch()
  const activeConsentForm = useSelector(activeConsentFormSelector)

  const [openedVersion, setOpenedVersion] = useState(1)
  const [content, bindContent, changeContent] = useInput({ required: true })

  // Store active version status in local state
  const [status, setStatus] = useState({
    disabled: false,
    edited: false,
    createdNew: false,
    openedDifferent: false
  })

  /**
   * Opens the specified consent form version.
   */
  const openConsentFormVersion = (versionNumber: number) => {
    setOpenedVersion(versionNumber)
    setStatus({ ...status, openedDifferent: true })

    if (activeConsentForm) {
      changeContent(activeConsentForm.versions[versionNumber - 1].content)
    }
  }

  /**
   * Drops all changes that made to the consent forms's content.
   */
  const handleDropContentChanges = () => {
    if (activeConsentForm) {
      changeContent(activeConsentForm.versions[openedVersion - 1].content)
    }
    setStatus({ ...status, openedDifferent: true })
  }

  /**
   * Creates new consent form version with the copy of the last one's content.
   */
  const handleConsentFormVersionCreation = () => {
    setStatus({ ...status, disabled: false, edited: false, createdNew: true })
    dispatch(createConsentFormVersion(content.value))
  }

  /**
   * Updates the current consent form version.
   */
  const handleConsentFormVersionUpdate = () => {
    if (activeConsentForm) {
      dispatch(updateConsentFormVersion(activeConsentForm.versions[openedVersion - 1].id, content.value))
    }
    setStatus({ ...status, disabled: false, edited: false })
  }

  /**
   * Actives the current consent form version, therefore that will be the version to accept.
   */
  const handleConsentFormVersionActivation = () => {
    if (activeConsentForm) {
      dispatch(activateConsentFormVersion(activeConsentForm.versions[openedVersion - 1].id))
    }
    setStatus({ ...status, disabled: true, edited: false })
  }

  /**
   * Loads consent form when component mounted.
   */
  useEffect(() => {
    dispatch(fetchConsentFormById(consentFormId))
  }, [])

  /**
   * Reacts to the changes of the consent form.
   */
  useEffect(() => {
    if (!activeConsentForm) {
      dispatch(fetchConsentFormById(consentFormId))
      return
    }

    if (status.createdNew || !status.openedDifferent) {
      const openVersionNumber = activeConsentForm.versions.length
      setOpenedVersion(openVersionNumber)
      setStatus({ ...status, openedDifferent: true })
      changeContent(activeConsentForm.versions[openVersionNumber - 1].content)
    }
  }, [activeConsentForm])

  /**
   * Reacts to the changes of the consent form version.
   */
  useEffect(() => {
    if (content.value) {
      if (status.createdNew) {
        setStatus({ ...status, createdNew: false })
        return
      }

      if (status.openedDifferent) {
        let disabled = true
        if (activeConsentForm) {
          if (!activeConsentForm.activeVersion) {
            disabled = false
          } else if (
            activeConsentForm.activeVersion.versionNumber !== openedVersion &&
            activeConsentForm.versions.length === openedVersion
          ) {
            disabled = false
          }
        }
        setStatus({ ...status, openedDifferent: false, disabled, edited: false })
        return
      }

      setStatus({ ...status, disabled: false, edited: true })
    }
  }, [content.value, openedVersion])

  return [
    status,
    activeConsentForm,
    openedVersion,
    content,
    bindContent,
    changeContent,
    openConsentFormVersion,
    handleDropContentChanges,
    handleConsentFormVersionCreation,
    handleConsentFormVersionUpdate,
    handleConsentFormVersionActivation
  ] as const
}

export default useConsentFormDetails
