import { BarLoader } from "react-spinners";
import LogoFull from "components/icons/logo/logo-full.svg";

const ScaleLoader = () => {
  return (
    <div className="p-2 flex flex-col justify-center items-center w-full">
      <LogoFull className="mb-4" />
      <BarLoader
        color="var(--brand-accent-600-600)"
        cssOverride={{ borderRadius: 2, width: 180 }}
      />
    </div>
  );
};

export default ScaleLoader;
