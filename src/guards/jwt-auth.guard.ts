import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.accessToken || request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new HttpException(
                { message: 'No access token', status: 'error' },
                HttpStatus.UNAUTHORIZED
            );
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
            request.user = decoded;
            return true;
        } catch {
            throw new HttpException(
                { message: 'Invalid or expired token', status: 'error' },
                HttpStatus.UNAUTHORIZED
            );
        }
    }
}
