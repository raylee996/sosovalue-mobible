import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import {thirdPartyLogin} from 'http/user'
import {getUrl} from 'helper/config'
export default function TwitterAuth() {
  const [authUrl, setAuthUrl] = useState(false);
  const [authWindow, setAuthWindow] = useState<any>(null);

  const router = useRouter()
  
  let code = router.query.code as string
  const twitterLogin = async() => {
    
    
    const domain = window.location.protocol + '//' + window.location.host
     
    let res = await thirdPartyLogin({
      code:code,
      redirectUri:domain,
      thirdpartyName:'twitter'
    })
  }
  React.useEffect(() => {
    if(code){
      twitterLogin()
    }
  }, [code])
  return (
    <div>
      <Link href={`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NFNUMjJ3RXI0ZVY5c1kwVUw0dVo6MTpjaQ&redirect_uri=${window.location.protocol + '//' + window.location.host}&scope=tweet.read%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain`}><button>Authorize with Twitter</button></Link>
    </div>
  );
}
