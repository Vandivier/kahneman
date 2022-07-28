import { Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getInvestments from "app/investments/queries/getInvestments";

const ITEMS_PER_PAGE = 100;

export const InvestmentsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ investments, hasMore }] = usePaginatedQuery(getInvestments, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {investments.map((investment) => (
          <li key={investment.id}>
            <Link
              href={{
                pathname: "/investments/[investmentId]",
                query: { investmentId: investment.id },
              }}
            >
              <a>{investment.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const InvestmentsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Investments</title>
      </Head>

      <div>
        <p>
          <Link href={{ pathname: "/investments/new" }}>
            <a>Create Investment</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <InvestmentsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default InvestmentsPage;
