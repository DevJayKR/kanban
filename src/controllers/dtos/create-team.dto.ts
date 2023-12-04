import { CustomValidator as CV } from 'src/utils/custom-validator.class';

export class CreateTeamDto {
	@CV.IsNotEmpty()
	@CV.IsString()
	name: string;
}
