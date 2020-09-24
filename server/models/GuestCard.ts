import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Guest from './Guest'

@Entity('guest_cards')
class GuestCard {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'identifier_number', unique: true })
  identifierNumber: string

  @OneToMany(() => Guest, guest => guest.guestCard)
  guests: Guest[]
}

export default GuestCard
