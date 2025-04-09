import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false }) // Ensuring 'name' is required
    name: string;

    @Column({ unique: true, nullable: false }) // Ensuring 'email' is required and unique
    email: string;

    @Column({ nullable: false }) // Ensuring 'password' is required
    password: string;

    @Column({ default: 'viewer' })
    role: string;

    @Column({ nullable: true })
    createdById?: string;
}
