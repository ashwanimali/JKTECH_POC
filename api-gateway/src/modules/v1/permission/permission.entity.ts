
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    role: string;

    @Column()
    method: string;

    @Column()
    url: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'createdBy' })
    createdBy: User;

    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn({ name: 'updatedBy' })
    updatedBy?: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
