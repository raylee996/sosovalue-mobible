import React from "react";
import { getConfig } from "http/tweet";
import { useRouter } from "next/router";
import { Language } from "store/ThemeStore";

type Option = { value: number | string; label: string; name?: string };

type Props = {
  withAll?: boolean;
};

const allOption = {
  label: "All",
  value: "",
  name: "",
};

const useDimensionDict = ({ withAll }: Props) => {
  const router = useRouter();
  const lang = router.locale;
  const createInitConfig = () => (withAll ? [allOption] : []);
  const [dimensionMap, setDimensionMap] = React.useState<
    Record<string, string>
  >({});
  const [currencyConfig, setCurrencyConfig] = React.useState<Option[]>([]);
  const [dimensionOneConfig, setDimensionOneConfig] = React.useState<Option[]>(
    []
  );
  const [dimensionTwoConfig, setDimensionTwoConfig] = React.useState<Option[]>(
    []
  );
  const [dimensionThreeConfig, setDimensionThreeConfig] = React.useState<
    Option[]
  >([]);
  const [dimensionFourConfig, setDimensionFourConfig] = React.useState<
    Option[]
  >([]);
  const [infoSrcConfig, setInfoSrcConfig] = React.useState<Option[]>([]);
  const [advertisementConfig, setAdvertisementConfig] = React.useState<
    Option[]
  >([]);
  const [sourceConfig, setSourceConfig] = React.useState<Option[]>([]);
  const [sectorConfig, setSectorConfig] = React.useState<Option[]>([]);
  const getDimensionConfig = async () => {
    const res = await getConfig({ typeIdList: [22, 23, 24] });
    const currencyConfig: Option[] = createInitConfig();
    const dimensionOneConfig: Option[] = createInitConfig();
    const dimensionTwoConfig: Option[] = createInitConfig();
    const dimensionThreeConfig: Option[] = createInitConfig();
    const dimensionFourConfig: Option[] = createInitConfig();
    const infoSrcConfig: Option[] = createInitConfig();
    const advertisementConfig: Option[] = createInitConfig();
    const sourceConfig: Option[] = createInitConfig();
    const sectorConfig: Option[] = createInitConfig();
    const map = res.data.reduce<Record<string, string>>(
      (map, { id, value, typeId, list }) => {
        map[id] = value;
        let content = value;
        if (lang === Language.ZH) {
          content =
            list?.find((item) => item.languageCode === lang)?.value || value;
        }
        const option = { value: id, label: value, name: content };
        if (typeId === 6) {
          currencyConfig.push(option);
        } else if (typeId === 7) {
          dimensionOneConfig.push(option);
        } else if (typeId === 8) {
          dimensionTwoConfig.push(option);
        } else if (typeId === 9) {
          dimensionThreeConfig.push(option);
        } else if (typeId === 10) {
          dimensionFourConfig.push(option);
        } else if (typeId === 11) {
          infoSrcConfig.push(option);
        } else if (typeId === 22) {
          advertisementConfig.push(option);
        } else if (typeId === 23) {
          sourceConfig.push(option);
        } else if (typeId === 24) {
          sectorConfig.push(option);
        }
        return map;
      },
      {}
    );
    setDimensionMap(map);
    setCurrencyConfig(currencyConfig);
    setDimensionOneConfig(dimensionOneConfig);
    setDimensionTwoConfig(dimensionTwoConfig);
    setDimensionThreeConfig(dimensionThreeConfig);
    setDimensionFourConfig(dimensionFourConfig);
    setInfoSrcConfig(infoSrcConfig);
    setAdvertisementConfig(advertisementConfig);
    setSourceConfig(sourceConfig);
    setSectorConfig(sectorConfig);
  };
  React.useEffect(() => {
    getDimensionConfig();
  }, [lang]);
  return {
    dimensionMap,
    currencyConfig,
    dimensionOneConfig,
    dimensionTwoConfig,
    dimensionThreeConfig,
    dimensionFourConfig,
    infoSrcConfig,
    advertisementConfig,
    sourceConfig,
    sectorConfig,
  };
};

export default useDimensionDict;
