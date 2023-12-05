import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { TeamController } from '@controllers/team.controller';
import { TeamService } from '@services/team.service';

@Module({
	imports: [PrismaModule],
	controllers: [TeamController],
	providers: [TeamService],
})
export class TeamModule {}
