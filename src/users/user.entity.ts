import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  public password: string;
}

export default User;
