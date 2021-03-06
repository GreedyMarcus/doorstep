import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { IdentifierCardType } from '../data/enums/IdentifierCardType'
import { GuestParticipationStatus } from '../data/enums/GuestParticipationStatus'
import Address from './Address'
import User from './User'
import GuestCard from './GuestCard'
import Visit from './Visit'
import ConsentFormVersion from './ConsentFormVersion'
import Company from './Company'

/**
 * Represents the Guest entity.
 */
@Entity('guests')
class Guest {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, user => user.guests, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ nullable: true })
  nationality: string

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string

  @Column({ nullable: true })
  birthplace: string

  @Column({ name: 'birth_date', nullable: true })
  birthDate: string

  @Column({ name: 'mother_name', nullable: true })
  motherName: string

  @ManyToOne(() => Address, address => address.guests, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'address_id' })
  address: Address

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string

  @Column({ name: 'identifier_card_type', type: 'enum', enum: IdentifierCardType })
  identifierCardType: IdentifierCardType

  @Column({ name: 'identifier_card_number', nullable: true })
  identifierCardNumber: string

  @Column({ name: 'signature', type: 'text', nullable: true })
  signature: string

  @Column({ name: 'participation_status', type: 'enum', enum: GuestParticipationStatus })
  participationStatus: GuestParticipationStatus

  @Column({ name: 'actual_entry', type: 'timestamp', nullable: true })
  actualEntry: Date

  @Column({ name: 'actual_exit', type: 'timestamp', nullable: true })
  actualExit: Date

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date

  @ManyToOne(() => User, receptionist => receptionist.guests, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'receptionist_id' })
  receptionist: User

  @ManyToOne(() => GuestCard, guestCard => guestCard.guests, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'guest_card_id' })
  guestCard: GuestCard

  @ManyToOne(() => Company, company => company.guests, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company

  @ManyToMany(() => Visit, visit => visit.guests)
  visits: Visit[]

  @ManyToMany(() => ConsentFormVersion, version => version.guests, { nullable: false, cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'guest_consent_forms_acceptance',
    joinColumn: { name: 'guest_id' },
    inverseJoinColumn: { name: 'consent_form_version_id' }
  })
  consentFormVersions: ConsentFormVersion[]
}

export default Guest
