import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import Company from './Company'
import UserRole from './UserRole'

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

  @Column({ nullable: true })
  password: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @ManyToOne(() => UserRole, role => role.users, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: UserRole

  @ManyToOne(() => Company, company => company.employees, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  createdAt: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', default: null })
  deletedAt: Date
}

export default User
