import * as Sentry from "@sentry/nextjs";
import Offline from "components/layout/Offline";
import { useNetwork } from "hooks/useNetwork";
import { NextPageContext } from "next";
import Error, { ErrorProps } from "next/error";
import { useState } from "react";

const CustomErrorComponent = ({ statusCode }: ErrorProps) => {
  const [isOnline, setIsOnline] = useState(true);

  console.error('online', isOnline, navigator?.onLine)

  if (!navigator?.onLine) {
    setIsOnline(false);
  }

  if (!isOnline) {
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
