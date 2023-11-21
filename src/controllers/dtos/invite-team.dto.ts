import { IsNotEmpty, IsNumber } from 'class-validator';

export class InviteTeamDto {
	@IsNumber()
	@IsNotEmpty()
	teamId: number;

	@IsNumber()
	@IsNotEmpty()
	inviteeId: number;
}
