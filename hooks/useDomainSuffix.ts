import { useEffect, useState } from "react"

const useDomainSuffix = () => {
  const [domainSuffix, setDomainSuffix] = useState<"com" | "xyz">()
  useEffect(() => {
    const host = window.location.host
    const domainSuffix = host.split('.').slice(-1).join('.') as "com" | "xyz"
    setDomainSuffix(domainSuffix)
  }, []);

  return domainSuffix;
}

export default useDomainSuffix;