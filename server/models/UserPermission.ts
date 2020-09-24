import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user_permissions')
class UserPermission {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string
}

export default UserPermission
