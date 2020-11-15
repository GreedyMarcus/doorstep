import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import UserPermission from './UserPermission'
import User from './User'

@Entity('user_roles')
class UserRole {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @ManyToMany(() => UserPermission, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'user_role_permissions',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' }
  })
  permissions: UserPermission[]

  @OneToMany(() => User, user => user.role)
  users: User[]
}

export default UserRole
