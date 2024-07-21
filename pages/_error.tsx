import * as Sentry from "@sentry/nextjs";
import Offline from "components/layout/Offline";
import { useNetwork } from "hooks/useNetwork";
import { NextPageContext } from "next";
import Error, { ErrorProps } from "next/error";
import { Router, useRouter } from "next/router";
import { useState } from "react";

const CustomErrorComponent = ({ statusCode }: ErrorProps) => {
  const router = useRouter();

  if (!navigator?.onLine) {
    router.push('/_offline');
    return;
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
