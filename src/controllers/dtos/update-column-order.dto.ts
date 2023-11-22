import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateColumnOrderDto {
	@IsNumber()
	@IsNotEmpty()
	columnId: number;

	@IsNumber()
	@IsNotEmpty()
	toBe: number;
}
