import { CustomValidator as CV } from '@utils/custom-validator.class';

export class CreateColumnDto {
	@CV.IsNotEmpty()
	@CV.IsString()
	name: string;
}
