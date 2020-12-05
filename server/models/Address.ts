import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import OfficeBuilding from './OfficeBuilding'
import Company from './Company'
import Guest from './Guest'

/**
 * Represents the Address entity.
 */
@Entity('addresses')
class Address {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  country: string

  @Column({ name: 'zip_code', nullable: false })
  zipCode: string

  @Column({ nullable: false })
  city: string

  @Column({ name: 'street_address', nullable: false })
  streetAddress: string

  @OneToMany(() => OfficeBuilding, building => building.address)
  officeBuildings: OfficeBuilding[]

  @OneToMany(() => Company, company => company.address)
  companies: Company[]

  @OneToMany(() => Guest, guest => guest.address)
  guests: Guest[]
}

export default Address
