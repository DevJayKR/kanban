import { Column, Tag } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
	@IsNumber()
	@IsNotEmpty()
	columnId: number;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsEnum(Tag)
	@IsNotEmpty()
	tag: Tag;

	@Exclude()
	column: Column;
}
