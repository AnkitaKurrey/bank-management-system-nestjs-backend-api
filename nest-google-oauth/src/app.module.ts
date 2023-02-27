import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleStrategy } from './google.strategy';
import { VerifyToken } from './middleware/verifyToken';
import { User } from './User.entity';
import { BankModule } from './bank/bank.module';
import {ValidationPipe} from "@nestjs/common"
import { Temp } from './temporary.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'bms',
      entities: [User,Temp],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User,Temp]),
    BankModule
  ],
 
  controllers: [AppController],
  providers: [AppService, GoogleStrategy,
    {
      provide:"APP_SERVICE",
      useClass: AppService
    },
    
    
 ],
  
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    // consumer.apply(VerifyToken).forRoutes({path: 'bank', method: RequestMethod.ALL});
    consumer.apply(VerifyToken).forRoutes('bank');
    
  }
}
