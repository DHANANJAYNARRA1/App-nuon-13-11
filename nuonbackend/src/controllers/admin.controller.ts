import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { NewsService } from '../services/news.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly newsService: NewsService
    ) {}

    @Get('stats')
    @UseGuards(JwtAuthGuard)
    async getStats(): Promise<any> {
        try {
            return await this.adminService.getStats();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('users')
    @UseGuards(JwtAuthGuard)
    async getUsers(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50',
        @Query('q') q?: string,
        @Query('role') role?: string
    ): Promise<any> {
        try {
            return await this.adminService.getUsers({
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                q,
                role
            });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('users')
    @UseGuards(JwtAuthGuard)
    async createUser(@Body() body: any): Promise<any> {
        try {
            return await this.adminService.createUser(body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Put('users/:id')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id') id: string, @Body() body: any): Promise<any> {
        try {
            return await this.adminService.updateUser(BigInt(id), body);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete('users/:id')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Param('id') id: string): Promise<any> {
        try {
            return await this.adminService.deleteUser(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get('bookings')
    @UseGuards(JwtAuthGuard)
    async getBookings(): Promise<any> {
        try {
            return await this.adminService.getBookings();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('payments')
    @UseGuards(JwtAuthGuard)
    async getPayments(): Promise<any> {
        try {
            return await this.adminService.getPayments();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('feedback')
    @UseGuards(JwtAuthGuard)
    async getFeedback(): Promise<any> {
        try {
            return await this.adminService.getFeedback();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('analytics')
    @UseGuards(JwtAuthGuard)
    async getAnalytics(): Promise<any> {
        try {
            return await this.adminService.getAnalytics();
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('messages/:mentorId')
    @UseGuards(JwtAuthGuard)
    async getMessages(@Param('mentorId') mentorId: string): Promise<any> {
        try {
            return await this.adminService.getMessages(BigInt(mentorId));
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('messages/:mentorId')
    @UseGuards(JwtAuthGuard)
    async sendMessage(@Param('mentorId') mentorId: string, @Body() body: { message: string }): Promise<any> {
        try {
            // TODO: Get admin user ID from guard context
            const adminId = BigInt(1); // Placeholder
            return await this.adminService.sendMessage(BigInt(mentorId), adminId, body.message);
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('mentors')
    @UseGuards(JwtAuthGuard)
    async createMentor(@Body() body: { name: string; email: string; hourlyRate?: number }): Promise<any> {
        try {
            return await this.adminService.createMentor(body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put('mentors/:id')
    @UseGuards(JwtAuthGuard)
    async updateMentor(@Param('id') id: string, @Body() body: any): Promise<any> {
        try {
            return await this.adminService.updateMentor(BigInt(id), body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Delete('mentors/:id')
    @UseGuards(JwtAuthGuard)
    async deleteMentor(@Param('id') id: string): Promise<any> {
        try {
            return await this.adminService.deleteMentor(BigInt(id));
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Post('mentors/add')
    @UseGuards(JwtAuthGuard)
    async addMentor(@Body() body: {
        name: string;
        email: string;
        specialization?: string;
        experience?: number;
        hourlyRate?: number;
    }): Promise<any> {
        try {
            return await this.adminService.addMentor(body);
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async getAllContent(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '50'
    ): Promise<any> {
        try {
            return await this.newsService.getAllNews({
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            });
        } catch (error) {
            throw new HttpException(
                { message: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Legacy methods for compatibility
    @Get('dashboard')
    @UseGuards(JwtAuthGuard)
    async getDashboardStats(): Promise<any> {
        return this.getStats();
    }

    @Put('users/:id/role')
    @UseGuards(JwtAuthGuard)
    async updateUserRole(@Param('id') id: string, @Body() body: { role: string }): Promise<any> {
        return this.updateUser(id, { role: body.role });
    }

    @Put('users/:id/deactivate')
    @UseGuards(JwtAuthGuard)
    async deactivateUser(@Param('id') id: string): Promise<any> {
        return this.updateUser(id, { active: false });
    }
}