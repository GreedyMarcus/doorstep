import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Represents the configurations belong to the Company entity.
 */
@Entity('company_register_configs')
class CompanyRegisterConfig {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'store_nationality', nullable: false, default: false })
  storeNationality: boolean

  @Column({ name: 'store_address', nullable: false, default: false })
  storeAddress: boolean

  @Column({ name: 'store_phone_number', nullable: false, default: false })
  storePhoneNumber: boolean

  @Column({ name: 'store_birthplace', nullable: false, default: false })
  storeBirthplace: boolean

  @Column({ name: 'store_birth_date', nullable: false, default: false })
  storeBirthDate: boolean

  @Column({ name: 'store_mother_name', nullable: false, default: false })
  storeMotherName: boolean

  @Column({ name: 'store_company', nullable: false, default: false })
  storeCompany: boolean

  @Column({ name: 'register_guest_card', nullable: false, default: true })
  registerGuestCard: boolean

  @Column({ name: 'track_actual_exit', nullable: false, default: true })
  trackActualExit: boolean
}

export default CompanyRegisterConfig
