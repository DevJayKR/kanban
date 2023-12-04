import { Ticket } from '@prisma/client';
import { CustomValidator as CV } from 'src/utils/custom-validator.class';

export class UpdateTicketOrderDto {
	@CV.IsNotEmpty()
	@CV.IsNumber()
	ticketId: number;

	@CV.IsNotEmpty()
	@CV.IsNumber()
	toBe: number;

	@CV.IsOptional()
	@CV.IsNumber()
	toBeColumnId: number;

	ticket: Ticket;
}
