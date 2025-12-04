import { Body, Controller, Get, Post, Put, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserDto } from '../dto/user.dto';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Email/password login
    @Post('auth/login')
    async login(@Body() body: { email: string; password: string }): Promise<Record<string, unknown>> {
        console.log('🔐 LOGIN REQUEST RECEIVED:', { email: body.email, hasPassword: !!body.password });
        try {
            const result = await this.authService.login(body.email, body.password);
            console.log('✅ LOGIN SUCCESS:', { email: body.email, userId: (result.user as any)?.id });
            return result;
        } catch (error) {
            console.error('❌ LOGIN ERROR:', { email: body.email, error: (error as Error).message });
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    // OTP login (keeping for compatibility)
    @Post('auth/login-otp')
    async loginOtp(@Body() loginDto: UserDto): Promise<Record<string, unknown>> {
        try {
            return await this.authService.loginOtp(loginDto);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
    }

    // Mentor login
    @Post('auth/mentor-login')
    async mentorLogin(@Body() body: { email: string; password: string }): Promise<Record<string, unknown>> {
        try {
            return await this.authService.mentorLogin(body.email, body.password);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    // Register
    @Post('auth/register')
    async register(@Body() body: {
        name: string;
        email?: string;
        password: string;
        phoneNumber: string;
        specialization?: string;
        experience?: number;
        organization?: string;
        city?: string;
        state?: string;
        location?: string;
        role?: string;
    }): Promise<Record<string, unknown>> {
        try {
            return await this.authService.register(body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // Get profile by ID
    @Get('profile/:id')
    async getProfile(@Param('id') id: string): Promise<Record<string, unknown>> {
        try {
            return await this.authService.getProfile(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.NOT_FOUND
            );
        }
    }

    // Get current user profile
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getCurrentProfile(): Promise<Record<string, unknown>> {
        try {
            // TODO: Get user from JWT guard context
            const userId = BigInt(1); // Placeholder - should get from guard
            return await this.authService.getCurrentProfile(userId);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Update profile
    @Put('profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Body() body: {
        name?: string;
        specialization?: string;
        experience?: number;
        location?: string;
    }): Promise<Record<string, unknown>> {
        try {
            // TODO: Get user from JWT guard context
            const userId = BigInt(1); // Placeholder - should get from guard
            return await this.authService.updateProfile(userId, body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Create or update profile
    @Post('profile')
    @UseGuards(JwtAuthGuard)
    async createOrUpdateProfile(@Body() body: {
        name?: string;
        specialization?: string;
        experience?: number;
        location?: string;
    }): Promise<Record<string, unknown>> {
        try {
            // TODO: Get user from JWT guard context
            const userId = BigInt(1); // Placeholder - should get from guard
            return await this.authService.createOrUpdateProfile(userId, body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('create-role')
    async createRole(@Body() body: { name: string }): Promise<Record<string, unknown>> {
        try {
            return await this.authService.createRole(body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.UNPROCESSABLE_ENTITY
            );
        }
    }

    @Post('refresh')
    async refresh(): Promise<{ status: string; accessToken: string }> {
        try {
            // TODO: Implement refresh logic
            return await this.authService.refresh();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message, status: 'error' },
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    @Post('logout')
    logout(): { message: string } {
        // TODO: Implement logout with cookie clearing
        return { message: 'Logged out successfully' };
    }
}
