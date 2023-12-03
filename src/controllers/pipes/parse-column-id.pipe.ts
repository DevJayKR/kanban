import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ParseColumnIdPipe implements PipeTransform {
	constructor(private readonly prisma: PrismaService) {}

	async transform(value: any) {
		const { columnId } = value;
		const column = await this.findColumn(columnId);

		return { ...value, column };
	}

	async findColumn(columnId: number) {
		const column = await this.prisma.column.findUnique({
			where: {
				id: columnId,
			},
			include: {
				tickets: true,
			},
		});

		if (!column) {
			throw new NotFoundException('존재하지 않는 컬럼입니다.');
		}

		return column;
	}
}
