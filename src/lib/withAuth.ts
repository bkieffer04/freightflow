import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { supabaseServer } from "@/lib/supabase/server";

// Wrap any page's getServerSideProps to enforce auth
export function withAuth(gssp?: GetServerSideProps): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext) => {
    const supabase = supabaseServer(ctx.req as any, ctx.res as any);

    // This round-trips to Supabase Auth and rejects deleted/invalid users
    const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
          console.log('error', error);
      return {
        redirect: { destination: "/login", permanent: false },
      };
    }

    // Optional: run the page's own GSSP and inject user into props
    const result = gssp ? await gssp(ctx) : { props: {} };
    if ("props" in result) {
      return { ...result, props: { ...(result.props as object), user: data.user } };
    }
    return result;
  };
}
