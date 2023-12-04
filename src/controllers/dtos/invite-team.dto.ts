import { CustomValidator as CV } from './../../utils/custom-validator.class';

export class InviteTeamDto {
	@CV.IsNotEmpty()
	@CV.IsNumber()
	inviteeId: number;
}
