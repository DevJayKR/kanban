import { Column } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateColumnOrderDto {
	@IsNumber()
	@IsNotEmpty()
	columnId: number;

	@IsNumber()
	@IsNotEmpty()
	toBe: number;

	@Exclude()
	column: Column;
}
