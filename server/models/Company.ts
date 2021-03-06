import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import Address from './Address'
import OfficeBuilding from './OfficeBuilding'
import CompanyRegisterConfig from './CompanyRegisterConfig'
import ConsentForm from './ConsentForm'
import User from './User'
import Visit from './Visit'
import Guest from './Guest'

/**
 * Represents the Company entity.
 */
@Entity('companies')
class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ name: 'registration_number', unique: true })
  registrationNumber: string

  @ManyToOne(() => Address, address => address.companies, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'address_id' })
  address: Address

  @ManyToOne(() => OfficeBuilding, building => building.companies, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'office_building_id' })
  officeBuilding: OfficeBuilding

  @OneToOne(() => CompanyRegisterConfig, { nullable: true })
  @JoinColumn({ name: 'register_config_id' })
  registerConfig: CompanyRegisterConfig

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
  deletedAt: Date

  @OneToMany(() => User, user => user.company)
  employees: User[]

  @OneToMany(() => ConsentForm, form => form.company)
  consentForms: ConsentForm[]

  @OneToMany(() => Visit, visit => visit.company)
  visits: Visit[]

  @OneToMany(() => Guest, guest => guest.company)
  guests: Guest[]
}

export default Company
