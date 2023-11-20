import { ClassConstructor, plainToInstance } from 'class-transformer';

export function serializer<T>(ref: ClassConstructor<T>, data: T) {
	return plainToInstance(ref, data);
}
