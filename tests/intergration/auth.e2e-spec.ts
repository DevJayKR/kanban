import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@modules/app.module';

describe('[AuthController E2E TEST]', () => {
	let app: INestApplication;
	let at = null;
	let rt = null;

	const username = 'test1234';
	const password = '123456';
	const dto = {
		username,
		password,
	};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	beforeEach(async () => {
		dto.username = username;
		dto.password = password;
	});

	describe('[회원가입] POST /auth/signup', () => {
		it('만약 username 필드가 5자 미만, password 필드가 6자 미만이라면 400 상태 코드와 함께 에러 메세지를 출력해야한다.', () => {
			dto.username = 'test';
			dto.password = '1234';

			return request(app.getHttpServer())
				.post('/auth/signup')
				.send(dto)
				.expect(400)
				.expect(({ body }) => {
					expect(body.message.username).toHaveLength(1);
					expect(body.message.username[0]).toEqual('username 필드는 5자 이상, 12자 이하여야 합니다.');
					expect(body.message.password).toHaveLength(1);
					expect(body.message.password[0]).toEqual('password 필드는 6자 이상, 20자 이하여야 합니다.');
				});
		});

		it('만약 username 필드가 12자 초과, password 필드가 20자 초과라면 400 상태 코드와 함께 에러 메세지를 출력해야한다.', () => {
			dto.username = 'test12345678910';
			dto.password = '012345678901234567890';

			return request(app.getHttpServer())
				.post('/auth/signup')
				.send(dto)
				.expect(400)
				.expect(({ body }) => {
					expect(body.message.username).toHaveLength(1);
					expect(body.message.username[0]).toEqual('username 필드는 5자 이상, 12자 이하여야 합니다.');
					expect(body.message.password).toHaveLength(1);
					expect(body.message.password[0]).toEqual('password 필드는 6자 이상, 20자 이하여야 합니다.');
				});
		});

		it('회원가입을 진행하고, 201 상태 코드와 함께 유저네임과 ID를 반환해야한다.', () => {
			return request(app.getHttpServer())
				.post('/auth/signup')
				.send(dto)
				.expect(201)
				.expect(({ body }) => {
					expect(body.success).toEqual(true);
					expect(body.data.id).toBeDefined();
					expect(body.data.username).toBeDefined();
				});
		});

		it('만약 이미 존재하는 회원이면 422 코드와 함께 에러 메세지를 출력해야한다.', () => {
			return request(app.getHttpServer())
				.post('/auth/signup')
				.send(dto)
				.expect(422)
				.expect(({ body }) => {
					expect(body.message).toEqual('이미 존재하는 유저네임입니다.');
				});
		});
	});

	describe('[로그인] POST /auth/signin', () => {
		it('잘못된 유저네임으로 로그인을 시도하면, 404 상태코드와 함께 에러 메세지를 출력해야한다.', () => {
			dto.username = 'abcdefg';

			return request(app.getHttpServer())
				.post('/auth/signin')
				.send(dto)
				.expect(404)
				.expect(({ body }) => {
					expect(body.message).toEqual('존재하지 않는 유저입니다.');
				});
		});

		it('잘못된 패스워드로 로그인을 시도하면, 400 상태코드와 함께 에러 메세지를 출력해야한다.', () => {
			dto.password = '123456aa';

			return request(app.getHttpServer())
				.post('/auth/signin')
				.send(dto)
				.expect(400)
				.expect(({ body }) => {
					expect(body.message).toEqual('비밀번호가 일치하지 않습니다.');
				});
		});

		it('로그인을 진행하고, 액세스토큰과 리프레시 토큰을 반환해야한다.', () => {
			return request(app.getHttpServer())
				.post('/auth/signin')
				.send(dto)
				.expect(201)
				.expect(({ body }) => {
					expect(body.success).toEqual(true);
					expect(body.data.accessToken).toBeDefined();
					expect(body.data.refreshToken).toBeDefined();
					at = body.data.accessToken;
					rt = body.data.refreshToken;
				});
		});
	});

	describe('[토큰 새로고침] POST /auth/refresh', () => {
		it('리프레시 토큰이 없다면 400 코드와 함께 에러 메세지를 출력해야한다.', () => {
			return request(app.getHttpServer())
				.post('/auth/refresh')
				.expect(400)
				.expect(({ body }) => {
					expect(body.message).toEqual('토큰이 없습니다.');
				});
		});

		it('리프레시 토큰이 올바르지 않다면 400 상태코드와 함께 에러 메세지를 출력해야한다.', () => {
			return request(app.getHttpServer())
				.post('/auth/refresh')
				.set('Authorization', `Bearer ${rt}asdf`)
				.expect(400)
				.expect(({ body }) => {
					expect(body.message).toEqual('유효하지 않은 토큰입니다.');
				});
		});

		it('리프레시 토큰이 올바를 경우, 액세스 토큰을 반환해야한다.', () => {
			return request(app.getHttpServer())
				.post('/auth/refresh')
				.set('Authorization', `Bearer ${rt}`)
				.expect(201)
				.expect(({ body }) => {
					expect(body.success).toEqual(true);
					expect(body.data).toBeDefined();
				});
		});
	});

	describe('[로그아웃] POST /auth/signout', () => {
		it('액세스토큰이 없다면 400 코드와 함께 에러 메세지를 출력해야한다.', () => {
			return request(app.getHttpServer())
				.post('/auth/signout')
				.expect(400)
				.expect(({ body }) => {
					expect(body.message).toEqual('토큰이 없습니다.');
				});
		});

		it('액세스토큰이 올바르지 않다면 401 상태코드와 함께 에러 메세지를 출력해야한다.', () => {
			return request(app.getHttpServer())
				.post('/auth/signout')
				.set('Authorization', `Bearer ${at}asdf`)
				.expect(401)
				.expect(({ body }) => {
					expect(body.message).toEqual('유효하지 않은 토큰입니다.');
				});
		});

		it('액세스토큰과 함께 로그아웃을 요청하면 204 상태코드를 반환해야한다.', () => {
			return request(app.getHttpServer()).post('/auth/signout').set('Authorization', `Bearer ${at}`).expect(204);
		});
	});

	describe('[테스트 종료]', () => {
		it('테스트 계정을 삭제한다.', () => {
			return request(app.getHttpServer())
				.delete('/user')
				.set('Authorization', `Bearer ${at}`)
				.expect(200)
				.expect(({ body }) => {
					expect(body.success).toEqual(true);
					expect(body.data.id).toBeDefined();
					expect(body.data.username).toEqual('test1234');
				});
		});
	});

	afterAll(async () => {
		return await app.close();
	});
});
