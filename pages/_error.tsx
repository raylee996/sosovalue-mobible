import * as Sentry from "@sentry/nextjs";
import Offline from "components/layout/Offline";
import { useNetwork } from "hooks/useNetwork";
import { NextPageContext } from "next";
import Error, { ErrorProps } from "next/error";

const CustomErrorComponent = ({ statusCode }: ErrorProps) => {
  const {online} = useNetwork();
  
  console.log('online', online)

  if (!online) {
    return <Offline />
  }

  return <Error statusCode={statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
