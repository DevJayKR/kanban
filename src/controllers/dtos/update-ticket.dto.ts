import { Tag, Ticket } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
	@IsOptional()
	@IsNumber()
	assigneeId?: number;

	@IsNumber()
	@IsNotEmpty()
	ticketId: number;

	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsEnum(Tag)
	tag: Tag;

	@IsOptional()
	@IsDateString({
		strictSeparator: true,
	})
	dueDate: string;

	@IsOptional()
	@IsNumber()
	dueTime: number;

	@Exclude()
	ticket: Ticket;
}
