import { APPLE_AUTH_OPTION } from 'helper/config';
import { useScript, appleAuthHelpers } from 'react-apple-signin-auth';

type AppleLoginResponse = {
  authorization: {
    code: string;
    id_token: string;
    state: string;
  }
}

const useAppleAuth = ({ onSuccess }: { onSuccess: (res: any) => void; }) => {
  useScript(appleAuthHelpers.APPLE_SCRIPT_SRC);
  const appleSignIn = async () => {
    return appleAuthHelpers.signIn({
      authOptions: { ...APPLE_AUTH_OPTION, redirectURI: window.location.origin + "/" },
      onSuccess: (response: AppleLoginResponse) => {
        onSuccess(response.authorization);
      },
      onError: (error: unknown) => console.error(error),
    });
  }

  return { appleSignIn }
}

export default useAppleAuth;
