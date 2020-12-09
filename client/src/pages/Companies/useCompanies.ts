import { useState, useEffect } from 'react'
import { CompanyInfo } from '../../data/types/Company'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { companiesSelector, fetchCompanies } from '../../store/company'

/**
 * Custom React hook that spearates the Company page logic.
 */
const useCompanies = () => {
  const dispatch = useAppDispatch()
  const companies = useSelector(companiesSelector)
  const [t, i18n] = useTranslation()

  // Defines which company is under editing
  const [editingCompany, setEditingCompany] = useState(null as CompanyInfo | null)

  const handleCompanyEditClick = (company: CompanyInfo) => setEditingCompany(company)
  const handleCompanyEditFinish = () => setEditingCompany(null)

  /**
   * Generates company details data from the specified company.
   */
  const getCompanyDetails = (company: CompanyInfo) => {
    return [
      { labelLanguageKey: 'page.companies.companyName', value: company.name },
      { labelLanguageKey: 'page.companies.registrationNumber', value: company.registrationNumber },
      { labelLanguageKey: 'page.companies.companyAddress', value: company.address },
      { labelLanguageKey: 'page.companies.joiningDate', value: new Date(company.createdAt).toLocaleDateString(i18n.language) }
    ]
  }

  /**
   * Generates company admin details data from the specified company.
   */
  const getCompanyAdminDetails = (company: CompanyInfo) => {
    return [
      { labelLanguageKey: 'page.companies.adminName', value: company.adminName },
      { labelLanguageKey: 'page.companies.adminEmail', value: company.adminEmail },
      { labelLanguageKey: 'page.companies.joiningDate', value: new Date(company.adminJoinedAt).toLocaleDateString(i18n.language) }
    ]
  }

  /**
   * Loads companies when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchCompanies())
  }, [])

  return [
    companies,
    editingCompany,
    getCompanyDetails,
    getCompanyAdminDetails,
    handleCompanyEditClick,
    handleCompanyEditFinish
  ] as const
}

export default useCompanies
