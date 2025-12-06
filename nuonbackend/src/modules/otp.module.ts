import { Module } from '@nestjs/common';
import { OtpController } from '../controllers/otp.controller';
import { OtpService } from '../services/otp.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  controllers: [OtpController],
  providers: [OtpService, PrismaService],
})
export class OtpModule {}