import { paginate, Ctx } from "blitz";
import db from "db";
import { Prisma } from "@prisma/client";

interface GetInvestmentsInput
  extends Pick<
    Prisma.InvestmentFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default async function Get__ModelNames(
  input: GetInvestmentsInput,
  ctx: Ctx
) {
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const {
    items: investments,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip: input.skip,
    take: input.take,
    count: () => db.investment.count({ where: input.where }),
    query: (paginateArgs) =>
      db.investment.findMany({
        ...paginateArgs,
        where: input.where,
        orderBy: input.orderBy,
      }),
  });

  return {
    investments,
    nextPage,
    hasMore,
    count,
  };
}
