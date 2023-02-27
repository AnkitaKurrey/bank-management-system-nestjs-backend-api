import { NestMiddleware, Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'

dotenv.config();

@Injectable()
export class VerifyToken implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        //    console.log("middleware");

        const authTokenWithBearer = req.headers.authorizaion
        // console.log(req.headers);
        let payload
        if (typeof authTokenWithBearer === 'string') {
            const authToken = authTokenWithBearer.split(" ")[1]
            payload = jwt.verify(authToken, process.env.SECRET_KEY, function (err, decoded) {
                // console.log("mw jwt invalid");

                if (err) throw new UnauthorizedException
                return decoded
            })
        }

        if (!authTokenWithBearer) {
            // console.log("mw jwt token not available");          
            throw new UnauthorizedException
        }


        Object.assign(req, { user: payload });

        next()
    }

}