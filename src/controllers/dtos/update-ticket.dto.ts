import { Tag, Ticket } from '@prisma/client';
import { CustomValidator as CV } from 'src/utils/custom-validator.class';

export class UpdateTicketDto {
	@CV.IsNotEmpty()
	@CV.IsNumber()
	ticketId: number;

	@CV.IsOptional()
	@CV.IsNumber()
	assigneeId?: number;

	@CV.IsOptional()
	@CV.IsString()
	title?: string;

	@CV.IsOptional()
	@CV.IsEnum(Tag)
	tag: Tag;

	@CV.IsOptional()
	@CV.IsDateString()
	dueDate: string;

	@CV.IsOptional()
	@CV.IsNumber()
	dueTime: number;

	ticket: Ticket;
}
