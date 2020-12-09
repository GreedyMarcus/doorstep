import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ConsentFormType } from '../data/enums/ConsentFormType'
import ConsentFormVersion from './ConsentFormVersion'
import OfficeBuilding from './OfficeBuilding'
import Company from './Company'

/**
 * Represents the Consent form entity.
 */
@Entity('consent_forms')
class ConsentForm {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  title: string

  @Column({ type: 'enum', enum: ConsentFormType })
  type: ConsentFormType

  @OneToOne(() => ConsentFormVersion)
  @JoinColumn({ name: 'active_version_id' })
  activeVersion: ConsentFormVersion

  @ManyToOne(() => OfficeBuilding, building => building.consentForms, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'office_building_id' })
  officeBuilding: OfficeBuilding

  @ManyToOne(() => Company, company => company.consentForms, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @OneToMany(() => ConsentFormVersion, version => version.consentForm)
  versions: ConsentFormVersion[]
}

export default ConsentForm
