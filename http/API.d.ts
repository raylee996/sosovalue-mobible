declare namespace API {
  export type ChartType = {
    charValue: string[];
    data: any[];
    meaning: string;
    period: string;
    innerKey?: string;
    tag?: string[];
    title: string;
    description?: string;
    formula?: string;
    viewType?: string;
    chartType?: string;
    switchCharts?: string[];
    chartPeriods?: string[];
  };
  export type TradingPair = {
    baseAsset: string;
    id: string;
    quoteAsset: string;
    symbol: string;
    status: number;
  };
  export type Dict = {
    id: number;
    sort: number;
    value: string;
    typeId: number;
    list: {
      languageCode: "en" | "zh";
      value: string;
    }[];
  };
  export type sectionList = {
    change24h: string;
    imageUrlList: string[];
    name: string;
    sectorId: string;
    tvl: string;
    sectorData: API.ChainsTableType[];
  };
  export type OriginalCurrencyDetail = {
    charId: string;
    businessModel: string;
    tokenUnlocks: string;
    allocation: string;
    firstIssueTime: string;
    individuals?: string;
    introduction: string;
    investors?: string;
    organizations?: string;
    tokenModel?: string;
    whitePaperLink: string;
    industryStatus: string;
    info: string;
    googleTrends: string;
    fullAllocation: string;
    github: string;
    rounds: string;
    twitterData: string;
    tokenConfig: number;
    tokenomicsIntro: string;
    currencyId: string;
  };
  export type CurrencyMember = {
    avatar: string;
    bio: string;
    location: string;
    name: string;
    twitterLink: string;
    linkinLink: string;
  };
  export type Investor = {
    category: number;
    homepage: string;
    intro: string;
    logo: string;
    name: string;
    projectUrl: string;
    twitter: string;
  };
  export type CurrencyDetail = {
    introduction: string;
    whitePaperLink: string;
    businessModel: string;
    industryStatus: string;
    firstIssueTime: string;
    individuals: CurrencyMember[];
    investors: CurrencyMember[];
    organizations: CurrencyMember[];
    tokenModel: {
      holder: string;
      percentage: number;
    }[];
  };
  export type DevelopmentProcess = {
    development: string;
    sosCoinId: number;
    year: number;
  };
  export type AbbrMarket = {
    C: string;
    F: string;
    L: string;
    O: string;
    P: string;
    c: string;
    h: string;
    l: string;
    n: string;
    o: string;
    p: string;
    q: string;
    s: string;
    v: string;
    w: string;
  };
  export type Quotation24H = {
    s: string /** 交易对 */;
    c: string /** 价格 */;
    P: string /** 24H Change % */;
    p: string /** 24H Change */;
  };

  export type morData = {
    w: number;
    m: number;
    y: number;
    currencyId: number;
  };
  export type MarketCap = {
    id: number;
    coin: string;
    coinImg: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
    volume: string;
    marketCap: string;
    mroi: string;
    yroi: string;
    currentSupply: number;
    percentPos: number;
    isChange: boolean;
    currencyId: number;
    monthPrice: number;
    yearPrice: number;
    symbolsDoVO?: symbolsDoVO[];
    categoriesAtomList?: any;
    symbolId?: string;
    coinId?: string;
    change4h?: string;
    change4hPercent?: string;
    change24?: string;
    change24Percent?: string;
    wsName?: string;
    exchangeId?: string;
    baseAsset?: string;
    quoteAsset?: string;
    exchangeName?: string;
    symbolId?: string;
  };
  export type SymbolsDoVO = {
    baseAsset: string;
    currencyId: string;
    id: string;
    platform: string;
    platformCurrencyId: string;
    platformId: string;
    quoteAsset: string;
    status: string;
    symbol: string;
    exchangeId: string;
    tickerVO: AbbrMarket[];
  };
  export type Quotation = {
    s: string /** 交易对 */;
    p: string /** 价格变化 */;
    pp: string /** 价格变化百分比 */;
    w: string;
    prev: string /** 收盘价 */;
    lp: string /** 间隔收盘价 */;
    lq: string /** 数量 */;
    bp: string /** 投标价 */;
    bq: string /** 投标数量 */;
    ap: string /** 期望价 */;
    aq: string /** 数量 */;
    op: string /** 间隔开盘价 */;
    hg: string /** 间隔最高价 */;
    low: string /** 间隔最低价 */;
    v: string /** 总交易量  */;
    q: string /** 此k线内所有交易的price(价格) x volume(交易量)的总和 */;
    o: number /** ticker的开始时间 */;
    c: number /** ticker的结束时间 */;
    f: number /** 首笔成交id */;
    l: number /** 末笔成交id */;
    n: number /** 成交笔数 */;
    qc: string;
    qcp: string;
    b: string;
    currentSupply: number;
  };

  export type currentList = {
    currentSupply: string;
    exchangeId: string;
    fullName: string;
    iconUrl: string;
    id: string;
    maxSupply: string;
    name: string;
    sort: string;
    status: number;
    volume: number;
  };
  export type baseData = {
    hasData: boolean;
    list: baseList[];
    pageNum: string;
    pageSize: string;
    total: string;
    totalPage: string;
  };
  export type currencyData = {
    hasData: boolean;
    list: currencyDataList[];
    pageNum: string;
    pageSize: string;
    total: string;
    totalPage: string;
  };

  export type currencyDataTop = {
    hasData: boolean;
    list: top10[];
    pageNum: string;
    pageSize: string;
    total: string;
    totalPage: string;
  };
  export type baseList = {
    categoriesAtomList: string[];
    matchSet: string;
    fullName: string;
    iconUrl: string;
    id: string;
    name: string;
    sort: string;
    status: number;
    pricePrecision: number;
    sort: number;
  };
  export type findCurrencyIdListBySectorIds = {
    code: string;
    data: any;
    msg: string;
  };
  export type marketData = {
    change1h: string;
    change1hPercent: string;
    change4h: string;
    change4hPercent: string;
    change24: string;
    change24Percent: string;
    exchangeName: string;
    lastPrice: number;
    price: number;
    symbol: string;
    id: string;
  };
  export type currencyDataList = {
    categoriesAtomList: string[];
    athDate: string;
    currencyId: string;
    currentSupply: string;
    cycleLowDate: string;
    id: string;
    monthPrice: number;
    marketCap: number;
    cycleLow: number;
    allTimeHigh: number;
    volume: number;
    weekPrice: number;
    yearPrice: number;
  };

  export type cryptoTotal = {
    marketCap: number;
    volume: number;
    symbol: string;
    data: string;
    gasFee: string;
    marketCapChange: number;
  };

  export type top10 = {
    changePercent: number;
    curerencyName: string;
    currencyAliasName: string;
    currencyAmt: number;
    currencyId: string;
    ds: string;
    iconUrl: string;
    marketCap: number;
    moRoi: number;
    sort: string;
    volume: number;
    yeRoi: number;
  };
  export type findListToCurrency = {
    id: string;
    name: string;
    fullName: string;
    description: string;
    iconUrl: string;
    sort: number;
    status: number;
    perce: number;
    currencyDoVOS: currencyDoVOS[] | null;
    percentage: number;
    rate: number;
  };

  export type currencyDoVOS = {
    id: string;
    exchangeId: string;
    fullName: string;
    name: string;
    iconUrl: string;
    maxSupply: string;
    currentSupply: string;
    volume: string;
    marketCap: string;
    sort: number;
    status: number;
    currencyDataDoVO: any;
  };

  export type chartData = {
    id: string;
    typeId: string;
    name: string;
    requestParams: string;
    responseData: string;
    modifier: object;
    creator: object;
    expirationTime: number;
  };

  export type bcData = {
    h1TotalVolUsd: string;
    shortVolUsd: string;
    totalVolUsd: string;
    longVolUsd: string;
    openInterest: string;
    sumOpenInterestValue: string;
    longShortRatio: string;
    shortAccount: number;
    longAccount: number;
  };
  export type CreateComment = {
    commentAuthor: string;
    commentAuthorId: string;
    commentAuthorImg: string;
    commentName: string;
    commentCreatedAt: string | number;
    commentText: string;
    commentType: 1 | 2 | 3 | 4 | 5;
    topicId: string | number;
  };
  export type Comment = {
    commentAuthor: string;
    commentAuthorId: string;
    commentAuthorImg: string;
    commentCreatedAt: number;
    commentId: number;
    commentImg: string;
    commentName: string;
    commentText: string;
    commentType: 1 | 2 | 3 | 4;
    commentUrl: string;
    creator: string;
    discodeMessageId: number;
    id: number;
    impressionCount: number;
    likeCount: number;
    modifier: string;
    replyCount: number;
    retweetCount: number;
    twitterId: number;
  };
  export type ListParams = {
    recentDay: string | number;
    projectState: string | number;
    dimensionOne: string | number;
    dimensionTwo: string | number;
    dimensionThree: string | number;
    category?: number | undefined;
    categoryList?: number[] | undefined;
    scenarioId: 1 | 2 | 3 | 4;
  } & Pagination;

  export type Article = {
    title: string;
    id: string;
    author: string;
    category: number;
    content: string;
    source: string;
    createTime: string;
    realiseTime: string;
    pushTime: string;
    sourceLink: string;
    originalContent: string;
    originalContent2: string;
    sector: string;
    platName: string;
    contentNum: string;
    isAiGeneration: number;
    originalContent: string;
    originalContent2: string;
    isAuth: number;
    isOfficial: 0 | 1 | undefined;
    authorAvatar: string;
    transferStatus: 0 | 1;
    weight: number;
    coverPicture: string;
    sourceDescription: string;
    originalLanguage: 1 | 2;
    sourcePlatId: string;
    transferTitle: string;
    transferOriginalContent: string;
    transferContent: string;
    transferTraditionalTitle: string;
    transferTraditionalContent: string;
    transferTraditionalOriginalContent: string;
    matchedCurrencies?: {
      count: number;
      fullName: string;
      iconUrl?: string;
      name: string;
      id: string;
    }[];
  };

  export type PlatformCurrency = {
    currentSupply: string;
    fullName: string;
    iconUrl: string;
    id: string;
    marketCap: string;
    maxSupply: string;
    name: string;
    platform: string;
    platformAlias: string;
    platformId: string;
    volume: string;
    symbolDoROS: SymbolList[];
    symbolDoVOS: SymbolList[];
  };
  export type ArticleParams = {
    category: number | string;
    keyword?: string;
  } & API.Pagination;

  export type Symbol = {
    s: string;
    b: string;
    q: string;
  };
  export type CurrencySymbolInfo = {
    id: string;
    currencyId: string;
    fullName: string;
    iconUrl?: string;
    name: string;
    sort: number;
    symbolDoVO: {
      id: string;
      symbol: string;
      wsName: string;
      exchangeId: string;
      tickerVO?: AbbrMarket;
      exchangeCurrencyFullName: string;
      quoteAsset: string;
      exchangeName: string;
    };
    currencyDoVO: {
      name: string;
      fullName: string;
    };
    currencyDataDoVO: CurrencyInfo;
    categoriesAtomList: string[];
  };
  export type CurrencyInfo = {
    iconUrl: string;
    id: string;
    name: string;
    fullName: string;
    currentSupply: string;
    totalSupply: string;
    maxSupply?: string;
    cycleLow: number;
    cycleLowDate: string;
    marketCap: number;
    monthPrice: number;
    volume: number;
    weekPrice: number;
    yearPrice: number;
    allTimeHigh: number;
    athDate: string;
    cycleLow: number;
    cycleLowDate: number;
  };

  export type volumnData = {
    currencyId: string;
    volume: number;
  };

  export type Pagination = {
    pageNum: number;
    pageSize: number;
  };
  export type CommonListParams = Pagination & {
    orderItems?: { asc: boolean; column: string }[];
  };
  export type ListResponse<T> = {
    totalPage: number;
    total: number;
    list?: T[];
  } & Pagination;

  export type ThirdpartyName =
    | "google"
    | "twitter"
    | "rainbowkit"
    | "telegram"
    | "apple";
  export type ThirdInfo = {
    id: string;
    userId: string;
    thirdpartyId?: string;
    email: string;
    username: string;
    thirdpartyName: ThirdpartyName;
  };
  export type CurrentUser = {
    id: string;
    email: string;
    phone: string;
    photo: string | null;
    userCode: string;
    usernameChangeCount: number;
    userThirdRelationVOS: ThirdInfo[] | null;
    username: string;
    language: string;
    invitationCode: string;
    invitationUserId: string;
    totalInvitations: number;
    isFirstLogin: number;
    isVersionLogin: number;
    editableUsername: 1 | 0;
    thirdInfo?: {
      google: API.ThirdInfo | null;
      wallet: API.ThirdInfo | null;
      twitter: API.ThirdInfo | null;
      telegram: API.ThirdInfo | null;
      apple: API.ThirdInfo | null;
    };
  };
  export type LoginResult = {
    token: string;
    refreshToken: string;
    userId: string;
    username: string;
    email: string;
    photo: string;
  };
  export type RegisterByPhoneResult = {
    email: string;
    expiration: string;
    expire: number;
    expireMillis: number;
    photo: string;
    refreshToken: string;
    token: string;
    tokenType: string;
    userId: number;
    username: string;
  };
  export type ResetPwd = {
    password: string;
    rePassword: string;
    token: any;
  };
  export type EmailPwdLogin = {
    email: string;
    password: string;
    type: string;
  };
  export type EmailCodeLogin = {
    email: string;
    verifyCode: string;
    type: string;
  };
  export type PhoneCodeLogin = {
    phone: string;
    verifyCode: string;
  };

  export type EmailBind = {
    token: any;
    // verifyCode: string;
    // password: string;
    // rePassword: string;
  };
  export type EmailBindV2 = {
    token: any;
    password: string;
    rePassword: string;
  };
  export type ThirdParams = {
    code: string;
    thirdpartyName: string;
    redirectUri: string;
    thirdpartyId: string;
    oauthToken: string;
    oauthVerifier: string;
  };
  export type ThirdPartyLogin = {
    code?: string;
    thirdpartyName?: string;
    redirectUri?: string;
    thirdpartyId?: string;
    oauthToken?: string;
    oauthVerifier?: string;
    signatureHex?: string;
    message?: string;

    authDate?: number;
    firstName?: telegramUser.first_name;
    username?: telegramUser.username;
    photoUrl?: string;
    lastName?: string;
    registerDevice?: string;
  };

  export type ThirdPartyRegister = {
    password?: string;
    rePassword?: string;
    thirdpartyName?: string;
    username: string;
    token: string;
  };
  export type EmailCodeRegister = {
    username: string;
    password: string;
    rePassword: string;
    uuid: string;
  };
  export type WalletLogin = {
    thirdpartyId: string;
    thirdpartyName: string;
    signatureHex?: string;
    message?: string;
  };
  export type UserLogin = {
    isDifferent?: true;
    loginName: string;
    password: string;
    /** 类型(portal: 资讯平台，admin：管理后台) */
    type: "portal" | "admin";
    verifyCode?: string;
  };
  export type UserPhonePwdLogin = {
    isDifferent?: true;
    password: string;
    phone: string;
    verifyCode?: string;
  };
  export type RegisterCodeParams = {
    password: string;
    rePassword: string;
    username: string;
    email: string;
  };
  export type UserRegister = {
    password: string;
    rePassword: string;
    token: any;
    username: string;
  };
  export type UserRegisterV3 = {
    password: string;
    rePassword: string;
    username: string;
    email: string;
    verifyCode: string;
  };
  export type UserRegisterByPhone = {
    password: string;
    rePassword: string;
    verifyCode: string;
    countryCode: string;
    phoneNumber: string;
  };
  export type LoginRes = {
    token: string;
  };
  export type RegisterUser = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  };
  export type UpdatePassword = {
    password: string;
    confirmPassword: string;
  };
  export type Project = {
    id: string;
    projectName: string;
    projectCode: string;
    projectIntroduction: string;
    coverPicture: string;
    contract: string;
    explorersName: string;
    explorersLink: string;
    website: string;
    twitterLink: string;
    discord: string;
    projectOption: string;
    projectExtList: {
      fieldName: string;
      fieldValue: string;
      id: number;
      projectId: string;
      sort: number;
    }[];
  };
  export type SearchResult = {
    projectInfoDoVO: API.Project | null;
    group: {
      type: 0 | 1 | 2 | 3;
      count: string;
      list: API.Post[];
    }[];
  };
  export type Post = {
    id: string;
    authorName: string;
    title: string;
    label: string;
    createTime: string;
    creationTime: string;
    viewCount: string;
    collectionCount: string;
    objectivityScore: string;
    state: 1 | 2 | 3;
    coverPicture: string;
    compositeScore: number;
    brief: string;
    updateTime: string;
    originalLanguage: 1 | 2;
    contentEn: string;
    contentCn: string;
    prefixContentEn: string;
    isJump: 1 | 2;
    projectId: string;
    level: string;
    sourceUrl: string;
    type: 1 | 2 | 3;
  };
  export type Bookmark = {
    id: string;
    articleInfoVO: API.Post;
    bookmarkId: string;
    symbolDoVO: API.TradingPair;
  };
  export type Portfollo = {
    id: string;
    projectInfoDoVO: API.Project;
  };
  export type Subscribe = {
    subscribeId: string;
    subscribeType: "item" | "author";
  };
  export type Collect = {
    bookmarkId: string;
    bookmarkType: "post" | "author" | "symbol";
  };
  export type ScorePost = {
    articleId: string;
    score: number;
    userId: string;
  };
  export type ResearchDict = {
    id: string;
    sort: number;
    value: string;
  };

  //图表
  export type legend = {
    height: string;
    color: string;
    name: string;
    val: string | number;
  };

  export type initText = {
    title: string;
    whatisDescription: string;
    whatisFormula: string;
    whatisMeaning: string;
  };

  export type Indicator = {
    id: string;
    name: string;
    isDisplay: number;
    nameEn: string;
    parentId: string;
    pbulishRule: string;
    websiteLink: string;
    publishedValueType: number;
    classificationId: string;
  };

  export type IndicatorData = {
    id: string;
    classificationId: string;
    dateType: number;
    indicatorType: number;
    predictedPublishTimestamp: string;
    predictedValue: number;
    pubDate: string;
    publishedValue: number;
    indicatorClassificationDoVO: Indicator;
    actual: number;
    forecast: string;
    percent: number;
    releaseTimeTimestamp: number;
  };
  export type IndicatorTreeData = {
    categoryId: string;
    categoryPath: string;
    classPath: string;
    className: string;
    indicatorDataIds: string;
    chartId: string;
    creator: string;
    dataDescription: string;
    dataFormula: string;
    dataPurpose: string;
    dataType: number;
    fieldName: string;
    id: string;
    initialRange: string;
    isCompare: number;
    isDisplay: number;
    modifier: string;
    name: string;
    period: string;
    source: string;
    sourceLink: string;
    sourceMethod: string;
    tableName: string;
    timeName: string;
  };
  export type Backpack = {
    id: string;
    name: string;
    useId: string;
    isEdit?: boolean;
    itemCount?: number;
  };
  export type bookmarkList = {
    baseAsset: string;
    baseCurrencyIcon: string;
    currencyId: string;
    exchangeId: string;
    exchangeName: string;
    id: string;
    platform: string;
    platformCurrencyId: string;
    quoteAsset: string;
    status: number;
    symbol: string;
    tickerVO: AbbrMarket;
    type: string;
    wsName: string;
    price: string;
    change24?: string;
    change24Percent?: string;
    exchangeRate: string;
    nature: string;
  };
  export type createBatchParams = {
    id?: string;
    symbolIdList: array;
    userId?: string;
    userBackpackId: string;
    sort?: string;
  };
  export type ChartDataWrap = {
    responseData: string;
    name: string;
    timeRange: string[];
    initFixedScale: string;
    whatisDescription: string;
    whatisFormula: string;
    whatisMeaning: string;
    data: string;
  };
  export type chartDate = {
    code: number;
    msg: string;
    data: any;
  };
  export type SearchCrypto = {
    fullName: string;
    iconUrl: string;
    id: string;
    name: string;
    status: number;
    sort: number;
  };
  export type SearchPair = {
    baseCurrencyIcon?: string;
    currencyId?: string;
    exchangeName: string;
    id: string;
    status: number;
    symbol: string;
    exchangeId: string;
    exchangeRate: string;
  };
  export type GiftTask = {
    completeNum: number;
    completedNum: number;
    giftNum: string;
    finishType: number | null;
  };
  export type CoinCategory = {
    currencyDoVOS: API.CurrencySymbolInfo[];
    description: string;
    fullName: string;
    id: string;
    name: string;
    status: number;
  };
  export type Sector = {
    currencyDoVOS: null;
    description: string;
    fullName: string;
    id: string;
    name: string;
    status: number;
  };
  export type CoinBaseInfo = {
    fullName: string;
    id: string;
    iconUrl: string;
    name: string;
    sort: number;
  };
  export type PairMarket = {
    exchangeId: string;
    exchangeName: string;
    id: string;
    symbol: string;
    wsName: string;
    price: string;
    lastPrice: string;
    change1h: string;
    change4h: string;
    change24: string;
    change1hPercent: string;
    change4hPercent: string;
    change24Percent: string;
    roi1mo: string;
    roi1y: string;
  };
  export type Banner = {
    coverPicture: string;
    id: string;
    subjectId: string;
    tag?: string;
    type: number;
  };
  export type userExp = {
    currentExp: number;
    isAuth: number;
    lastSettledExp: number;
    level: number;
    totalInvitationEXP: number;
  };
  export type Information = {
    author: string;
    releaseTime: string;
    id: string;
    title: string;
    content: string;
    isAuth: 0 | 1;
    sector: string;
    realiseTime: string;
    contentNum: number;
    matchedCurrencies: {
      count: number;
      fullName: string;
      iconUrl: string;
      id: string;
      name: string;
    }[];
  };
  export type userMessage = {
    actionClassify: number;
    actionId: number;
    createTime: number;
    module: number;
    spendTime: number;
    userBrowser: string;
    userDevice: string;
  };
  export type hkEtfList = {
    id: number;
    ticker: string;
    etfCoinType: string;
    inst: string;
    fiatMoney: string;
    premDsc: number;
    lastPrice: number;
    turnover: number;
    volume: number;
    dailyChg: number;
    dailyVol: number;
    turnoverRate: number;
    fee: number;
    status: number | string;
    newShares: number;
    totalShares: number;
    expenseRatio: number;
    cumNetInflow: number;
    netAssetsChange: number;
    netInflow: number;
    totalNav: number;
    timestamp: string;
    "1DNewShares": number;
    "1DBTCInflow": number;
    "1DETHInflow"?: number;
    totalBTC: number;
    totalETH?: number;

    BTCPerShare?: number;
    ETHPerShare?: number;
  };
  export type etfList = {
    id: number;
    ticker: string;
    exchangeName: string;
    name: string;
    inst: string;
    mktPrice: number;
    dailyChange: number;
    volume: number;
    premDsc: string;
    premDscLast: string;
    netInflow: number;
    totalNav: number;
    totalNavLast: number;
    listingDate: number;
    status: number;
    fee: number;
    dailyVol: number;
    cumNetInflow: number;
    cumNetInflowLast: number;
    netAssetsChange: number;
    netAssetsChangeLast: number;
  };
  export type timeLine = {
    id: number;
    approveTime: string;
    timeZone: string;
    name: string;
    inst: number;
  };
  export type historyList = {
    dataDate: string;
    totalNetAssets: number;
    totalNetInflow: number;
    totalNetInflowInCash: number;
    totalNetInflowInKind: number;
    totalVolume: number;
    cumNetInflow: number;
    cumNetInflowInCash: number;
    cumNetInflowInKind: number;
  };
  export type baseTimeLine = {
    currentField: boolean;
    list: timeLine[];
    pageNum: string;
    pageSize: string;
    total: string;
    totalPage: string;
  };
  export type baseTime = {
    currentField: boolean;
    list: time[];
    pageNum: string;
    pageSize: string;
    total: string;
    totalPage: string;
  };
  export type ChartIntroduce = {
    data: string;
    otherData: string;
  };
  export type TelegramBotInfo = {
    id: string;
    is_bot: boolean;
    first_name: string;
    appName: string;
    username: string;
    can_join_groups: boolean;
    can_read_all_group_messages: boolean;
    supports_inline_queries: boolean;
    can_connect_to_business: boolean;
  };
  export type PhoneBind = {
    password: string;
    rePassword: string;
    token: string;
    countryCode: string;
    phoneNumber: string;
  };
  export type CheckPhoneVerifyTypes =
    | "FORGOT_PASSWORD_CODE"
    | "BIND_CODE"
    | "BEFORE_CHANGE_BIND_CODE"
    | "AFTER_CHANGE_BIND_CODE"
    | "CHANGE_PASSWORD_CODE"
    | "LOGOUT_CODE";
  export type CheckEmailVerifyTypes =
    | "FORGOTPASSWORDCODE"
    | "EMAILBINDCODE"
    | "BEFORE_CHANGE_BIND_CODE"
    | "AFTER_CHANGE_BIND_CODE"
    | "CHANGE_PASSWORD_CODE"
    | "LOGOUT_CODE";
  export type ChangeBindRequest = {
    afterChangeBindToken: string;
    beforeChangeBindToken: string;
    countryCode: string;
    phoneNumber: string;
  };
  export type CheckIsNewDeviceRequest = {
    emailOrPhone: string;
    /**
     * - type: 1 邮箱
     * - type: 2 手机
     */
    type: 1 | 2;
  };
  export type PairMarket = {
    price: number;
    change24hPercent: number;
    yroi: number;
    mroi: number;
  };
  export type CurrencyHandicap = {
    currencyDataDoVO: {
      yroi: any;
      mroi: any;
      symbolHandicap: {
        price: number;
        uprice: number;
        change24hPercent: number;
      };
    };
  };
}
