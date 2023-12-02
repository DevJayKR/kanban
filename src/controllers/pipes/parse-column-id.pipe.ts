import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UpdateColumnOrderDto } from '../dtos/update-column-order.dto';

@Injectable()
export class ParseColumnIdPipe implements PipeTransform {
	constructor(private readonly prisma: PrismaService) {}

	async transform(value: UpdateColumnOrderDto) {
		const { columnId } = value;
		const column = await this.findColumn(columnId);

		return { ...value, column };
	}

	async findColumn(columnId: number) {
		const column = await this.prisma.column.findUnique({
			where: {
				id: columnId,
			},
		});

		if (!column) {
			throw new NotFoundException('존재하지 않는 컬럼입니다.');
		}

		return column;
	}
}
