import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UpdateTicketOrderDto } from '../dtos/update-ticket-order.dto';

@Injectable()
export class ParseTicketIdPipe implements PipeTransform {
	constructor(private readonly prisma: PrismaService) {}

	async transform(value: UpdateTicketOrderDto) {
		const { ticketId } = value;
		const ticket = await this.findTicket(ticketId);

		return { ...value, ticket };
	}

	async findTicket(ticketId: number) {
		const ticket = await this.prisma.ticket.findUnique({
			where: {
				id: ticketId,
			},
		});

		if (!ticket) {
			throw new NotFoundException('존재하지 않는 티켓입니다.');
		}

		return ticket;
	}
}
