import Button from "@mui/material/Button";
import Image from "next/image";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Space_Grotesk, Lato } from "next/font/google";
import { CaretUp, House, ShareFat } from "@phosphor-icons/react";
import { IconButton } from "@mui/material";
import Link from "next/link";
import useNotistack from "hooks/useNotistack";
import { copyText } from "helper/tools";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  weight: "700",
});

const lato = Lato({
  variable: "--font-lato",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const Activity = () => {
  const { success } = useNotistack();
  const share = () => {
    copyText("");
    success("Share link copied");
  };
  return (
    <div className={`${grotesk.variable} ${lato.variable} pt-[52px]`}>
      <div className="fixed left-0 top-0 w-full z-10 h-[52px] px-4 flex items-center justify-between bg-white border-0 border-b border-solid border-[#E5E5E5]">
        <Link href="/">
          <IconButton>
            <House />
          </IconButton>
        </Link>
        <span className="text-base font-bold text-[#0A0A0A] !font-lato">
          Crypto Researcher Scholarship S2
        </span>
        <IconButton onClick={share}>
          <ShareFat />
        </IconButton>
      </div>
      <div
        className={`!font-grotesk bg-[url('/img/activity/bg-03.png')] bg-contain bg-no-repeat bg-white pt-[50px] px-8`}
      >
        <Image src="/img/logo/logo.png" width={184} height={40} alt="" />
        <div className="text-5xl text-[#0A0A0A] font-bold mt-12">
          Crypto Researcher Scholarship <br />
          <span className="text-[#FF4F20]">S2</span>
        </div>
        <Link href="/researcher-hub">
          <Button className="px-6 h-[60px] rounded-lg bg-[#FF4F20] text-xl font-bold text-white my-12 normal-case">
            Research Enterence
          </Button>
        </Link>
        <div className="text-[#525252] text-base !font-lato">
          We're thrilled to announce that this season not only features a larger
          prize pool for researchers but also includes a separate prize pool for
          our platform users characterized as crypto investors who participate
          in public reviews! Join us and be a part of this incredible journey of
          knowledge sharing and community building with{" "}
          <span className="uppercase font-extrabold">millions</span> of SoSo
          Value users!
        </div>
        <div className="mt-[83px]">
          <Image
            src="/img/activity/s2/bear.png"
            width={165}
            height={165}
            alt=""
          />
          <div className="text-5xl font-bold text-[#0A0A0A] my-8">
            Researcher
            <span className="text-[#FF4F20]">Dual Path to Prizes</span>
          </div>
          <div className="text-xl text-[#525252] !font-lato">
            All research papers submitted during the event period will be
            evaluated and stand a chance to win awards from both a panel of
            professional judges and through public voting. This dual approach
            ensures a fair and comprehensive assessment, recognizing excellence
            from expert perspectives as well as popular opinion.
          </div>
          <Link href="/researcher-hub">
            <Button className="px-6 h-[60px] rounded-lg bg-[#FF4F20] text-xl font-bold text-white mt-8 normal-case">
              Research Enterence
            </Button>
          </Link>
        </div>
        <div className="mt-16">
          <Image
            src="/img/activity/s2/badge.png"
            width={165}
            height={165}
            alt=""
          />
          <div className="text-5xl font-bold text-[#0A0A0A] my-8">
            Public Review
            <span className="text-[#FF4F20]">Engage and Win</span>
          </div>
          <div className="text-xl text-[#525252] !font-lato">
            After the submission period, all SoSo Value users are invited to
            participate in the public review phase, where you can vote for your
            preferred research articles. By casting your vote, you not only
            support your favorite research work but also get a chance to win
            from a special prize pool, including cash rewards! Stay tuned for
            more details to be announced soon!
          </div>
          <Link href="/researcher-hub">
            <Button className="px-6 h-[60px] rounded-lg bg-[#FF4F20] text-xl font-bold text-white mt-8 normal-case">
              Research Enterence
            </Button>
          </Link>
        </div>
        <div className="mt-16">
          <div className="text-[32px] font-bold text-[#0A0A0A] mb-8">
            Submission and Review Timeline
          </div>
          <div className="p-4 flex flex-col rounded-lg border border-solid border-[#E5E5E5] mb-6">
            <span className="text-[#FF4F20] text-base font-bold mb-2">
              June 17th - July 16th
            </span>
            <span className="text-[#0A0A0A] text-xl font-bold">
              Submission Period
            </span>
          </div>
          <div className="p-4 flex flex-col rounded-lg border border-solid border-[#E5E5E5] mb-6">
            <span className="text-[#FF4F20] text-base font-bold mb-2">
              July 17th - July 30th
            </span>
            <span className="text-[#0A0A0A] text-xl font-bold">
              Public Review Phase
            </span>
          </div>
          <div className="p-4 flex flex-col rounded-lg border border-solid border-[#E5E5E5]">
            <span className="text-[#FF4F20] text-base font-bold mb-2">
              July 31st - August 6th
            </span>
            <span className="text-[#0A0A0A] text-xl font-bold">
              Award Announcement
            </span>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="my-0 text-[32px] text-[#0A0A0A] font-bold mb-8">
            Q&A
          </h3>
          <Accordion
            className="mb-4 !font-lato"
            defaultExpanded
            classes={{
              gutters:
                "shadow-none border border-solid border-[#E5E5E5] rounded-lg",
            }}
          >
            <AccordionSummary
              className="text-2xl font-medium text-[#0A0A0A] border-0 border-b border-solid border-[#E5E5E5] bg-gradient-to-b from-white to-[#F4F4F5]"
              classes={{ content: "my-4" }}
              expandIcon={<CaretUp color="#525252" />}
            >
              General Questions
            </AccordionSummary>
            <AccordionDetails className="text-base text-[#525252] p-4">
              The accordion component delivers large amounts of content in a
              small space through progressive disclosure. The user gets key
              details about the underlying content and can choose to expand that
              content within the constraints of the accordion.
            </AccordionDetails>
          </Accordion>
          <Accordion
            className="mb-4"
            classes={{
              gutters:
                "shadow-none border border-solid border-[#E5E5E5] rounded-lg before:content-[none]",
            }}
          >
            <AccordionSummary
              className="text-2xl font-medium text-[#0A0A0A] border-0 border-b border-solid border-[#E5E5E5] bg-gradient-to-b from-white to-[#F4F4F5]"
              classes={{ content: "my-4" }}
              expandIcon={<CaretUp color="#525252" />}
            >
              Questions for participant researchers
            </AccordionSummary>
            <AccordionDetails>
              The accordion component delivers large amounts of content in a
              small space through progressive disclosure. The user gets key
              details about the underlying content and can choose to expand that
              content within the constraints of the accordion.
            </AccordionDetails>
          </Accordion>
          <Accordion
            classes={{
              gutters:
                "shadow-none border border-solid border-[#E5E5E5] rounded-lg before:content-[none]",
            }}
          >
            <AccordionSummary
              className="text-2xl font-medium text-[#0A0A0A] border-0 border-b border-solid border-[#E5E5E5] bg-gradient-to-b from-white to-[#F4F4F5]"
              classes={{ content: "my-4" }}
              expandIcon={<CaretUp color="#525252" />}
            >
              Questions for Public Reviewer
            </AccordionSummary>
            <AccordionDetails>
              The accordion component delivers large amounts of content in a
              small space through progressive disclosure. The user gets key
              details about the underlying content and can choose to expand that
              content within the constraints of the accordion.
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="mt-16">
          <h3 className="my-0 text-[32px] font-bold text-[#0A0A0A]">
            Partners
          </h3>
          <div className="py-8 gap-y-8 flex flex-col items-center">
            <Image
              src="/img/activity/s2/temp.png"
              width={204}
              height={40}
              alt=""
            />
            <Image
              src="/img/activity/s2/temp.png"
              width={204}
              height={40}
              alt=""
            />
            <Image
              src="/img/activity/s2/temp.png"
              width={204}
              height={40}
              alt=""
            />
            <Image
              src="/img/activity/s2/temp.png"
              width={204}
              height={40}
              alt=""
            />
            <Image
              src="/img/activity/s2/temp.png"
              width={204}
              height={40}
              alt=""
            />
            <Image
              src="/img/activity/s2/temp.png"
              width={204}
              height={40}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
