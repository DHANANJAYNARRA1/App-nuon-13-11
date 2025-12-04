import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AdminContentService {
    constructor(private readonly prisma: PrismaService) {}

    // Workshops
    async listWorkshops(query: { page?: string; limit?: string; q?: string; published?: string }): Promise<any> {
        try {
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '20', 10);
            const filter: any = {};

            if (query.q) filter.title = { contains: query.q };
            if (query.published !== undefined) filter.isPublished = query.published === 'true';

            const workshops = await this.prisma.workshop.findMany({
                where: filter,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            });

            const total = await this.prisma.workshop.count({ where: filter });

            return {
                workshops,
                total,
                page,
                limit
            };
        } catch (error) {
            console.error('listWorkshops', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async createWorkshop(body: any, userId: bigint): Promise<any> {
        try {
            if (!body.title || !body.slug) {
                return { message: 'title and slug required' };
            }

            const existing = await this.prisma.workshop.findFirst({
                where: { title: body.slug } // Using title as slug for simplicity
            });

            if (existing) {
                return { message: 'slug already exists' };
            }

            const workshop = await this.prisma.workshop.create({
                data: {
                    ...body,
                    createdBy: userId
                }
            });

            // TODO: Emit socket event
            // const io = getSocket && getSocket();
            // if (io) io.emit('content:workshop:created', { workshopId: workshop.id, title: workshop.title, slug: workshop.title });

            return { workshop };
        } catch (error) {
            console.error('createWorkshop', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async getWorkshop(workshopId: bigint): Promise<any> {
        try {
            const workshop = await this.prisma.workshop.findUnique({
                where: { id: workshopId },
                include: {
                    creator: { select: { name: true, email: true } }
                }
            });

            if (!workshop) {
                return { message: 'Not found' };
            }

            return { workshop };
        } catch (error) {
            console.error('getWorkshop', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async updateWorkshop(workshopId: bigint, body: any): Promise<any> {
        try {
            const workshop = await this.prisma.workshop.update({
                where: { id: workshopId },
                data: body
            });

            // TODO: Emit socket event
            // const io = getSocket && getSocket();
            // if (io) io.emit('content:workshop:updated', { workshopId: workshop.id });

            return { workshop };
        } catch (error) {
            console.error('updateWorkshop', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async deleteWorkshop(workshopId: bigint): Promise<any> {
        try {
            await this.prisma.workshop.delete({
                where: { id: workshopId }
            });

            // TODO: Emit socket event
            // const io = getSocket && getSocket();
            // if (io) io.emit('content:workshop:deleted', { workshopId: workshopId });

            return { message: 'deleted' };
        } catch (error) {
            console.error('deleteWorkshop', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    // Sessions
    async listSessions(query: { page?: string; limit?: string; workshopId?: string }): Promise<any> {
        try {
            const page = parseInt(query.page || '1', 10);
            const limit = parseInt(query.limit || '20', 10);
            const filter: any = {};

            if (query.workshopId) filter.workshopId = BigInt(query.workshopId);

            const sessions = await this.prisma.workshopSession.findMany({
                where: filter,
                include: {
                    workshop: { select: { id: true, title: true, slug: true } }
                },
                orderBy: { startsAt: 'asc' },
                skip: (page - 1) * limit,
                take: limit
            });

            const total = await this.prisma.workshopSession.count({ where: filter });

            return {
                sessions,
                total,
                page,
                limit
            };
        } catch (error) {
            console.error('listSessions', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async createSession(body: any): Promise<any> {
        try {
            if (!body.workshopId || !body.title) {
                return { message: 'workshopId and title required' };
            }

            const session = await this.prisma.workshopSession.create({
                data: {
                    workshopId: BigInt(body.workshopId),
                    title: body.title,
                    description: body.description || '',
                    sessionType: body.sessionType || 'lecture',
                    startsAt: body.startsAt ? new Date(body.startsAt) : null,
                    endsAt: body.endsAt ? new Date(body.endsAt) : null,
                    mentors: body.mentors || [],
                    capacity: body.capacity || 0,
                } as any,
                include: {
                    workshop: { select: { id: true, title: true, slug: true } }
                }
            });

            // TODO: Emit socket event
            // const io = getSocket && getSocket();
            // if (io) io.emit('content:session:created', { sessionId: session.id, workshopId: session.workshopId, title: session.title });

            return { session };
        } catch (error) {
            console.error('createSession', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async getSession(sessionId: bigint): Promise<any> {
        try {
            const session = await this.prisma.workshopSession.findUnique({
                where: { id: sessionId },
                include: {
                    workshop: { select: { id: true, title: true, slug: true, mentors: true } }
                }
            });

            if (!session) {
                return { message: 'Not found' };
            }

            return { session };
        } catch (error) {
            console.error('getSession', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async updateSession(sessionId: bigint, body: any): Promise<any> {
        try {
            const updateData: any = { ...body };
            if (body.startsAt) updateData.startsAt = new Date(body.startsAt);
            if (body.endsAt) updateData.endsAt = new Date(body.endsAt);

            const session = await this.prisma.workshopSession.update({
                where: { id: sessionId },
                data: updateData,
                include: {
                    workshop: { select: { id: true, title: true, slug: true } }
                }
            });

            // TODO: Emit socket event
            // const io = getSocket && getSocket();
            // if (io) io.emit('content:session:updated', { sessionId: session.id });

            return { session };
        } catch (error) {
            console.error('updateSession', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }

    async deleteSession(sessionId: bigint): Promise<any> {
        try {
            await this.prisma.workshopSession.delete({
                where: { id: sessionId }
            });

            // TODO: Emit socket event
            // const io = getSocket && getSocket();
            // if (io) io.emit('content:session:deleted', { sessionId: sessionId });

            return { message: 'deleted' };
        } catch (error) {
            console.error('deleteSession', (error as Error).message);
            throw new Error((error as Error).message);
        }
    }
}