import db from "db";
import { z } from "zod";

const UpdateInvestmentInput = z.object({
  id: z.number(),
  name: z.string(),
});

export default async function UpdateInvestment(input, ctx: Ctx) {
  UpdateInvestmentInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const investment = await db.investment.update({
    where: { id: input.id },
    input,
  });

  return investment;
}
