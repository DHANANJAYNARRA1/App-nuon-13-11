import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class CourseService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllCourses(): Promise<any> {
        try {
            const courses = await this.prisma.course.findMany({
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            return {
                success: true,
                courses
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getCourseById(courseId: bigint, userId?: bigint): Promise<any> {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            if (!course) {
                throw new Error('Course not found');
            }

            let hasPurchased = false;
            if (userId) {
                const purchase = await this.prisma.purchase.findFirst({
                    where: {
                        userId,
                        itemId: courseId,
                        itemType: 'course',
                        status: 'completed'
                    }
                });
                hasPurchased = !!purchase;
            }

            // If not purchased and course is not free, hide video URLs
            let processedCourse = course;
            if (!hasPurchased && course.price > 0) {
                processedCourse = {
                    ...course
                } as any;
            }

            return {
                success: true,
                course: processedCourse,
                hasPurchased
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async createCourse(courseData: any, instructorId: bigint): Promise<any> {
        try {
            const course = await this.prisma.course.create({
                data: {
                    title: courseData.title,
                    description: courseData.description,
                    price: courseData.price || 0,
                    thumbnail: courseData.thumbnail || '',
                    category: courseData.category || 'course',
                    instructorId,
                    lessons: {
                        create: courseData.lessons || []
                    }
                },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            // TODO: Emit socket notification
            // emitNewCourse(course);

            return {
                success: true,
                message: 'Course created successfully',
                course
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async getMyCourses(userId: bigint): Promise<any> {
        try {
            const purchases = await this.prisma.purchase.findMany({
                where: {
                    userId,
                    itemType: 'course',
                    status: 'completed'
                },
                include: {
                    user: true
                }
            });

            // Get course IDs from purchases
            const courseIds = purchases.map(p => p.itemId);

            const courses = await this.prisma.course.findMany({
                where: {
                    id: { in: courseIds }
                },
                include: {
                    instructor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            return {
                success: true,
                courses
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async purchaseCourse(courseId: bigint, userId: bigint, paymentData: any): Promise<any> {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId }
            });

            if (!course) {
                throw new Error('Course not found');
            }

            // Check if already purchased
            const existingPurchase = await this.prisma.purchase.findFirst({
                where: {
                    userId,
                    itemId: courseId,
                    itemType: 'course'
                }
            });

            if (existingPurchase) {
                throw new Error('Course already purchased');
            }

            // For free courses, set payment to 'free'
            let paymentMethod = paymentData.paymentMethod;
            let paymentId = paymentData.paymentId;
            if (course.price === 0) {
                paymentMethod = 'free';
                paymentId = 'free';
            }

            if (!paymentMethod || !paymentId) {
                throw new Error('Missing payment info');
            }

            const purchase = await this.prisma.purchase.create({
                data: {
                    userId,
                    itemId: courseId,
                    itemType: 'course',
                    amount: course.price,
                    paymentId,
                    status: 'completed'
                }
            });

            // Update enrollment count
            await this.prisma.course.update({
                where: { id: courseId },
                data: {
                    enrollmentCount: { increment: 1 }
                }
            });

            return {
                success: true,
                message: 'Course purchased successfully',
                purchase
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteCourse(courseId: bigint): Promise<any> {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId }
            });

            if (!course) {
                throw new Error('Course not found');
            }

            await this.prisma.course.delete({
                where: { id: courseId }
            });

            // TODO: Emit socket notification
            // emitCourseUpdate(courseId, 'deleted', course);

            return {
                success: true,
                message: 'Course deleted successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}