import { Ticket } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateTicketOrderDto {
	@IsNumber()
	@IsNotEmpty()
	ticketId: number;

	@IsNumber()
	@IsNotEmpty()
	toBe: number;

	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	toBeColumnId: number;

	@Exclude()
	ticket: Ticket;
}
