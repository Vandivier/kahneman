import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createInvestment from "app/investments/mutations/createInvestment";
import {
  InvestmentForm,
  FORM_ERROR,
} from "app/investments/components/InvestmentForm";

const NewInvestmentPage = () => {
  const router = useRouter();
  const [createInvestmentMutation] = useMutation(createInvestment);

  return (
    <Layout title={"Create New Investment"}>
      <h1>Create New Investment</h1>

      <InvestmentForm
        submitText="Create Investment"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateInvestment}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const investment = await createInvestmentMutation(values);
            router.push({
              pathname: `/investments/[investmentId]`,
              query: { investmentId: investment.id },
            });
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={{ pathname: "/investments" }}>
          <a>Investments</a>
        </Link>
      </p>
    </Layout>
  );
};

NewInvestmentPage.authenticate = true;

export default NewInvestmentPage;
