import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true, nullable: false })
  userName: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
