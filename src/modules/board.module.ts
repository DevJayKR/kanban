import { Module } from '@nestjs/common';
import { BoardController } from 'src/controllers/board.controller';
import { BoardService } from 'src/services/board.service';
import { PrismaModule } from './prisma.module';
import { TeamService } from 'src/services/team.service';

@Module({
	imports: [PrismaModule],
	controllers: [BoardController],
	providers: [BoardService, TeamService],
})
export class BoardModule {}
