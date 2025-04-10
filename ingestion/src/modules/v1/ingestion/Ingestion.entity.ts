import { IngestionStatusEnum } from 'src/common/utils/constant';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Ingestion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    documentId: string;

    @Column()
    createdBy: string;

    @Column({ enum: IngestionStatusEnum, enumName: 'Status' })
    status: IngestionStatusEnum;

    @Column({default : ""})
    updatedBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
