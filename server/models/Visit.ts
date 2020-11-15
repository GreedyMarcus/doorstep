import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { VisitPurpose } from '../data/enums/VisitPurpose'
import ConsentFormVersion from './ConsentFormVersion'
import Guest from './Guest'
import User from './User'
import Company from './Company'

@Entity('visits')
class Visit {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'planned_entry', type: 'timestamp', nullable: false })
  plannedEntry: Date

  @ManyToOne(() => User, host => host.visits, { nullable: false })
  @JoinColumn({ name: 'business_host_id' })
  businessHost: User

  @Column({ type: 'enum', enum: VisitPurpose })
  purpose: VisitPurpose

  @Column({ nullable: false })
  room: string

  @Column({ type: 'timestamp', nullable: true })
  expiration: Date

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  createdAt: Date

  @ManyToOne(() => Company, company => company.consentForms, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company

  @ManyToMany(() => Guest, guest => guest.visits, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'visit_participation',
    joinColumn: { name: 'visit_id' },
    inverseJoinColumn: { name: 'guest_id' }
  })
  guests: Guest[]

  @ManyToMany(() => ConsentFormVersion, version => version.visits, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'visit_consent_forms_log',
    joinColumn: { name: 'visit_id' },
    inverseJoinColumn: { name: 'consent_form_version_id' }
  })
  consentFormVersions: ConsentFormVersion[]
}

export default Visit
