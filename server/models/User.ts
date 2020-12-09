import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import Company from './Company'
import UserRole from './UserRole'
import Guest from './Guest'
import Visit from './Visit'
import OfficeBuilding from './OfficeBuilding'

/**
 * Represents the User entity.
 */
@Entity('users')
class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'first_name', nullable: false })
  firstName: string

  @Column({ name: 'last_name', nullable: false })
  lastName: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ name: 'password_token', nullable: true })
  passwordToken: string

  @ManyToOne(() => UserRole, role => role.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: UserRole

  @ManyToOne(() => Company, company => company.employees, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company

  @ManyToOne(() => OfficeBuilding, building => building.employees, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'office_building_id' })
  officeBuilding: OfficeBuilding

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
  deletedAt: Date

  @OneToMany(() => Visit, visit => visit.businessHost)
  visits: Visit[]

  @OneToMany(() => Guest, guest => guest.user)
  guests: Guest[]
}

export default User
