import { Module } from '@nestjs/common';
import { BoardController } from '@controllers/board.controller';
import { BoardService } from '@services/board.service';
import { PrismaModule } from './prisma.module';
import { TeamService } from '@services/team.service';

@Module({
	imports: [PrismaModule],
	controllers: [BoardController],
	providers: [BoardService, TeamService],
})
export class BoardModule {}
