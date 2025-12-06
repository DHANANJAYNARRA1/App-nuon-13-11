import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Get()
    async getAllEvents(): Promise<any> {
        return this.eventService.getAllEvents();
    }

    @Get(':id')
    async getEventById(@Param('id') id: string): Promise<any> {
        return this.eventService.getEventById(BigInt(id));
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createEvent(@Body() eventData: any): Promise<any> {
        // TODO: Get user from JWT
        const userId = BigInt(1); // Placeholder
        return this.eventService.createEvent(eventData, userId);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateEvent(@Param('id') id: string, @Body() eventData: any): Promise<any> {
        return this.eventService.updateEvent(BigInt(id), eventData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteEvent(@Param('id') id: string): Promise<any> {
        return this.eventService.deleteEvent(BigInt(id));
    }

    @Post(':id/register')
    @UseGuards(JwtAuthGuard)
    async registerForEvent(
        @Param('id') id: string,
        @Body() body: { paymentId: string; paymentMethod: string }
    ): Promise<any> {
        // TODO: Get user from JWT
        const userId = BigInt(1); // Placeholder
        return this.eventService.registerForEvent(BigInt(id), userId, body);
    }

    @Get('my/registered')
    @UseGuards(JwtAuthGuard)
    async getMyEvents(): Promise<any> {
        // TODO: Get user from JWT
        const userId = BigInt(1); // Placeholder
        return this.eventService.getMyEvents(userId);
    }
}