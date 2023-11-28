import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { TeamController } from 'src/controllers/team.controller';
import { TeamService } from 'src/services/team.service';
import { InviteService } from 'src/services/invite.service';
import { TicketService } from 'src/services/ticket.service';

@Module({
	imports: [PrismaModule],
	controllers: [TeamController],
	providers: [TeamService, InviteService, TicketService],
})
export class TeamModule {}
