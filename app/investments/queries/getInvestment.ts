import { Ctx, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetInvestmentInput = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default async function GetInvestment(input, ctx: Ctx) {
  GetInvestmentInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const investment = await db.investment.findFirst({ where: { id: input.id } });

  if (!investment) throw new NotFoundError();

  return investment;
}
