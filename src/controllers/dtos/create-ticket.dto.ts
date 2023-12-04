import { Column, Tag } from '@prisma/client';
import { CustomValidator as CV } from 'src/utils/custom-validator.class';

export class CreateTicketDto {
	@CV.IsNotEmpty()
	@CV.IsNumber()
	columnId: number;

	@CV.IsNotEmpty()
	@CV.IsString()
	title: string;

	@CV.IsNotEmpty()
	@CV.IsEnum(Tag)
	tag: Tag;

	column: Column;
}
