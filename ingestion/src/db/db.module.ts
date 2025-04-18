import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeORMFactory } from "src/factories/typeorm.factory";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMFactory,
    }),
  ],
})
export class DbModule {}
