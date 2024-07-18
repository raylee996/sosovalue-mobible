import React, { useContext, useState } from "react";
import { CaretDown, CaretUp, ShareFat, House } from "@phosphor-icons/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import { copyText } from "helper/tools";
import Image from "next/image";
import Link from "next/link";
import { UserContext } from "store/UserStore";
import useNotistack from "hooks/useNotistack";
import { getOrigin } from "helper/config";
enum Status {
  // 未登录
  CryptoProject = "CryptoProject",
  // 投票结束 结算
  Sector = "Sector",
  // 颁奖
  IndustryMacro = "IndustryMacro",
}
const Contribute = () => {
  const { authModal } = useContext(UserContext);
  const [status, setStatus] = useState<string>(Status.CryptoProject);
  const { success } = useNotistack();
  const signUp = () => {
    authModal?.openSignupModal();
  };
  const copyShareLink = (link: string, toast: string) => {
    copyText(getOrigin() + link);
    success(toast);
  };
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="w-full h-[442px] bg-[url('/img/researcherHub/GenGroup1.png')] bg-cover bg-no-repeat bg-white">
        <div className="w-full bg-[#fff] h-[52px] text-base text-[#0A0A0A] !font-lato flex items-center justify-between px-[16px] backdrop-blur-sm border-0 border-b border-solid border-[#E5E5E5]">
          <Link
            href="/"
            className="h-[32px] no-underline flex items-center w-[36px]  px-2"
          >
            <House size={20} className="text-[#525252]" />
          </Link>
          Crypto Researcher Scholarship S2
          <Button
            onClick={() =>
              copyShareLink("/researcher-scholarship-s2/researcher-hub", "Share link copied")
            }
            className="h-[32px]  w-[36px] min-w-[36px] text-[#0A0A0A] normal-case !font-lato flex items-center px-2"
          >
            <ShareFat size={20} className="text-[#525252]" />
          </Button>
        </div>
        <div className="px-[32px]  mt-[41px]">
          <Image
            src="/img/researcherHub/Frame.png"
            width={180}
            height={40}
            alt=""
          />
        </div>
        <div className="px-[32px] h-[122px] text-[48px] mt-[48px] font-bold text-[#0A0A0A]">
          Researcher Hub
        </div>
        <Button
          onClick={signUp}
          className="h-[48px] !font-lato text-[#FFF] ml-[32px] mt-[48px] normal-case text-base font-bold rounded-lg shadow-[0_1px_2px_0_rgba(10,10,10,0.06)] bg-[#FF4F20] flex items-center px-6"
        >
          Sign up
        </Button>
      </div>
      <div className="px-[32px] pt-[32px]">
        <div className="text-[24px] font-bold text-[#0A0A0A] mb-[32px]">
          About SoSo Value™ & SoSo Value Researcher Scholarship
        </div>
        <div className="text-[14px] text-[#525252]  !font-lato">
          <p className="m-0 mb-3">
            SoSo Value emerges as a one-stop crypto investment powerhouse,
            specifically tailored to serve the expansive community involved in
            cryptocurrency investment and wealth management. Since launched in
            December 2023, the platform has reached more than one million
            registered users from organic growth and is characterized by their
            predominant presence in active financial markets.
          </p>
          <p className="m-0">
            The goal of SoSo Value Researcher Scholarship is to reward
            researchers who share their unique insights with crypto investors.
            We aim to connect exceptional content with enthusiastic investors.
            Join us in this initiative to bridge the gap between innovative
            research and crypto investment!
          </p>
        </div>
      </div>
      <div className="px-[32px] mt-[64px]">
        <div className="text-[32px] w-full font-bold text-[#0A0A0A] mb-[32px]">
          Submission and Review Timeline
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="p-4 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[16px] text-[#FF4F20] leading-7 font-bold">
              June 17th - July 16th
            </div>
            <div className="text-[24px] text-[#0A0A0A] font-bold my-2 leading-8">
              Submission Period
            </div>
            <div className="text-[14px] text-[#525252] !font-lato">
              During this period, the research submission portal will be open on
              the researcher hub, accessible from the top of this page (after
              login). Participants can submit multiple research papers and edit
              them until the portal closes.
            </div>
          </div>
          <div className="p-4 col-span-1  rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[16px] text-[#FF4F20] leading-7 font-bold">
              July 17th - July 30th
            </div>
            <div className="text-[24px] text-[#0A0A0A] font-bold my-2 leading-8">
              Public Review Phase
            </div>
            <div className="text-[14px] text-[#525252] !font-lato">
              Once the submission period ends, the public review phase begins.
              All SoSo Value users can vote on their favorite research papers
              according to specific rules. Simultaneously, our panel of
              professional judges will evaluate the submissions.
            </div>
          </div>
          <div className="p-4 col-span-1  rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[16px] text-[#FF4F20] leading-7 font-bold">
              July 31st - August 6th
            </div>
            <div className="text-[24px] text-[#0A0A0A] font-bold my-2 leading-8">
              Award Announcement
            </div>
            <div className="text-[14px] text-[#525252] !font-lato">
              In the following week, we will announce the winners of both prize
              pools!
            </div>
          </div>
        </div>
      </div>
      <div className="px-[32px] mt-[64px] mb-[32px]">
        <div className="text-[32px] font-bold text-[#0A0A0A]">
          Guidelines for Evaluation
        </div>
        <div className="text-[14px] text-[#525252] my-[32px] !font-lato">
          While we encourage participants to focus their research on one of the
          three main categories (details below), your submissions will be
          evaluated based on the following criteria:
        </div>
        <div className="mb-6 !font-lato">
          <p className="mb-2 text-[20px] text-[#0A0A0A] font-semibold">
            Relevance
          </p>
          <span className="text-[14px] text-[#525252]">
            Research should be useful for making investment decisions in the
            current market environment.
          </span>
        </div>
        <div className="mb-6 !font-lato">
          <p className="mb-2 text-[20px] text-[#0A0A0A] font-semibold">
            Objectivity and Accuracy
          </p>
          <span className="text-[14px] text-[#525252]">
            The work should include quantitative indicators and trackable data
            to ensure reliability.
          </span>
        </div>
        <div className="mb-6 !font-lato">
          <p className="mb-2 text-[20px] text-[#0A0A0A] font-semibold">
            Originality
          </p>
          <span className="text-[14px] text-[#525252]">
            We value fresh and innovative perspectives.
          </span>
        </div>
        <div className="!font-lato">
          <p className="mb-2 text-[20px] text-[#0A0A0A] font-semibold">
            Bonus Points
          </p>
          <span className="text-[14px] text-[#525252]">
            Submissions that incorporate data analysis or demonstrate the use of
            a specific tool (ie\
            <span
              className="text-[#FF4F20] font-bold underline ml-1"
              onClick={() =>
                copyShareLink(
                  "/dashboard",
                  "link copied, paste on PC website to access"
                )
              }
            >
              Dashboard
            </span>
            ,
            <span
              className="text-[#FF4F20] font-bold underline ml-1"
              onClick={() =>
                copyShareLink(
                  "/indicators",
                  "link copied, paste on PC website to access"
                )
              }
            >
              Indicators
            </span>
            , only on PC website ) providing practical insights for our
            audience, will receive additional points.
          </span>
        </div>
      </div>
      <div className="px-[32px] text-[14px] text-[#525252] !font-lato">
        (Additionally, we can find more references from the
        <Link
          href="/researcher-scholarship-s2/home"
          className="text-[#FF4F20] font-bold ml-1"
        >
          previous scholarship
        </Link>
        .)
      </div>
      <div className="px-[32px] pt-[64px]">
        <div className="text-[32px] font-bold text-[#0A0A0A]">
          Suggested Research Categories and Professional Prize Pool
        </div>
        <div className="text-[14px] text-[#525252] my-[32px] !font-lato">
          <p className="m-0">
            While we appreciate a broad diversity of ideas in the Research
            Scholarship, we recommend focusing on the following three main
            categories, which align with our audience's interests. Submissions
            will typically fall into one of these categories to receive
            professional feedback from our judges. The final prizes will be
            determined based on the cumulative scores from all judges.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="p-8 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[24px] text-[#0A0A0A] font-bold text-center !font-lato">
              SoSo Best Research Prize
            </div>
            <div className="text-[64px] text-[#FF4F20] !font-ddin font-bold my-3 text-center">
              $1,500
            </div>
            <div className="text-[16px] text-[#525252] !font-lato w-[106px] mx-auto text-center leading-[34px] h-[34px] bg-[#EDEDED] rounded-[16px]">
              2 Winners
            </div>
          </div>
          <div className="p-8 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[24px] text-[#0A0A0A] !font-lato font-bold text-center">
              SoSo Excellent Analysis Prize
            </div>
            <div className="text-[64px] text-[#FF4F20] !font-ddin font-bold my-3 text-center">
              $1,000
            </div>
            <div className="text-[16px] text-[#525252] !font-lato w-[106px] mx-auto text-center leading-[34px] h-[34px] bg-[#EDEDED] rounded-[16px]">
              4 Winners
            </div>
          </div>
          <div className="p-8 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[24px] text-[#0A0A0A] !font-lato font-bold text-center">
              SoSo Leading Insight Prize
            </div>
            <div className="text-[64px] text-[#FF4F20] !font-ddin font-bold my-3 text-center">
              $800
            </div>
            <div className="text-[16px] text-[#525252] !font-lato w-[106px] mx-auto text-center leading-[34px] h-[34px] bg-[#EDEDED] rounded-[16px]">
              10 Winners
            </div>
          </div>
          <div className="p-8 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[24px] text-[#0A0A0A] !font-lato font-bold text-center">
              SoSo Outstanding Strategy Prize
            </div>
            <div className="text-[64px] text-[#FF4F20] !font-ddin font-bold my-3 text-center">
              $100
            </div>
            <div className="text-[16px] text-[#525252] !font-lato w-[106px] mx-auto text-center leading-[34px] h-[34px] bg-[#EDEDED] rounded-[16px]">
              50 Winners
            </div>
          </div>
        </div>
      </div>
      <div className="px-[32px] !font-lato pt-[32px]">
        <div className="h-[56px] border-0 border-b border-solid border-[#E5E5E5] flex items-center overflow-y-hidden overflow-x-auto whitespace-nowrap">
          <div
            onClick={() => setStatus(Status.CryptoProject)}
            className={`px-4 text-[16px] font-bold  leading-[54px] border-0 border-b-2 border-solid  ${
              status === Status.CryptoProject
                ? "text-[#FF4F20] border-[#FF4F20]"
                : "text-[#0A0A0A] border-transparent"
            }`}
          >
            Crypto Project
          </div>
          <div
            onClick={() => setStatus(Status.Sector)}
            className={`px-4 text-[16px] font-bold  leading-[54px] border-0 border-b-2 border-solid ${
              status === Status.Sector
                ? "text-[#FF4F20] border-[#FF4F20]"
                : "text-[#0A0A0A] border-transparent"
            }`}
          >
            Sector
          </div>
          <div
            onClick={() => setStatus(Status.IndustryMacro)}
            className={`px-4 text-[16px] font-bold  leading-[54px] border-0 border-b-2 border-solid ${
              status === Status.IndustryMacro
                ? "text-[#FF4F20] border-[#FF4F20]"
                : "text-[#0A0A0A] border-transparent"
            }`}
          >
            Industry/ Macro
          </div>
        </div>
        {status === Status.CryptoProject && (
          <div className="px-4 py-8 text-[14px] text-[#525252] leading-5">
            <p className="m-0 mb-4">
              Many cryptocurrency investors develop an interest in the industry
              due to a particular project. However, investing in a single asset
              inherently involves a higher risk tolerance. These more aggressive
              investors focus intensely on specific projects and seek to achieve
              excess returns from these particular investments in addition to
              industry growth. High-risk tolerance requires detailed tracking
              and a comprehensive understanding of the investment target.
            </p>
            <p className="m-0 mb-4">
              We suggest that researchers can provide objective analysis and
              reference from an independent and unbiased perspective in their
              research reports on specific projects to assist investors in
              addressing the following issues:
            </p>
            <p className="m-0">• Project Introduction</p>
            <p className="m-0">• Problems Addressed by the Project</p>
            <p className="m-0">• Advantages Compared to Competitors</p>
            <p className="m-0">• Value Attribution</p>
            <p className="m-0">• Potential Market Size</p>
            <p className="m-0">• Risks Warning</p>
            <p className="m-0">• Future Price Trends (Project Valuation)</p>
          </div>
        )}
        {status === Status.Sector && (
          <div className="px-4 py-8 text-[14px] text-[#525252] leading-5">
            <p className="m-0 mb-4">
              As mainstream players in the traditional investment market,
              risk-averse investors aim to gain returns from the growth periods
              of specific sectors by investing in indices. The Indices product
              launched by SoSo Value is designed to meet their needs
              effectively. Using the SSI (
              <span onClick={() =>
                copyShareLink(
                  "/assets/cryptoindex",
                  "link copied, paste on PC website to access"
                )
              } className="text-[#FF4F20] font-bold">
                SoSo Value Index
              </span>
              ) as a starting point for sector classification, we encourage
              researchers to delve deeper into their analyses. Based on
              collected feedback, we believe sector analysis will be
              particularly attractive to our community.
            </p>
            <p className="m-0 mb-4">
              We suggest that researchers can provide independent, objective,
              and investment-advisory reports on specific sectors to assist
              investors in addressing the following issues with objective
              analysis and reference:
            </p>
            <p className="m-0">• Sector Introduction</p>
            <p className="m-0">• Sector Market Size</p>
            <p className="m-0">• Target Users of the Sectors</p>
            <p className="m-0">• Problems Faced by the Sector</p>
            <p className="m-0">• Current Leading Projects</p>
            <p className="m-0">
              • Sector Rotation and Future Overall Market Size Forecast
            </p>
          </div>
        )}
        {status === Status.IndustryMacro && (
          <div className="px-4 py-8 text-[14px] text-[#525252] leading-5">
            <p className="m-0 mb-4">
              Many new investors are now allocating assets to crypto,
              recognizing its potential despite lacking the experience of
              seasoned investors. They are driving the current bull market and
              are more concerned with the crypto industry's impact on the
              broader investment market. High-quality content on industry
              development is crucial for attracting these investors, enabling
              them to make informed decisions based on understanding and
              knowledge.
            </p>
            <p className="m-0 mb-4">
              We suggest that researchers can provide independent, objective,
              and investment-advisory reports on industry and macro picture to
              assist investors in addressing the following issues with objective
              analysis and reference:
            </p>
            <p className="m-0">• Basic concepts</p>
            <p className="m-0">• Market Trends</p>
            <p className="m-0">• Trading Factors</p>
            <p className="m-0">• Capital Inflows (Outflows)</p>
            <p className="m-0">• Risk Warning</p>
            <p className="m-0">• Price Forecast for the Future</p>
          </div>
        )}
      </div>
      <div className="px-[32px] pt-[64px]">
        <div className="text-[32px] font-bold text-[#0A0A0A]">
          Public Review and Prize Pool
        </div>
        <div className="text-[14px] text-[#525252] my-[32px] !font-lato">
          <p className="m-0">
            After the submission period, outstanding research works will be
            showcased in the public showroom, where all SoSo Value users can
            participate and vote for their favorite entries. Users will receive
            vote tickets through daily logins and other user activities. The
            Community Prize Pool will be distributed solely based on the voting
            results.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="p-8 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[24px] !font-lato text-[#0A0A0A] font-bold text-center">
              SoSo Community Choice Prize
            </div>
            <div className="text-[64px] text-[#FF4F20] !font-ddin font-bold my-3 text-center">
              $800
            </div>
            <div className="text-[16px] !font-lato text-[#525252] w-[106px] mx-auto text-center leading-[34px] h-[34px] bg-[#EDEDED] rounded-[16px]">
              1 Winners
            </div>
          </div>
          <div className="p-8 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[24px] !font-lato text-[#0A0A0A] font-bold text-center">
              SoSo Audience Favorite Prize
            </div>
            <div className="text-[64px] text-[#FF4F20] !font-ddin font-bold my-3 text-center">
              $500
            </div>
            <div className="text-[16px] !font-lato text-[#525252] w-[106px] mx-auto text-center leading-[34px] h-[34px] bg-[#EDEDED] rounded-[16px]">
              3 Winners
            </div>
          </div>
          <div className="p-8 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[24px] !font-lato text-[#0A0A0A] font-bold text-center">
              SoSo People's Pick Prize
            </div>
            <div className="text-[64px] text-[#FF4F20] !font-ddin font-bold my-3 text-center">
              $300
            </div>
            <div className="text-[16px] !font-lato text-[#525252] w-[106px] mx-auto text-center leading-[34px] h-[34px] bg-[#EDEDED] rounded-[16px]">
              5 Winners
            </div>
          </div>
          <div className="p-8 col-span-1 rounded-lg border border-solid border-[#E5E5E5]">
            <div className="text-[24px] !font-lato text-[#0A0A0A] font-bold text-center">
              SoSo Voters' Selection Prize
            </div>
            <div className="text-[64px] text-[#FF4F20] !font-ddin font-bold my-3 text-center">
              $100
            </div>
            <div className="text-[16px] !font-lato text-[#525252] w-[106px] mx-auto text-center leading-[34px] h-[34px] bg-[#EDEDED] rounded-[16px]">
              12 Winners
            </div>
          </div>
        </div>
        <div className="text-sm text-[#525252] !font-lato mt-6">
          For more details about the public showroom, voting and prize,{" "}
          <span className="underline">click here</span>.
        </div>
      </div>
      <div className="px-[32px] pt-[64px]">
        <div className="text-[32px] font-bold text-[#0A0A0A]">Q&A</div>
        <div className="my-[32px] !font-lato">
          <Accordion
            className="mb-4 !font-lato"
            defaultExpanded
            classes={{
              gutters:
                "shadow-none border border-solid border-[#E5E5E5] rounded-lg",
            }}
          >
            <AccordionSummary
              className="text-2xl font-medium text-[#0A0A0A] rounded-lg bg-gradient-to-b from-white to-[#F4F4F5]"
              classes={{ content: "my-4" }}
              expandIcon={<CaretDown color="#525252" />}
            >
              Are there any requirements for participation
            </AccordionSummary>
            <AccordionDetails className="text-base text-[#525252] p-4  border-0 border-t border-solid border-[#E5E5E5]">
              There are no specific requirements; everyone is welcome to
              participate.
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
              className="text-2xl font-medium  rounded-lg text-[#0A0A0A] bg-gradient-to-b from-white to-[#F4F4F5]"
              classes={{ content: "my-4" }}
              expandIcon={<CaretDown color="#525252" />}
            >
              Why is it necessary to provide more participant information before
              submission?
            </AccordionSummary>
            <AccordionDetails className=" border-0 border-t border-solid border-[#E5E5E5]">
              Providing detailed participant information ensures the originality
              of the submitted research work, facilitates proper credit
              distribution, and streamlines follow-up processes such as prize
              claims.
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
              className="text-2xl font-medium rounded-lg text-[#0A0A0A] bg-gradient-to-b from-white to-[#F4F4F5]"
              classes={{ content: "my-4" }}
              expandIcon={<CaretDown color="#525252" />}
            >
              Do I have to choose one of the three suggested research
              categories? What if my work covers a different theme or multiple
              themes?
            </AccordionSummary>
            <AccordionDetails className=" border-0 border-t border-solid border-[#E5E5E5]">
              The suggested research categories are designed to provide the
              audience with clear expectations regarding the type of research
              work being presented. While it is recommended that participants
              select one of the suggested categories, it is not mandatory. If
              your work has a different theme or spans multiple categories, we
              can consider the closest concept or the predominant conclusion of
              your research.
            </AccordionDetails>
          </Accordion>
          <Accordion
            
            classes={{
              gutters:
                "shadow-none border border-solid border-[#E5E5E5] rounded-lg before:content-[none]",
            }}
          >
            <AccordionSummary
              className="text-2xl font-medium rounded-lg text-[#0A0A0A] bg-gradient-to-b from-white to-[#F4F4F5]"
              classes={{ content: "my-4" }}
              expandIcon={<CaretDown color="#525252" />}
            >
              Will I have any copyright issues by submitting my work here?
            </AccordionSummary>
            <AccordionDetails className=" border-0 border-t border-solid border-[#E5E5E5]">
              You will not face any copyright issues from our side. Consider us
              a public forum; your work may be published on our platform (during
              the public review phase) with proper credit to you. However, if
              your work is also being published through a company or
              organization, you must adhere to their publication rules and
              guidelines.
            </AccordionDetails>
          </Accordion>
          {/* <div className="border border-solid border-[#E5E5E5] rounded-lg">
            <div className="p-4 text-[24px] flex items-center justify-between font-medium text-[#0A0A0A] rounded-t-lg px-4 bg-[linear-gradient(180deg,#FFF_0%,#F4F4F5_100%)]">
              <span>General Questions</span>
              <div className="w-8">
                <CaretDown size={32} className="text-[#525252]" />
              </div>
            </div>
            <div className="text-base text-[#525252] p-4">
              The accordion component delivers large amounts of content in a
              small space through progressive disclosure. The user gets key
              details about the underlying content and can choose to expand that
              content within the constraints of the accordion.
            </div>
          </div>
          <div className="border my-4 border-solid border-[#E5E5E5] rounded-lg">
            <div className="p-4 text-[24px] flex items-center justify-between font-medium text-[#0A0A0A] rounded-lg px-4 bg-[linear-gradient(180deg,#FFF_0%,#F4F4F5_100%)]">
              <span>Questions for participant researchers</span>
              <div className="w-8">
                <CaretDown size={32} className="text-[#525252]" />
              </div>
            </div>
          </div>
          <div className="border my-4 border-solid border-[#E5E5E5] rounded-lg">
            <div className="p-4 text-[24px] flex items-center justify-between font-medium text-[#0A0A0A] rounded-lg px-4 bg-[linear-gradient(180deg,#FFF_0%,#F4F4F5_100%)]">
              <span>Questions for Public Reviewer</span>
              <div className="w-8">
                <CaretDown size={32} className="text-[#525252]" />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Contribute;
