import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateColumnDto {
	@IsNotEmpty()
	@IsNumber()
	teamId: number;

	@IsNotEmpty()
	@IsString()
	name: string;
}
