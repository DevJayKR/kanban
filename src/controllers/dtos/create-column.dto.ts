import { CustomValidator as CV } from 'src/utils/custom-validator.class';

export class CreateColumnDto {
	@CV.IsNotEmpty()
	@CV.IsString()
	name: string;
}
