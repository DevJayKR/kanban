import { Module } from '@nestjs/common';
import { BoardController } from 'src/controllers/board.controller';
import { BoardService } from 'src/services/board.service';
import { PrismaModule } from './prisma.module';
import { TeamService } from 'src/services/team.service';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [PrismaModule, JwtModule],
	controllers: [BoardController],
	providers: [BoardService, TeamService, JwtService],
})
export class BoardModule {}
