import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import ConsentForm from './ConsentForm'
import Visit from './Visit'
import Guest from './Guest'

@Entity('consent_form_versions')
class ConsentFormVersion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text', nullable: false })
  content: string

  @Column({ name: 'version_number', nullable: false })
  versionNumber: number

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  createdAt: Date

  @ManyToOne(() => ConsentForm, form => form.versions, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'consent_form_id' })
  consentForm: ConsentForm

  @ManyToMany(() => Visit, visit => visit.consentFormVersions)
  visits: Visit[]

  @ManyToMany(() => Guest, guest => guest.consentFormVersions)
  guests: Guest[]
}

export default ConsentFormVersion
