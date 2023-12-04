import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CustomValidator {
	static IsNotEmpty() {
		return IsNotEmpty({ message: '$property 필드는 필수 입력 필드입니다.' });
	}

	static IsString() {
		return applyDecorators(
			IsString({ message: '$property 필드는 문자열이어야 합니다.' }),
			Transform(({ value }) => value?.trim()),
		);
	}

	static Length(min: number, max: number) {
		return Length(min, max, { message: '$property 필드는 $constraint1자 이상, $constraint2자 이하여야 합니다.' });
	}

	static IsOptional() {
		return IsOptional();
	}

	static IsNumber() {
		return IsNumber({ allowInfinity: false, allowNaN: false }, { message: '$property 필드는 숫자여야 합니다.' });
	}

	static IsDateString() {
		return IsDateString(
			{ strictSeparator: true },
			{
				message: '$property 필드는 유효한 ISO 8601 형식의 날짜로만 이루어진 문자열이어야 합니다.',
			},
		);
	}

	static IsEnum(entity: object) {
		return IsEnum(entity, {
			message: '$property 필드는 [$constraint2] 중 하나의 값이어야 합니다.',
		});
	}

	static IsUsername() {
		return applyDecorators(this.IsNotEmpty(), this.IsString(), this.Length(5, 12));
	}

	static IsPassword() {
		return applyDecorators(this.IsNotEmpty(), this.IsString(), this.Length(6, 20));
	}

	//static IsKorean(min: number, max: number, message: string) {
	//	return Matches(new RegExp(`[가-힣]{${min},${max}}`), { message: `$property 필드는 ${message}` });
	//}

	//static IsKoreanName() {
	//	return applyDecorators(
	//		this.IsNotEmpty(),
	//		this.IsString(),
	//		this.IsKorean(2, 4, '2자 이상, 4자 이하의 한글 이름만 가능합니다.'),
	//	);
	//}

	//static IsInAgeGroup() {
	//	return applyDecorators(
	//		IsIn(, {
	//			message: '$property 필드는 [$constraint1] 중 하나의 값이어야 합니다.',
	//		}),
	//		Expose({ name: 'age_group' }),
	//	);
	//}
}
