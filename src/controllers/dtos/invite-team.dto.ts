import { IsNotEmpty, IsNumber } from 'class-validator';

export class InviteTeamDto {
	@IsNumber()
	@IsNotEmpty()
	inviteeId: number;
}
