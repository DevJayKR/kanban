import { ClassConstructor, plainToInstance } from 'class-transformer';

export function Serializer<T>(ref: ClassConstructor<T>) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const method = descriptor.value;

		descriptor.value = async function (...args) {
			const data = await method.apply(this, args);
			return plainToInstance(ref, await data);
		};
	};
}
