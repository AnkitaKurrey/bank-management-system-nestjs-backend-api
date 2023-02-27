import { PassportStrategy } from "@nestjs/passport";
import {Strategy, VerifyCallback} from 'passport-google-oauth20'
import { Inject, Injectable} from '@nestjs/common'
import { AppService } from "./app.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor(){
        super({
            clientID:"280521106033-ijpt93fek987a1jc52aq35fg3jsc2qlc.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:5000/auth/google/callback",
            scope: ['email', 'profile']
        })
    }
    async validate(acessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>{
        const {name, emails, photos} = profile
        // console.log(profile);
        
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            acessToken
        }
        done(null, user)
       


    }

   
}