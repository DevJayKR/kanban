import { Prisma } from '@prisma/client';

export type ColumnWithTickets = Prisma.ColumnGetPayload<{
	include: {
		tickets: true;
	};
}>;
