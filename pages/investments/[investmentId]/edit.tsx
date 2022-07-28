import { Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getInvestment from "app/investments/queries/getInvestment";
import updateInvestment from "app/investments/mutations/updateInvestment";
import {
  InvestmentForm,
  FORM_ERROR,
} from "app/investments/components/InvestmentForm";

export const EditInvestment = () => {
  const router = useRouter();
  const investmentId = useParam("investmentId", "number");
  const [investment, { setQueryData }] = useQuery(
    getInvestment,
    { id: investmentId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateInvestmentMutation] = useMutation(updateInvestment);

  return (
    <>
      <Head>
        <title>Edit Investment {investment.id}</title>
      </Head>

      <div>
        <h1>Edit Investment {investment.id}</h1>
        <pre>{JSON.stringify(investment, null, 2)}</pre>

        <InvestmentForm
          submitText="Update Investment"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateInvestment}
          initialValues={investment}
          onSubmit={async (values) => {
            try {
              const updated = await updateInvestmentMutation({
                id: investment.id,
                ...values,
              });
              await setQueryData(updated);
              router.push({
                pathname: `/investments/[investmentId]`,
                query: { investmentId: updated.id },
              });
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditInvestmentPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditInvestment />
      </Suspense>

      <p>
        <Link href={{ pathname: "/investments" }}>
          <a>Investments</a>
        </Link>
      </p>
    </div>
  );
};

EditInvestmentPage.authenticate = true;
EditInvestmentPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditInvestmentPage;
