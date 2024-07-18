declare namespace User {
  export type ThirdInfo = {
    id: string;
    userId: string;
    thirdpartyId?: string;
    email: string;
    username: string;
    thirdpartyName: ThirdpartyName;
  };
  export type UserInfo = {
    id: string;
    email: string;
    photo: string | null;
    userCode: string;
    usernameChangeCount: number;
    userThirdRelationVOS: ThirdInfo[] | null;
    username: string;
    language: string;
    invitationCode: string;
    totalInvitations: number;
    isFirstLogin: number;
    isVersionLogin: number;
    thirdInfo?: {
      google: ThirdInfo | null;
      wallet: ThirdInfo | null;
      twitter: ThirdInfo | null;
    };
  };
  export type Backpack = {
    id: string;
    name: string;
    useId: string;
  };
  export type Task = {
    type: number;
    status: number;
    exp: number;
    completeTime: string;
  };
  export type S2Post = {
    content: string;
    id: string;
    source: 1 | 2;
    title: string;
    userId: string;
  };

  export type CollectCoins = {
    id: string;
    userId: string;
    symbolId: string;
    currencyId: string;
    userBackpackId: string;
    userBackpackName: string;
    sort: string | null;
  };

  export type IPData = {
    phoneAreaCode: string;
    isoCode: string;
    ip: string;
    language: string;
  }
}
