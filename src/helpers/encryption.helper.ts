import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EncryptionHelper {
	private salt = 12;

	async encryption(target: string) {
		return await bcrypt.hash(target, this.salt);
	}

	async compare(password: string, encrypted: string) {
		return await bcrypt.compare(password, encrypted);
	}
}
