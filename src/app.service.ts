import { Injectable } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {}

    getHello(): object {
        //return 'Hello from NestJS + Docker!';
        return {
            message: 'Hello, world!',
            success: true,
            data: {
                timestamp: new Date()
            }
        };
    }

    // Ensure an admin user exists on startup
    async ensureAdminUser(): Promise<void> {
        try {
            console.log('⏳ Checking for admin user...');
            const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nuonhub.com').toLowerCase();
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';

            // Remove old admin user if exists
            await this.prisma.user.deleteMany({
                where: { email: 'admin@neonclub.com' }
            });

            // Also remove the new admin if it exists to recreate it
            await this.prisma.user.deleteMany({
                where: { email: 'admin@nuonhub.com' }
            });

            // Find or create admin role
            let adminRole = await this.prisma.role.findFirst({
                where: { name: 'admin' }
            });

            if (!adminRole) {
                adminRole = await this.prisma.role.create({
                    data: { name: 'admin' }
                });
            }

            // Check if admin user already exists
            const existing = await this.prisma.user.findFirst({
                where: {
                    email: adminEmail
                },
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            });

            if (existing) {
                console.log('✅ Admin user exists:', adminEmail);
                return;
            }

            // Create admin user
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const admin = await this.prisma.user.create({
                data: {
                    name: 'System Administrator',
                    email: adminEmail,
                    password: hashedPassword,
                    role_id: Number(adminRole.id),
                    active: true
                } as any
            });

            console.log('🎉 Admin user created:', adminEmail);
            console.log('🔑 Admin login credentials:');
            console.log('   Email:', adminEmail);
            console.log('   Password:', adminPassword);
        } catch (err) {
            console.log('⚠️ Unable to ensure admin user:', (err as Error).message);
        }
    }
}
