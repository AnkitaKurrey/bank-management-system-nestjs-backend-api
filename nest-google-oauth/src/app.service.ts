import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetails } from './types.dto';
import { User } from './User.entity';
import * as jwt from "jsonwebtoken"

@Injectable()
export class AppService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,) { }

  async googleLogin(req) {
    if (!req.user) {
      return "No user from google"
    }

    const user = await this.userRepository.findOneBy({ email: req.user.email });
    // console.log(user);

    if (user) {
      // return user
      const authToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, "ANKITA")
      // console.log(authToken);

      return { accessToken: authToken }

    }
    console.log('User not found. Creating...');
    const newUser = this.userRepository.create({ email: req.user.email });
    await this.userRepository.save(newUser);

    return {
      email: newUser.email,
      id: newUser.id
    }
  }

}

