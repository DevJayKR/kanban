import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { TeamController } from 'src/controllers/team.controller';
import { TeamService } from 'src/services/team.service';
import { InviteService } from 'src/services/invite.service';

@Module({
	imports: [PrismaModule],
	controllers: [TeamController],
	providers: [TeamService, InviteService],
})
export class TeamModule {}
