import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean  {
        const request = context.switchToHttp().getRequest()
        // console.log("guard checkadmin data ",request?.user);
        
        if(request?.user.role === 'consumer'){
            return false
        }
        return true
    }

}