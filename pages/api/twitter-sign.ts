// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUrl } from 'helper/config'

type Data = {
    name: string
}

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse<Data>
) {
    fetch(`${getUrl()}/authentication/auth/getRedirectUrl`, {
        method: 'post',
        body: JSON.stringify({
            thirdpartyName: 'twitter', redirectUri: request.query.redirectUri
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(res => {
        response.redirect(res.data)
    })
}
