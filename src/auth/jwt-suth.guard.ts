import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private authService: AuthService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
    
            const tokenInBlaclList = await this.authService.checkTokenInBlackList(token);
    
            console.log(tokenInBlaclList);
    
            if (tokenInBlaclList) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            }
    
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            }
    
            const user = this.jwtService.verify(token);
            req.user = user;
            req.token = token;
            return true;
        } catch(e){
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        }
        // try {
        //     const authHeader = req.headers.authorization;
        //     const bearer = authHeader.split(' ')[0];
        //     const token = authHeader.split(' ')[1];

        //     if (this.authService.checkTokenInBlackList(token)) {
        //         throw new UnauthorizedException({ message: 'Пользователь1 не авторизован' });
        //     }

        //     console.log(bearer);
        //     console.log(token);

        //     if (bearer !== 'Bearer' || !token) {
        //         throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        //     }

        //     const user = this.jwtService.verify(token);
        //     req.user = user;
        //     req.token = token;
        //     return true;

        // } catch (e) {
        //     throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
        // }
    }

}