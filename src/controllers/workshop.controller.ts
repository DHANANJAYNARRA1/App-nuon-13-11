import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { WorkshopService } from '../services/workshop.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('workshops')
export class WorkshopController {
    constructor(private readonly workshopService: WorkshopService) {}

    @Get()
    async getAllWorkshops(): Promise<any> {
        return this.workshopService.getAllWorkshops();
    }

    @Get(':workshopId')
    async getWorkshopById(@Param('workshopId') workshopId: string, @Req() req: any): Promise<any> {
        const userId = req.user?.id ? BigInt(req.user.id) : undefined;
        return this.workshopService.getWorkshopById(BigInt(workshopId), userId);
    }

    @Post(':id/register')
    @UseGuards(JwtAuthGuard)
    async registerForWorkshop(@Param('id') workshopId: string, @Body() body: { paymentId?: string; paymentMethod?: string }, @Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.workshopService.registerForWorkshop(BigInt(workshopId), body, userId);
    }

    @Get('my-workshops')
    @UseGuards(JwtAuthGuard)
    async getMyWorkshops(@Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.workshopService.getMyWorkshops(userId);
    }

    @Get(':workshopId/materials')
    @UseGuards(JwtAuthGuard)
    async getWorkshopMaterials(@Param('workshopId') workshopId: string, @Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.workshopService.getWorkshopMaterials(BigInt(workshopId), userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createWorkshop(@Body() body: any, @Req() req: any): Promise<any> {
        return this.workshopService.createWorkshop(body, BigInt(req.user.id));
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateWorkshop(@Param('id') id: string, @Body() body: any): Promise<any> {
        return this.workshopService.updateWorkshop(BigInt(id), body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteWorkshop(@Param('id') id: string): Promise<any> {
        return this.workshopService.deleteWorkshop(BigInt(id));
    }
}