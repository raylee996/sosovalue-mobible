import React from "react";
import Image from "next/image";
import { parseDetailData } from "helper/tools";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import User from "components/icons/user.svg";
import Organizations from "components/icons/organizations.svg";
import Twitter from "components/icons/Twitter.svg";
import Linkin from "components/icons/Linkin.svg";

const Team = ({
  originalCurrencyDetail,
}: {
  originalCurrencyDetail?: API.OriginalCurrencyDetail;
}) => {
  const { t } = useTranslation("home");
  const { individuals, organizations } = React.useMemo(() => {
    return {
      individuals: parseDetailData<API.CurrencyMember[]>(
        [],
        originalCurrencyDetail?.individuals
      ),
      organizations: parseDetailData<API.CurrencyMember[]>(
        [],
        originalCurrencyDetail?.organizations
      ),
    };
  }, [originalCurrencyDetail]);
  return (
    <div className="relative w-full h-full">
      {/* <Watermark /> */}
      <div className="text-lg text-primary-900-White font-bold leading-8">
        {t("Team")}
      </div>
      {!!individuals.length && (
        <div className="py-4">
          <div className="text-primary-900-White text-sm font-semibold leading-6 flex items-center pb-4">
            <User className="text-base text-primary-800-50 mr-2" />
            {t("Individuals")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {individuals.map(
              (
                { avatar, bio, name, location, twitterLink, linkinLink },
                index
              ) => (
                <div key={index} className="flex items-center">
                  {/* <Image className=" rounded-full" src={avatar || '/img/UserSquare.png'} width={50} height={50} alt="" /> */}
                  <div>
                    <div className="flex items-start flex-col gap-2">
                      <div className=" text-sm text-primary-900-White font-semibold line-clamp-2">
                        {bio}
                      </div>
                      <span className="text-sm text-primary-900-White leading-6">
                        {name}
                      </span>
                      <div className="flex items-center gap-2 h-9">
                        {twitterLink && (
                          <Link href={twitterLink} target="_blank">
                            <IconButton className="px-1">
                              <Twitter className=" text-primary-800-50" />
                            </IconButton>
                          </Link>
                        )}
                        {linkinLink && (
                          <Link href={linkinLink} target="_blank">
                            <IconButton className="px-1">
                              <Linkin className=" text-primary-800-50" />
                            </IconButton>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
      {!!organizations.length && (
        <div className="py-4 pt-0">
          <div className="text-primary-900-White text-sm font-semibold leading-6 flex items-center pb-4">
            <Organizations className=" text-primary-800-50 mr-2" />
            {t("Organizations")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {organizations.map(
              ({ avatar, bio, name, twitterLink, linkinLink }, index) => (
                <div key={index} className="flex items-center">
                  {/* <Image src={avatar || '/img/UserSquare.png'} width={50} height={50} alt="" /> */}
                  <div>
                    <div className="flex items-start flex-col gap-2">
                      <div className=" text-sm text-primary-900-White font-semibold line-clamp-2">
                        {bio}
                      </div>
                      <span className="text-sm text-primary-900-White leading-6">
                        {name}
                      </span>
                      <div className="flex items-center gap-2">
                        {twitterLink && (
                          <Link href={twitterLink} target="_blank">
                            <IconButton className="px-1">
                              <Twitter className=" text-primary-800-50" />
                            </IconButton>
                          </Link>
                        )}
                        {linkinLink && (
                          <Link href={linkinLink} target="_blank">
                            <IconButton className="px-1">
                              <Linkin className=" text-primary-800-50" />
                            </IconButton>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
