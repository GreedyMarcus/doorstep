import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import Address from './Address'
import User from './User'
import Company from './Company'
import ConsentForm from './ConsentForm'

/**
 * Represents the Office building entity.
 */
@Entity('office_buildings')
class OfficeBuilding {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Address, address => address.officeBuildings, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'address_id' })
  address: Address

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'admin_id' })
  admin: User

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @CreateDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
  deletedAt: Date

  @OneToMany(() => Company, company => company.officeBuilding)
  companies: Company[]

  @OneToMany(() => ConsentForm, form => form.officeBuilding)
  consentForms: ConsentForm[]

  @OneToMany(() => User, user => user.officeBuilding)
  employees: User[]
}

export default OfficeBuilding
