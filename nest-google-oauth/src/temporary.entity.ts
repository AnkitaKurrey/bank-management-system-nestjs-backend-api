import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'temp' })
export class Temp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  accountNumber:number;

  @Column()
  accountHolderName:string;

  @Column()
  contactNumber: number;

  @Column({default:"pending"})
  status:string;
  

}