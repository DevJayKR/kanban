import { Column } from '@prisma/client';
import { CustomValidator as CV } from '@utils/custom-validator.class';

export class UpdateColumnOrderDto {
	@CV.IsNotEmpty()
	@CV.IsNumber()
	columnId: number;

	@CV.IsNotEmpty()
	@CV.IsNumber()
	toBe: number;

	column: Column;
}
