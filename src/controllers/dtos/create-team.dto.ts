import { CustomValidator as CV } from '@utils/custom-validator.class';

export class CreateTeamDto {
	@CV.IsNotEmpty()
	@CV.IsString()
	name: string;
}
