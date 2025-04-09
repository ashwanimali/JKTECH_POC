
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/users.entity';

@Entity()
export class Document {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    originalName: string;
  
    @Column()
    name: string;
  
    @Column()
    mimeType: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'createdBy' })
    createdBy: User;

    @ManyToOne(() => User, { eager: true, nullable: true }) // 👈 allow null for new docs
    @JoinColumn({ name: 'updatedBy' })
    updatedBy?: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
