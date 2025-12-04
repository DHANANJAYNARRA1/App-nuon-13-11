import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CourseService } from '../services/course.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Get()
    async getAllCourses(): Promise<any> {
        return this.courseService.getAllCourses();
    }

    @Get(':id')
    async getCourseById(@Param('id') id: string): Promise<any> {
        // TODO: Get user from JWT if available
        const userId = undefined; // Placeholder
        return this.courseService.getCourseById(BigInt(id), userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createCourse(@Body() courseData: any): Promise<any> {
        // TODO: Get user from JWT
        const userId = BigInt(1); // Placeholder
        return this.courseService.createCourse(courseData, userId);
    }

    @Get('my/purchased')
    @UseGuards(JwtAuthGuard)
    async getMyCourses(): Promise<any> {
        // TODO: Get user from JWT
        const userId = BigInt(1); // Placeholder
        return this.courseService.getMyCourses(userId);
    }

    @Post(':id/purchase')
    @UseGuards(JwtAuthGuard)
    async purchaseCourse(
        @Param('id') id: string,
        @Body() body: { paymentMethod: string; paymentId: string }
    ): Promise<any> {
        // TODO: Get user from JWT
        const userId = BigInt(1); // Placeholder
        return this.courseService.purchaseCourse(BigInt(id), userId, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCourse(@Param('id') id: string): Promise<any> {
        return this.courseService.deleteCourse(BigInt(id));
    }
}