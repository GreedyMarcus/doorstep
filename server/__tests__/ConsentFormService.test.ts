import Boom from '@hapi/boom'
import ConsentForm from '../models/ConsentForm'
import ConsentFormVersion from '../models/ConsentFormVersion'
import { ConsentFormService } from '../services/consentForm'
import { ConsentFormRepository } from '../repositories/consentForm'
import { ConsentFormType } from '../data/enums/ConsentFormType'

describe('ConsentFormService tests', () => {
  let serviceUnderTest: ConsentFormService

  let mockConsentFormsData: ConsentForm[]
  let mockConsentFormVersionsData: ConsentFormVersion[]

  describe('updateConsentFormVersion tests', () => {
    beforeEach(() => {
      // Initialize mock data
      mockConsentFormsData = initConsentFormsData()
      mockConsentFormVersionsData = initConsentFormVersionsData()

      // Provide mocked functionaliy
      jest.mock('../repositories/consentForm/ConsentFormRepository.ts')

      const consentFormMockRepository = new ConsentFormRepository() as jest.Mocked<ConsentFormRepository>
      consentFormMockRepository.findConsentFormById = jest.fn().mockImplementation((formId: number) => {
        return Promise.resolve(mockConsentFormsData.find(form => form.id === formId))
      })
      consentFormMockRepository.findConsentFormVersionById = jest.fn().mockImplementation((versionId: number) => {
        return Promise.resolve(mockConsentFormVersionsData.find(version => version.id === versionId))
      })
      consentFormMockRepository.updateConsentFormVersion = jest.fn().mockImplementation((versionId: number, content: string) => {
        const foundVersion = mockConsentFormVersionsData.find(version => version.id === versionId)
        foundVersion.content = content
        return Promise.resolve(foundVersion)
      })

      // Initialize the mocked service
      serviceUnderTest = new ConsentFormService(consentFormMockRepository)
    })

    it('should throw 404 Not Found error when consent form does not exist.', async () => {
      // Arrange
      const formId = 99
      const versionId = 1
      const content = 'This is the updated content.'

      // Act
      try {
        await serviceUnderTest.updateConsentFormVersion(formId, versionId, content)
      } catch (err) {
        // Assert
        expect(Boom.isBoom(err)).toEqual(true)
        expect((err as Boom.Boom).output.statusCode).toEqual(404)
      }
    })

    it('should throw 404 Not Found error when consent form version does not exist.', async () => {
      // Arrange
      const formId = 1
      const versionId = 99
      const content = 'This is the updated content.'

      // Act
      try {
        await serviceUnderTest.updateConsentFormVersion(formId, versionId, content)
      } catch (err) {
        // Assert
        expect(Boom.isBoom(err)).toEqual(true)
        expect((err as Boom.Boom).output.statusCode).toEqual(404)
      }
    })

    it('should throw 400 Bad Request error when the form version does not belong to the specified consent form.', async () => {
      // Arrange
      const formId = 1
      const versionId = 3
      const content = 'This is the updated content.'

      // Act
      try {
        await serviceUnderTest.updateConsentFormVersion(formId, versionId, content)
      } catch (err) {
        // Assert
        expect(Boom.isBoom(err)).toEqual(true)
        expect((err as Boom.Boom).output.statusCode).toEqual(400)
      }
    })

    it('should throw 400 Bad Request error when the consent form version is already activated.', async () => {
      // Arrange
      const formId = 2
      const versionId = 3
      const content = 'This is the updated content.'

      // Act
      try {
        await serviceUnderTest.updateConsentFormVersion(formId, versionId, content)
      } catch (err) {
        // Assert
        expect(Boom.isBoom(err)).toEqual(true)
        expect((err as Boom.Boom).output.statusCode).toEqual(400)
      }
    })

    it('should throw 400 Bad Request error when there is a newer consent form version.', async () => {
      // Arrange
      const formId = 1
      const versionId = 1
      const content = 'This is the updated content.'

      // Act
      try {
        await serviceUnderTest.updateConsentFormVersion(formId, versionId, content)
      } catch (err) {
        // Assert
        expect(Boom.isBoom(err)).toEqual(true)
        expect((err as Boom.Boom).output.statusCode).toEqual(400)
      }
    })

    it('should throw 400 Bad Request error when there is a newer consent form version that is already activated.', async () => {
      // Arrange
      const formId = 3
      const versionId = 4
      const content = 'This is the updated content.'

      // Act
      try {
        await serviceUnderTest.updateConsentFormVersion(formId, versionId, content)
      } catch (err) {
        // Assert
        expect(Boom.isBoom(err)).toEqual(true)
        expect((err as Boom.Boom).output.statusCode).toEqual(400)
      }
    })

    it('should return with the updated consent form version.', async () => {
      // Arrange
      const formId = 4
      const versionId = 6
      const content = 'This is the updated content.'

      // Act
      const result = await serviceUnderTest.updateConsentFormVersion(formId, versionId, content)

      // Assert
      expect(result.content).toEqual(content)
    })
  })
})

function initConsentFormsData(): ConsentForm[] {
  const form1 = new ConsentForm()
  form1.id = 1
  form1.activeVersion = {
    id: 1,
    content: 'Test content',
    versionNumber: 1,
    createdAt: new Date('2020-12-05 18:28:13.540223'),
    consentForm: undefined,
    visits: [],
    guests: []
  }
  form1.type = ConsentFormType.GLOBAL
  form1.versions = [
    {
      id: 1,
      content: 'Test content',
      versionNumber: 1,
      createdAt: new Date('2020-12-05 18:28:13.540223'),
      consentForm: undefined,
      visits: [],
      guests: []
    },
    {
      id: 2,
      content: 'Test content',
      versionNumber: 2,
      createdAt: new Date('2020-12-06 18:28:13.540223'),
      consentForm: undefined,
      visits: [],
      guests: []
    }
  ]

  const form2 = new ConsentForm()
  form2.id = 2
  form2.activeVersion = {
    id: 3,
    content: 'Test content',
    versionNumber: 1,
    createdAt: new Date('2020-12-05 18:28:13.540223'),
    consentForm: undefined,
    visits: [],
    guests: []
  }
  form2.type = ConsentFormType.GLOBAL
  form2.versions = [
    {
      id: 3,
      content: 'Test content',
      versionNumber: 1,
      createdAt: new Date('2020-12-05 18:28:13.540223'),
      consentForm: undefined,
      visits: [],
      guests: []
    }
  ]

  const form3 = new ConsentForm()
  form3.id = 3
  form3.activeVersion = {
    id: 5,
    content: 'Test content',
    versionNumber: 2,
    createdAt: new Date('2020-12-05 18:28:13.540223'),
    consentForm: undefined,
    visits: [],
    guests: []
  }
  form3.type = ConsentFormType.GLOBAL
  form3.versions = [
    {
      id: 4,
      content: 'Test content',
      versionNumber: 1,
      createdAt: new Date('2020-12-05 18:28:13.540223'),
      consentForm: undefined,
      visits: [],
      guests: []
    },
    {
      id: 5,
      content: 'Test content',
      versionNumber: 2,
      createdAt: new Date('2020-12-06 18:28:13.540223'),
      consentForm: undefined,
      visits: [],
      guests: []
    }
  ]

  const form4 = new ConsentForm()
  form4.id = 4
  form4.activeVersion = null
  form4.type = ConsentFormType.GLOBAL
  form4.versions = [
    {
      id: 6,
      content: 'Test content',
      versionNumber: 1,
      createdAt: new Date('2020-12-05 18:28:13.540223'),
      consentForm: undefined,
      visits: [],
      guests: []
    }
  ]

  return [form1, form2, form3, form4]
}

function initConsentFormVersionsData(): ConsentFormVersion[] {
  const version1 = new ConsentFormVersion()
  version1.id = 1
  version1.content = 'Test content'
  version1.versionNumber = 1

  const version2 = new ConsentFormVersion()
  version2.id = 2
  version2.content = 'Test content'
  version2.versionNumber = 2

  const version3 = new ConsentFormVersion()
  version3.id = 3
  version3.content = 'Test content'
  version3.versionNumber = 1

  const version4 = new ConsentFormVersion()
  version4.id = 4
  version4.content = 'Test content'
  version4.versionNumber = 1

  const version5 = new ConsentFormVersion()
  version5.id = 5
  version5.content = 'Test content'
  version5.versionNumber = 2

  const version6 = new ConsentFormVersion()
  version6.id = 6
  version6.content = 'Test content'
  version6.versionNumber = 1

  return [version1, version2, version3, version4, version5, version6]
}
