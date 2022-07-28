import { Suspense } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getInvestment from "app/investments/queries/getInvestment";
import deleteInvestment from "app/investments/mutations/deleteInvestment";

export const Investment = () => {
  const router = useRouter();
  const investmentId = useParam("investmentId", "number");
  const [deleteInvestmentMutation] = useMutation(deleteInvestment);
  const [investment] = useQuery(getInvestment, { id: investmentId });

  return (
    <>
      <Head>
        <title>Investment {investment.id}</title>
      </Head>

      <div>
        <h1>Investment {investment.id}</h1>
        <pre>{JSON.stringify(investment, null, 2)}</pre>

        <Link
          href={{
            pathname: "/investments/[investmentId]/edit",
            query: { investmentId: investment.id },
          }}
        >
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteInvestmentMutation({ id: investment.id });
              router.push({ pathname: "/investments" });
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowInvestmentPage = () => {
  return (
    <div>
      <p>
        <Link href={{ pathname: "/investments" }}>
          <a>Investments</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Investment />
      </Suspense>
    </div>
  );
};

ShowInvestmentPage.authenticate = true;
ShowInvestmentPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowInvestmentPage;
