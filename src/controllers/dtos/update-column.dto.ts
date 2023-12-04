import { Column } from '@prisma/client';
import { CustomValidator as CV } from 'src/utils/custom-validator.class';

export class UpdateColumnDto {
	@CV.IsNotEmpty()
	@CV.IsNumber()
	name: string;

	@CV.IsNotEmpty()
	@CV.IsNumber()
	columnId: number;

	column: Column;
}
