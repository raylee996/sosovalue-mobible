
import Link from "next/link";
import Image from "next/image";

const Welcome = () => {

    return <div className="relative bg-[url('/img/activity/s2/Additional.png')] bg-[100%_auto] bg-no-repeat bg-white rounded-2xl p-6">
        <Link href="/" className="mb-5 no-underline flex">
            <Image src="/img/logo-black-horizontal-without-alpha.png" alt="" width={158} height={35} />
        </Link>
        <div className="flex justify-between items-center">

            <Image src="/img/brain-battle-1.png" alt="" layout="responsive" width={624} height={124} />
        </div>


    </div>
}

export default Welcome;