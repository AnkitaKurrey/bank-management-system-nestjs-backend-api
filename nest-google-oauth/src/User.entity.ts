import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  accountNumber:number;

  @Column()
  accountHolderName:string;

  @Column()
  accountType:string;

  @Column()
  contactNumber: number;

  @Column({default:0})
  currentBalance:number;

  @Column({default:"consumer"})
  role:string

}