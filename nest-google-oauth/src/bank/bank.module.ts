import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Temp } from 'src/temporary.entity';
import { User } from 'src/User.entity';
import { BankController, userController } from './bank.controller';
import { BankService } from './bank.service';

@Module({
  imports:[TypeOrmModule.forFeature([User,Temp]),],
  controllers: [BankController,userController],
  providers: [BankService]
})
export class BankModule {}
