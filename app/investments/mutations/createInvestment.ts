import { Ctx } from "blitz";
import db from "db";
import { z } from "zod";

const CreateInvestmentInput = z.object({
  name: z.string(),
});

export default async function CreateInvestment(input, ctx: Ctx) {
  CreateInvestmentInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const investment = await db.investment.create({ data: input });

  return investment;
}
