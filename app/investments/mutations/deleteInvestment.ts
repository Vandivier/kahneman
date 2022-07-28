import { Ctx } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteInvestmentInput = z.object({
  id: z.number(),
});

export default async function DeleteInvestment(input, ctx: Ctx) {
  DeleteInvestmentInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const investment = await db.investment.deleteMany({
    where: { id: input.id },
  });

  return investment;
}
