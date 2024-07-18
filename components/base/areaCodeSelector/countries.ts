const countries = [
  // {
  //   countryName: { en: "China", zh: "中国 ", tc: "中国", ja: "アンドラ" },
  //   countryCode: "CN",
  //   areaCode: "86",
  // },
  {
    countryName: { en: "Andorra", zh: "安道尔 ", tc: "安道爾", ja: "アンドラ" },
    countryCode: "AD",
    areaCode: "376",
  },
  {
    countryName: {
      en: "United Arab Emirates",
      zh: "阿拉伯联合酋长国 ",
      tc: "阿拉伯聯合酋長國",
      ja: "アラブ首長国連邦",
    },
    countryCode: "AE",
    areaCode: "971",
  },
  {
    countryName: {
      en: "Afghanistan",
      zh: "阿富汗 ",
      tc: "阿富汗",
      ja: "アフガニスタン",
    },
    countryCode: "AF",
    areaCode: "93",
  },
  {
    countryName: {
      en: "Antigua and Barbuda",
      zh: "安提瓜和巴布达 ",
      tc: "安提瓜和巴布達",
      ja: "アンティグア・バーブーダ",
    },
    countryCode: "AG",
    areaCode: "1268",
  },
  {
    countryName: {
      en: "Anguilla",
      zh: "安圭拉 ",
      tc: "安圭拉",
      ja: "アンギラ",
    },
    countryCode: "AI",
    areaCode: "1264",
  },
  {
    countryName: {
      en: "Albania",
      zh: "阿尔巴尼亚 ",
      tc: "阿爾巴尼亞",
      ja: "アルバニア",
    },
    countryCode: "AL",
    areaCode: "355",
  },
  {
    countryName: {
      en: "Armenia",
      zh: "亚美尼亚 ",
      tc: "亞美尼亞",
      ja: "アルメニア",
    },
    countryCode: "AM",
    areaCode: "374",
  },
  {
    countryName: { en: "Angola", zh: "安哥拉 ", tc: "安哥拉", ja: "アンゴラ" },
    countryCode: "AO",
    areaCode: "244",
  },
  {
    countryName: {
      en: "Argentina",
      zh: "阿根廷 ",
      tc: "阿根廷",
      ja: "アルゼンチン",
    },
    countryCode: "AR",
    areaCode: "54",
  },
  {
    countryName: {
      en: "American Samoa",
      zh: "美属萨摩亚 ",
      tc: "美屬薩摩亞",
      ja: "アメリカ領サモア",
    },
    countryCode: "AS",
    areaCode: "1684",
  },
  {
    countryName: {
      en: "Austria",
      zh: "奥地利 ",
      tc: "奧地利",
      ja: "オーストリア",
    },
    countryCode: "AT",
    areaCode: "43",
  },
  {
    countryName: {
      en: "Australia",
      zh: "澳大利亚 ",
      tc: "澳大利亞",
      ja: "オーストラリア",
    },
    countryCode: "AU",
    areaCode: "61",
  },
  {
    countryName: { en: "Aruba", zh: "阿鲁巴 ", tc: "阿魯巴", ja: "アルバ" },
    countryCode: "AW",
    areaCode: "297",
  },
  {
    countryName: {
      en: "Azerbaijan",
      zh: "阿塞拜疆 ",
      tc: "亞塞拜然",
      ja: "アゼルバイジャン",
    },
    countryCode: "AZ",
    areaCode: "994",
  },
  {
    countryName: {
      en: "Bosnia and Herzegovina",
      zh: "波斯尼亚和黑塞哥维那 ",
      tc: "波士尼亞和黑塞哥維那",
      ja: "ボスニア・ヘルツェゴビナ",
    },
    countryCode: "BA",
    areaCode: "387",
  },
  {
    countryName: {
      en: "Barbados",
      zh: "巴巴多斯 ",
      tc: "巴巴多斯",
      ja: "バルバドス",
    },
    countryCode: "BB",
    areaCode: "1246",
  },
  {
    countryName: {
      en: "Bangladesh",
      zh: "孟加拉国 ",
      tc: "孟加拉",
      ja: "バングラデシュ",
    },
    countryCode: "BD",
    areaCode: "880",
  },
  {
    countryName: { en: "Belgium", zh: "比利时 ", tc: "比利時", ja: "ベルギー" },
    countryCode: "BE",
    areaCode: "32",
  },
  {
    countryName: {
      en: "Burkina Faso",
      zh: "布基纳法索 ",
      tc: "布吉納法索",
      ja: "ブルキナファソ",
    },
    countryCode: "BF",
    areaCode: "226",
  },
  {
    countryName: {
      en: "Bulgaria",
      zh: "保加利亚 ",
      tc: "保加利亞",
      ja: "ブルガリア",
    },
    countryCode: "BG",
    areaCode: "359",
  },
  {
    countryName: { en: "Bahrain", zh: "巴林 ", tc: "巴林", ja: "バーレーン" },
    countryCode: "BH",
    areaCode: "973",
  },
  {
    countryName: { en: "Burundi", zh: "布隆迪 ", tc: "蒲隆地", ja: "ブルンジ" },
    countryCode: "BI",
    areaCode: "257",
  },
  {
    countryName: { en: "Benin", zh: "贝宁 ", tc: "貝寧", ja: "ベナン" },
    countryCode: "BJ",
    areaCode: "229",
  },
  {
    countryName: {
      en: "Bermuda",
      zh: "百慕大群岛 ",
      tc: "百慕達",
      ja: "バミューダ",
    },
    countryCode: "BM",
    areaCode: "1441",
  },
  {
    countryName: { en: "Brunei", zh: "文莱 ", tc: "汶萊", ja: "ブルネイ" },
    countryCode: "BN",
    areaCode: "673",
  },
  {
    countryName: {
      en: "Bolivia",
      zh: "玻利维亚 ",
      tc: "玻利維亞",
      ja: "ボリビア",
    },
    countryCode: "BO",
    areaCode: "591",
  },
  {
    countryName: {
      en: "Caribbean Netherlands",
      zh: "荷兰加勒比 ",
      tc: "荷蘭加勒比區",
      ja: "カリブオランダ",
    },
    countryCode: "BQ",
    areaCode: "599",
  },
  {
    countryName: { en: "Brazil", zh: "巴西 ", tc: "巴西", ja: "ブラジル" },
    countryCode: "BR",
    areaCode: "55",
  },
  {
    countryName: { en: "Bahamas", zh: "巴哈马 ", tc: "巴哈馬", ja: "バハマ" },
    countryCode: "BS",
    areaCode: "1242",
  },
  {
    countryName: { en: "Bhutan", zh: "不丹 ", tc: "不丹", ja: "ブータン" },
    countryCode: "BT",
    areaCode: "975",
  },
  {
    countryName: {
      en: "Botswana",
      zh: "博茨瓦纳 ",
      tc: "波札那",
      ja: "ボツワナ",
    },
    countryCode: "BW",
    areaCode: "267",
  },
  {
    countryName: {
      en: "Belarus",
      zh: "白俄罗斯 ",
      tc: "白俄羅斯",
      ja: "ベラルーシ",
    },
    countryCode: "BY",
    areaCode: "375",
  },
  {
    countryName: { en: "Belize", zh: "伯利兹 ", tc: "貝里斯", ja: "ベリーズ" },
    countryCode: "BZ",
    areaCode: "501",
  },
  {
    countryName: {
      en: "United States/Canada",
      zh: "美国/加拿大 ",
      tc: "美國/加拿大",
      ja: "アメリカ/カナダ",
    },
    countryCode: "CA_US",
    areaCode: "1",
  },
  {
    countryName: {
      en: "Democratic Republic of the Congo",
      zh: "刚果民主共和国 ",
      tc: "剛果民主共和國",
      ja: "コンゴ民主共和国",
    },
    countryCode: "CD",
    areaCode: "243",
  },
  {
    countryName: {
      en: "Central African Republic",
      zh: "中非共和国 ",
      tc: "中非共和國",
      ja: "中央アフリカ共和国",
    },
    countryCode: "CF",
    areaCode: "236",
  },
  {
    countryName: {
      en: "Republic of the Congo",
      zh: "刚果共和国 ",
      tc: "剛果共和國",
      ja: "コンゴ共和国",
    },
    countryCode: "CG",
    areaCode: "242",
  },
  {
    countryName: { en: "Switzerland", zh: "瑞士 ", tc: "瑞士", ja: "スイス" },
    countryCode: "CH",
    areaCode: "41",
  },
  {
    countryName: {
      en: "Ivory Coast",
      zh: "象牙海岸 ",
      tc: "象牙海岸",
      ja: "コートジボワール",
    },
    countryCode: "CI",
    areaCode: "225",
  },
  {
    countryName: {
      en: "Cook Islands",
      zh: "库克群岛 ",
      tc: "庫克群島",
      ja: "クック諸島",
    },
    countryCode: "CK",
    areaCode: "682",
  },
  {
    countryName: { en: "Chile", zh: "智利 ", tc: "智利", ja: "チリ" },
    countryCode: "CL",
    areaCode: "56",
  },
  {
    countryName: {
      en: "Cameroon",
      zh: "喀麦隆 ",
      tc: "喀麥隆",
      ja: "カメルーン",
    },
    countryCode: "CM",
    areaCode: "237",
  },
  {
    countryName: {
      en: "Colombia",
      zh: "哥伦比亚 ",
      tc: "哥倫比亞",
      ja: "コロンビア",
    },
    countryCode: "CO",
    areaCode: "57",
  },
  {
    countryName: {
      en: "Costa Rica",
      zh: "哥斯达黎加 ",
      tc: "哥斯大黎加",
      ja: "コスタリカ",
    },
    countryCode: "CR",
    areaCode: "506",
  },
  {
    countryName: {
      en: "Cape Verde",
      zh: "佛得角 ",
      tc: "維德角",
      ja: "カーボベルデ",
    },
    countryCode: "CV",
    areaCode: "238",
  },
  {
    countryName: {
      en: "Curaçao",
      zh: "库拉索 ",
      tc: "庫拉索",
      ja: "キュラソー",
    },
    countryCode: "CW",
    areaCode: "599",
  },
  {
    countryName: {
      en: "Cyprus",
      zh: "塞浦路斯 ",
      tc: "塞浦路斯",
      ja: "キプロス",
    },
    countryCode: "CY",
    areaCode: "357",
  },
  {
    countryName: {
      en: "Czech Republic",
      zh: "捷克 ",
      tc: "捷克共和國",
      ja: "チェコ共和国",
    },
    countryCode: "CZ",
    areaCode: "420",
  },
  {
    countryName: { en: "Germany", zh: "德国 ", tc: "德國", ja: "ドイツ" },
    countryCode: "DE",
    areaCode: "49",
  },
  {
    countryName: { en: "Djibouti", zh: "吉布提 ", tc: "吉布地", ja: "ジブチ" },
    countryCode: "DJ",
    areaCode: "253",
  },
  {
    countryName: { en: "Denmark", zh: "丹麦 ", tc: "丹麥", ja: "デンマーク" },
    countryCode: "DK",
    areaCode: "45",
  },
  {
    countryName: {
      en: "Dominica",
      zh: "多米尼加 ",
      tc: "多米尼加",
      ja: "ドミニカ",
    },
    countryCode: "DM",
    areaCode: "1767",
  },
  {
    countryName: {
      en: "Dominican Republic",
      zh: "多米尼加共和国 ",
      tc: "多明尼加共和國",
      ja: "ドミニカ共和国",
    },
    countryCode: "DO",
    areaCode: "1809",
  },
  {
    countryName: {
      en: "Algeria",
      zh: "阿尔及利亚 ",
      tc: "阿爾及利亞",
      ja: "アルジェリア",
    },
    countryCode: "DZ",
    areaCode: "213",
  },
  {
    countryName: {
      en: "Ecuador",
      zh: "厄瓜多尔 ",
      tc: "厄瓜多",
      ja: "エクアドル",
    },
    countryCode: "EC",
    areaCode: "593",
  },
  {
    countryName: {
      en: "Estonia",
      zh: "爱沙尼亚 ",
      tc: "愛沙尼亞",
      ja: "エストニア",
    },
    countryCode: "EE",
    areaCode: "372",
  },
  {
    countryName: { en: "Egypt", zh: "埃及 ", tc: "埃及", ja: "エジプト" },
    countryCode: "EG",
    areaCode: "20",
  },
  {
    countryName: {
      en: "Eritrea",
      zh: "厄立特里亚 ",
      tc: "厄立特里亞",
      ja: "エリトリア",
    },
    countryCode: "ER",
    areaCode: "291",
  },
  {
    countryName: { en: "Spain", zh: "西班牙 ", tc: "西班牙", ja: "スペイン" },
    countryCode: "ES",
    areaCode: "34",
  },
  {
    countryName: {
      en: "Ethiopia",
      zh: "埃塞俄比亚 ",
      tc: "衣索比亞",
      ja: "エチオピア",
    },
    countryCode: "ET",
    areaCode: "251",
  },
  {
    countryName: { en: "Finland", zh: "芬兰 ", tc: "芬蘭", ja: "フィンランド" },
    countryCode: "FI",
    areaCode: "358",
  },
  {
    countryName: { en: "Fiji", zh: "斐济 ", tc: "斐濟", ja: "フィジー" },
    countryCode: "FJ",
    areaCode: "679",
  },
  {
    countryName: {
      en: "Micronesia",
      zh: "密克罗尼西亚 ",
      tc: "密克羅尼西亞",
      ja: "ミクロネシア連邦",
    },
    countryCode: "FM",
    areaCode: "691",
  },
  {
    countryName: {
      en: "Faroe Islands",
      zh: "法罗群岛 ",
      tc: "法羅群島",
      ja: "フェロー諸島",
    },
    countryCode: "FO",
    areaCode: "298",
  },
  {
    countryName: { en: "France", zh: "法国 ", tc: "法國", ja: "フランス" },
    countryCode: "FR",
    areaCode: "33",
  },
  {
    countryName: { en: "Gabon", zh: "加蓬 ", tc: "加彭", ja: "ガボン" },
    countryCode: "GA",
    areaCode: "241",
  },
  {
    countryName: {
      en: "United Kingdom",
      zh: "英国 ",
      tc: "英國",
      ja: "イギリス",
    },
    countryCode: "GB",
    areaCode: "44",
  },
  {
    countryName: {
      en: "Grenada",
      zh: "格林纳达 ",
      tc: "格瑞那達",
      ja: "グレナダ",
    },
    countryCode: "GD",
    areaCode: "1473",
  },
  {
    countryName: {
      en: "Georgia",
      zh: "格鲁吉亚 ",
      tc: "格魯吉亞",
      ja: "ジョージア",
    },
    countryCode: "GE",
    areaCode: "995",
  },
  {
    countryName: {
      en: "French Guiana",
      zh: "法属圭亚那 ",
      tc: "法屬圭亞那",
      ja: "フランス領ギアナ",
    },
    countryCode: "GF",
    areaCode: "594",
  },
  {
    countryName: { en: "Ghana", zh: "加纳 ", tc: "迦納", ja: "ガーナ" },
    countryCode: "GH",
    areaCode: "233",
  },
  {
    countryName: {
      en: "Gibraltar",
      zh: "直布罗陀 ",
      tc: "直布羅陀",
      ja: "ジブラルタル",
    },
    countryCode: "GI",
    areaCode: "350",
  },
  {
    countryName: {
      en: "Greenland",
      zh: "格陵兰岛 ",
      tc: "格陵蘭",
      ja: "グリーンランド",
    },
    countryCode: "GL",
    areaCode: "299",
  },
  {
    countryName: { en: "Gambia", zh: "冈比亚 ", tc: "甘比亞", ja: "ガンビア" },
    countryCode: "GM",
    areaCode: "220",
  },
  {
    countryName: { en: "Guinea", zh: "几内亚 ", tc: "幾內亞", ja: "ギニア" },
    countryCode: "GN",
    areaCode: "224",
  },
  {
    countryName: {
      en: "Saint Martin",
      zh: "瓜德罗普岛 ",
      tc: "聖馬丁島",
      ja: "サン・マルタン",
    },
    countryCode: "GP",
    areaCode: "590",
  },
  {
    countryName: {
      en: "Equatorial Guinea",
      zh: "赤道几内亚 ",
      tc: "赤道幾內亞",
      ja: "赤道ギニア",
    },
    countryCode: "GQ",
    areaCode: "240",
  },
  {
    countryName: { en: "Greece", zh: "希腊 ", tc: "希臘", ja: "ギリシャ" },
    countryCode: "GR",
    areaCode: "30",
  },
  {
    countryName: {
      en: "Guatemala",
      zh: "瓜地马拉 ",
      tc: "瓜地馬拉",
      ja: "グアテマラ",
    },
    countryCode: "GT",
    areaCode: "502",
  },
  {
    countryName: { en: "Guam", zh: "关岛 ", tc: "關島", ja: "グアム" },
    countryCode: "GU",
    areaCode: "1671",
  },
  {
    countryName: {
      en: "Guinea-Bissau",
      zh: "几内亚比绍共和国 ",
      tc: "幾內亞比索",
      ja: "ギニアビサウ",
    },
    countryCode: "GW",
    areaCode: "245",
  },
  {
    countryName: { en: "Guyana", zh: "圭亚那 ", tc: "蓋亞那", ja: "ガイアナ" },
    countryCode: "GY",
    areaCode: "592",
  },
  {
    countryName: { en: "Hong Kong", zh: "中国香港 ", tc: "香港", ja: "香港" },
    countryCode: "HK",
    areaCode: "852",
  },
  {
    countryName: {
      en: "Honduras",
      zh: "洪都拉斯 ",
      tc: "宏都拉斯",
      ja: "ホンジュラス",
    },
    countryCode: "HN",
    areaCode: "504",
  },
  {
    countryName: {
      en: "Croatia",
      zh: "克罗地亚 ",
      tc: "克羅埃西亞",
      ja: "クロアチア",
    },
    countryCode: "HR",
    areaCode: "385",
  },
  {
    countryName: { en: "Haiti", zh: "海地 ", tc: "海地", ja: "ハイチ" },
    countryCode: "HT",
    areaCode: "509",
  },
  {
    countryName: {
      en: "Hungary",
      zh: "匈牙利 ",
      tc: "匈牙利",
      ja: "ハンガリー",
    },
    countryCode: "HU",
    areaCode: "36",
  },
  {
    countryName: {
      en: "Indonesia",
      zh: "印度尼西亚 ",
      tc: "印尼",
      ja: "インドネシア",
    },
    countryCode: "ID",
    areaCode: "62",
  },
  {
    countryName: {
      en: "Ireland",
      zh: "爱尔兰 ",
      tc: "愛爾蘭",
      ja: "アイルランド",
    },
    countryCode: "IE",
    areaCode: "353",
  },
  {
    countryName: {
      en: "Israel",
      zh: "以色列 ",
      tc: "以色列",
      ja: "イスラエル",
    },
    countryCode: "IL",
    areaCode: "972",
  },
  {
    countryName: { en: "India", zh: "印度 ", tc: "印度", ja: "インド" },
    countryCode: "IN",
    areaCode: "91",
  },
  {
    countryName: { en: "Iraq", zh: "伊拉克 ", tc: "伊拉克", ja: "イラク" },
    countryCode: "IQ",
    areaCode: "964",
  },
  {
    countryName: { en: "Iceland", zh: "冰岛 ", tc: "冰島", ja: "アイスランド" },
    countryCode: "IS",
    areaCode: "354",
  },
  {
    countryName: { en: "Italy", zh: "意大利 ", tc: "義大利", ja: "イタリア" },
    countryCode: "IT",
    areaCode: "39",
  },
  {
    countryName: {
      en: "Jamaica",
      zh: "牙买加 ",
      tc: "牙買加",
      ja: "ジャマイカ",
    },
    countryCode: "JM",
    areaCode: "1876",
  },
  {
    countryName: { en: "Jordan", zh: "约旦 ", tc: "約旦", ja: "ヨルダン" },
    countryCode: "JO",
    areaCode: "962",
  },
  {
    countryName: { en: "Japan", zh: "日本 ", tc: "日本", ja: "日本" },
    countryCode: "JP",
    areaCode: "81",
  },
  {
    countryName: { en: "Kenya", zh: "肯尼亚 ", tc: "肯亞", ja: "ケニア" },
    countryCode: "KE",
    areaCode: "254",
  },
  {
    countryName: {
      en: "Kyrgyzstan",
      zh: "吉尔吉斯斯坦 ",
      tc: "吉爾吉斯",
      ja: "キルギス",
    },
    countryCode: "KG",
    areaCode: "996",
  },
  {
    countryName: {
      en: "Cambodia",
      zh: "柬埔寨 ",
      tc: "柬埔寨",
      ja: "カンボジア",
    },
    countryCode: "KH",
    areaCode: "855",
  },
  {
    countryName: {
      en: "Kiribati",
      zh: "基里巴斯 ",
      tc: "基里巴斯",
      ja: "キリバス",
    },
    countryCode: "KI",
    areaCode: "686",
  },
  {
    countryName: { en: "Comoros", zh: "科摩罗 ", tc: "科摩羅", ja: "コモロ" },
    countryCode: "KM",
    areaCode: "269",
  },
  {
    countryName: {
      en: "Saint Kitts and Nevis",
      zh: "圣基茨和尼维斯 ",
      tc: "聖克里斯多福及尼維斯",
      ja: "セントクリストファー・ネイビス",
    },
    countryCode: "KN",
    areaCode: "1869",
  },
  {
    countryName: { en: "South Korea", zh: "韩国 ", tc: "韓國", ja: "韓国" },
    countryCode: "KR",
    areaCode: "82",
  },
  {
    countryName: {
      en: "Kuwait",
      zh: "科威特 ",
      tc: "科威特",
      ja: "クウェート",
    },
    countryCode: "KW",
    areaCode: "965",
  },
  {
    countryName: {
      en: "Cayman Islands",
      zh: "开曼群岛 ",
      tc: "開曼群島",
      ja: "ケイマン諸島",
    },
    countryCode: "KY",
    areaCode: "1345",
  },
  {
    countryName: {
      en: "Russia",
      zh: "哈萨克斯坦 ",
      tc: "俄羅斯",
      ja: "ロシア",
    },
    countryCode: "KZ",
    areaCode: "7",
  },
  {
    countryName: { en: "Laos", zh: "老挝 ", tc: "寮國", ja: "ラオス" },
    countryCode: "LA",
    areaCode: "856",
  },
  {
    countryName: { en: "Lebanon", zh: "黎巴嫩 ", tc: "黎巴嫩", ja: "レバノン" },
    countryCode: "LB",
    areaCode: "961",
  },
  {
    countryName: {
      en: "Saint Lucia",
      zh: "圣露西亚 ",
      tc: "聖露西亞",
      ja: "セントルシア",
    },
    countryCode: "LC",
    areaCode: "1758",
  },
  {
    countryName: {
      en: "Liechtenstein",
      zh: "列支敦士登 ",
      tc: "列支敦斯登",
      ja: "リヒテンシュタイン",
    },
    countryCode: "LI",
    areaCode: "423",
  },
  {
    countryName: {
      en: "Sri Lanka",
      zh: "斯里兰卡 ",
      tc: "斯里蘭卡",
      ja: "スリランカ",
    },
    countryCode: "LK",
    areaCode: "94",
  },
  {
    countryName: {
      en: "Liberia",
      zh: "利比里亚 ",
      tc: "賴比瑞亞",
      ja: "リベリア",
    },
    countryCode: "LR",
    areaCode: "231",
  },
  {
    countryName: { en: "Lesotho", zh: "莱索托 ", tc: "賴索托", ja: "レソト" },
    countryCode: "LS",
    areaCode: "266",
  },
  {
    countryName: {
      en: "Lithuania",
      zh: "立陶宛 ",
      tc: "立陶宛",
      ja: "リトアニア",
    },
    countryCode: "LT",
    areaCode: "370",
  },
  {
    countryName: {
      en: "Luxembourg",
      zh: "卢森堡 ",
      tc: "盧森堡",
      ja: "ルクセンブルク",
    },
    countryCode: "LU",
    areaCode: "352",
  },
  {
    countryName: {
      en: "Latvia",
      zh: "拉脱维亚 ",
      tc: "拉脫維亞",
      ja: "ラトビア",
    },
    countryCode: "LV",
    areaCode: "371",
  },
  {
    countryName: { en: "Libya", zh: "利比亚 ", tc: "利比亞", ja: "リビア" },
    countryCode: "LY",
    areaCode: "218",
  },
  {
    countryName: { en: "Morocco", zh: "摩洛哥 ", tc: "摩洛哥", ja: "モロッコ" },
    countryCode: "MA",
    areaCode: "212",
  },
  {
    countryName: { en: "Monaco", zh: "摩纳哥 ", tc: "摩納哥", ja: "モナコ" },
    countryCode: "MC",
    areaCode: "377",
  },
  {
    countryName: {
      en: "Moldova",
      zh: "摩尔多瓦 ",
      tc: "摩爾多瓦",
      ja: "モルドバ",
    },
    countryCode: "MD",
    areaCode: "373",
  },
  {
    countryName: {
      en: "Montenegro",
      zh: "黑山 ",
      tc: "蒙特內哥羅",
      ja: "モンテネグロ",
    },
    countryCode: "ME",
    areaCode: "382",
  },
  {
    countryName: {
      en: "Madagascar",
      zh: "马达加斯加 ",
      tc: "馬達加斯加",
      ja: "マダガスカル",
    },
    countryCode: "MG",
    areaCode: "261",
  },
  {
    countryName: {
      en: "Marshall Islands",
      zh: "马绍尔群岛 ",
      tc: "馬紹爾群島",
      ja: "マーシャル諸島",
    },
    countryCode: "MH",
    areaCode: "692",
  },
  {
    countryName: {
      en: "North Macedonia",
      zh: "马其顿 ",
      tc: "北馬其頓",
      ja: "北マケドニア",
    },
    countryCode: "MK",
    areaCode: "389",
  },
  {
    countryName: { en: "Mali", zh: "马里 ", tc: "馬里", ja: "マリ" },
    countryCode: "ML",
    areaCode: "223",
  },
  {
    countryName: { en: "Myanmar", zh: "缅甸 ", tc: "緬甸", ja: "ミャンマー" },
    countryCode: "MM",
    areaCode: "95",
  },
  {
    countryName: { en: "Mongolia", zh: "蒙古 ", tc: "蒙古", ja: "モンゴル" },
    countryCode: "MN",
    areaCode: "976",
  },
  {
    countryName: { en: "Macau", zh: "中国澳门 ", tc: "澳門", ja: "マカオ" },
    countryCode: "MO",
    areaCode: "853",
  },
  {
    countryName: {
      en: "Mauritania",
      zh: "毛里塔尼亚 ",
      tc: "茅利塔尼亞",
      ja: "モーリタニア",
    },
    countryCode: "MR",
    areaCode: "222",
  },
  {
    countryName: {
      en: "Montserrat",
      zh: "蒙特塞拉特岛 ",
      tc: "蒙特塞拉特",
      ja: "モントセラット",
    },
    countryCode: "MS",
    areaCode: "1664",
  },
  {
    countryName: { en: "Malta", zh: "马耳他 ", tc: "馬爾他", ja: "マルタ" },
    countryCode: "MT",
    areaCode: "356",
  },
  {
    countryName: {
      en: "Mauritius",
      zh: "毛里求斯 ",
      tc: "模里西斯",
      ja: "モーリシャス",
    },
    countryCode: "MU",
    areaCode: "230",
  },
  {
    countryName: {
      en: "Maldives",
      zh: "马尔代夫 ",
      tc: "馬爾地夫",
      ja: "モルディブ",
    },
    countryCode: "MV",
    areaCode: "960",
  },
  {
    countryName: { en: "Malawi", zh: "马拉维 ", tc: "馬拉維", ja: "マラウイ" },
    countryCode: "MW",
    areaCode: "265",
  },
  {
    countryName: { en: "Mexico", zh: "墨西哥 ", tc: "墨西哥", ja: "メキシコ" },
    countryCode: "MX",
    areaCode: "52",
  },
  {
    countryName: {
      en: "Malaysia",
      zh: "马来西亚 ",
      tc: "馬來西亞",
      ja: "マレーシア",
    },
    countryCode: "MY",
    areaCode: "60",
  },
  {
    countryName: {
      en: "Mozambique",
      zh: "莫桑比克 ",
      tc: "莫三比克",
      ja: "モザンビーク",
    },
    countryCode: "MZ",
    areaCode: "258",
  },
  {
    countryName: {
      en: "Namibia",
      zh: "纳米比亚 ",
      tc: "納米比亞",
      ja: "ナミビア",
    },
    countryCode: "NA",
    areaCode: "264",
  },
  {
    countryName: {
      en: "New Caledonia",
      zh: "新喀里多尼亚 ",
      tc: "新喀里多尼亞",
      ja: "ニューカレドニア",
    },
    countryCode: "NC",
    areaCode: "687",
  },
  {
    countryName: { en: "Niger", zh: "尼日尔 ", tc: "尼日爾", ja: "ニジェール" },
    countryCode: "NE",
    areaCode: "227",
  },
  {
    countryName: {
      en: "Nigeria",
      zh: "尼日利亚 ",
      tc: "奈及利亞",
      ja: "ナイジェリア",
    },
    countryCode: "NG",
    areaCode: "234",
  },
  {
    countryName: {
      en: "Nicaragua",
      zh: "尼加拉瓜 ",
      tc: "尼加拉瓜",
      ja: "ニカラグア",
    },
    countryCode: "NI",
    areaCode: "505",
  },
  {
    countryName: { en: "Netherlands", zh: "荷兰 ", tc: "荷蘭", ja: "オランダ" },
    countryCode: "NL",
    areaCode: "31",
  },
  {
    countryName: { en: "Norway", zh: "挪威 ", tc: "挪威", ja: "ノルウェー" },
    countryCode: "NO",
    areaCode: "47",
  },
  {
    countryName: { en: "Nepal", zh: "尼泊尔 ", tc: "尼泊爾", ja: "ネパール" },
    countryCode: "NP",
    areaCode: "977",
  },
  {
    countryName: { en: "Nauru", zh: "拿鲁岛 ", tc: "諾魯", ja: "ナウル" },
    countryCode: "NR",
    areaCode: "674",
  },
  {
    countryName: {
      en: "New Zealand",
      zh: "新西兰 ",
      tc: "紐西蘭",
      ja: "ニュージーランド",
    },
    countryCode: "NZ",
    areaCode: "64",
  },
  {
    countryName: { en: "Oman", zh: "阿曼 ", tc: "阿曼", ja: "オマーン" },
    countryCode: "OM",
    areaCode: "968",
  },
  {
    countryName: { en: "Panama", zh: "巴拿马 ", tc: "巴拿馬", ja: "パナマ" },
    countryCode: "PA",
    areaCode: "507",
  },
  {
    countryName: { en: "Peru", zh: "秘鲁 ", tc: "秘魯", ja: "ペルー" },
    countryCode: "PE",
    areaCode: "51",
  },
  {
    countryName: {
      en: "French Polynesia",
      zh: "法属波利尼西亚 ",
      tc: "法屬玻里尼西亞",
      ja: "フランス領ポリネシア",
    },
    countryCode: "PF",
    areaCode: "689",
  },
  {
    countryName: {
      en: "Papua New Guinea",
      zh: "巴布亚新几内亚 ",
      tc: "巴布亞新幾內亞",
      ja: "パプアニューギニア",
    },
    countryCode: "PG",
    areaCode: "675",
  },
  {
    countryName: {
      en: "Philippines",
      zh: "菲律宾 ",
      tc: "菲律賓",
      ja: "フィリピン",
    },
    countryCode: "PH",
    areaCode: "63",
  },
  {
    countryName: {
      en: "Pakistan",
      zh: "巴基斯坦 ",
      tc: "巴基斯坦",
      ja: "パキスタン",
    },
    countryCode: "PK",
    areaCode: "92",
  },
  {
    countryName: { en: "Poland", zh: "波兰 ", tc: "波蘭", ja: "ポーランド" },
    countryCode: "PL",
    areaCode: "48",
  },
  {
    countryName: {
      en: "Saint Pierre and Miquelon",
      zh: "圣彼埃尔和密克隆岛 ",
      tc: "聖皮埃爾和密克隆群島",
      ja: "サンピエール島・ミクロン島",
    },
    countryCode: "PM",
    areaCode: "508",
  },
  {
    countryName: {
      en: "Puerto Rico",
      zh: "波多黎各 ",
      tc: "波多黎各",
      ja: "プエルトリコ",
    },
    countryCode: "PR",
    areaCode: "1787",
  },
  {
    countryName: {
      en: "Portugal",
      zh: "葡萄牙 ",
      tc: "葡萄牙",
      ja: "ポルトガル",
    },
    countryCode: "PT",
    areaCode: "351",
  },
  {
    countryName: { en: "Palau", zh: "帕劳 ", tc: "帛琉", ja: "パラオ" },
    countryCode: "PW",
    areaCode: "680",
  },
  {
    countryName: {
      en: "Paraguay",
      zh: "巴拉圭 ",
      tc: "巴拉圭",
      ja: "パラグアイ",
    },
    countryCode: "PY",
    areaCode: "595",
  },
  {
    countryName: { en: "Qatar", zh: "卡塔尔 ", tc: "卡達", ja: "カタール" },
    countryCode: "QA",
    areaCode: "974",
  },
  {
    countryName: {
      en: "Réunion",
      zh: "留尼汪 ",
      tc: "留尼旺",
      ja: "レユニオン",
    },
    countryCode: "RE",
    areaCode: "262",
  },
  {
    countryName: {
      en: "Romania",
      zh: "罗马尼亚 ",
      tc: "羅馬尼亞",
      ja: "ルーマニア",
    },
    countryCode: "RO",
    areaCode: "40",
  },
  {
    countryName: {
      en: "Serbia",
      zh: "塞尔维亚 ",
      tc: "塞爾維亞",
      ja: "セルビア",
    },
    countryCode: "RS",
    areaCode: "381",
  },
  {
    countryName: { en: "Rwanda", zh: "卢旺达 ", tc: "盧安達", ja: "ルワンダ" },
    countryCode: "RW",
    areaCode: "250",
  },
  {
    countryName: {
      en: "Saudi Arabia",
      zh: "沙特阿拉伯 ",
      tc: "沙烏地阿拉伯",
      ja: "サウジアラビア",
    },
    countryCode: "SA",
    areaCode: "966",
  },
  {
    countryName: {
      en: "Solomon Islands",
      zh: "所罗门群岛 ",
      tc: "索羅門群島",
      ja: "ソロモン諸島",
    },
    countryCode: "SB",
    areaCode: "677",
  },
  {
    countryName: {
      en: "Seychelles",
      zh: "塞舌尔 ",
      tc: "塞席爾",
      ja: "セーシェル",
    },
    countryCode: "SC",
    areaCode: "248",
  },
  {
    countryName: { en: "Sudan", zh: "苏丹 ", tc: "蘇丹", ja: "スーダン" },
    countryCode: "SD",
    areaCode: "249",
  },
  {
    countryName: { en: "Sweden", zh: "瑞典 ", tc: "瑞典", ja: "スウェーデン" },
    countryCode: "SE",
    areaCode: "46",
  },
  {
    countryName: {
      en: "Singapore",
      zh: "新加坡 ",
      tc: "新加坡",
      ja: "シンガポール",
    },
    countryCode: "SG",
    areaCode: "65",
  },
  {
    countryName: {
      en: "Slovenia",
      zh: "斯洛文尼亚 ",
      tc: "斯洛維尼亞",
      ja: "スロベニア",
    },
    countryCode: "SI",
    areaCode: "386",
  },
  {
    countryName: {
      en: "Slovakia",
      zh: "斯洛伐克 ",
      tc: "斯洛伐克",
      ja: "スロバキア",
    },
    countryCode: "SK",
    areaCode: "421",
  },
  {
    countryName: {
      en: "Sierra Leone",
      zh: "塞拉利昂 ",
      tc: "獅子山",
      ja: "シエラレオネ",
    },
    countryCode: "SL",
    areaCode: "232",
  },
  {
    countryName: {
      en: "San Marino",
      zh: "圣马力诺 ",
      tc: "聖馬利諾",
      ja: "サンマリノ",
    },
    countryCode: "SM",
    areaCode: "378",
  },
  {
    countryName: {
      en: "Senegal",
      zh: "塞内加尔 ",
      tc: "塞內加爾",
      ja: "セネガル",
    },
    countryCode: "SN",
    areaCode: "221",
  },
  {
    countryName: {
      en: "Somalia",
      zh: "索马里 ",
      tc: "索馬利亞",
      ja: "ソマリア",
    },
    countryCode: "SO",
    areaCode: "252",
  },
  {
    countryName: {
      en: "Suriname",
      zh: "苏里南 ",
      tc: "蘇利南",
      ja: "スリナム",
    },
    countryCode: "SR",
    areaCode: "597",
  },
  {
    countryName: {
      en: "São Tomé and Príncipe",
      zh: "圣多美和普林西比 ",
      tc: "聖多美和普林西比",
      ja: "サントメ・プリンシペ",
    },
    countryCode: "ST",
    areaCode: "239",
  },
  {
    countryName: {
      en: "El Salvador",
      zh: "萨尔瓦多 ",
      tc: "薩爾瓦多",
      ja: "エルサルバドル",
    },
    countryCode: "SV",
    areaCode: "503",
  },
  {
    countryName: {
      en: "Eswatini",
      zh: "斯威士兰 ",
      tc: "斯威士蘭",
      ja: "エスワティニ",
    },
    countryCode: "SZ",
    areaCode: "268",
  },
  {
    countryName: {
      en: "Turks and Caicos Islands",
      zh: "特克斯和凯科斯群岛 ",
      tc: "特克斯和凱科斯群島",
      ja: "タークス・カイコス諸島",
    },
    countryCode: "TC",
    areaCode: "1649",
  },
  {
    countryName: { en: "Chad", zh: "乍得 ", tc: "查德", ja: "チャド" },
    countryCode: "TD",
    areaCode: "235",
  },
  {
    countryName: { en: "Togo", zh: "多哥 ", tc: "多哥", ja: "トーゴ" },
    countryCode: "TG",
    areaCode: "228",
  },
  {
    countryName: { en: "Thailand", zh: "泰国 ", tc: "泰國", ja: "タイ" },
    countryCode: "TH",
    areaCode: "66",
  },
  {
    countryName: {
      en: "Tajikistan",
      zh: "塔吉克斯坦 ",
      tc: "塔吉克斯坦",
      ja: "タジキスタン",
    },
    countryCode: "TJ",
    areaCode: "992",
  },
  {
    countryName: {
      en: "Timor-Leste",
      zh: "东帝汶 ",
      tc: "東帝汶",
      ja: "東ティモール",
    },
    countryCode: "TL",
    areaCode: "670",
  },
  {
    countryName: {
      en: "Turkmenistan",
      zh: "土库曼斯坦 ",
      tc: "土庫曼斯坦",
      ja: "トルクメニスタン",
    },
    countryCode: "TM",
    areaCode: "993",
  },
  {
    countryName: {
      en: "Tunisia",
      zh: "突尼斯 ",
      tc: "突尼西亞",
      ja: "チュニジア",
    },
    countryCode: "TN",
    areaCode: "216",
  },
  {
    countryName: { en: "Tonga", zh: "汤加 ", tc: "湯加", ja: "トンガ" },
    countryCode: "TO",
    areaCode: "676",
  },
  {
    countryName: { en: "Turkey", zh: "土耳其 ", tc: "土耳其", ja: "トルコ" },
    countryCode: "TR",
    areaCode: "90",
  },
  {
    countryName: {
      en: "Trinidad and Tobago",
      zh: "特立尼达和多巴哥 ",
      tc: "千里達及托巴哥",
      ja: "トリニダード・トバゴ",
    },
    countryCode: "TT",
    areaCode: "1868",
  },
  {
    countryName: { en: "Taiwan", zh: "中国台湾 ", tc: "臺灣", ja: "台湾" },
    countryCode: "TW",
    areaCode: "886",
  },
  {
    countryName: {
      en: "Tanzania",
      zh: "坦桑尼亚 ",
      tc: "坦桑尼亞",
      ja: "タンザニア",
    },
    countryCode: "TZ",
    areaCode: "255",
  },
  {
    countryName: { en: "Uganda", zh: "乌干达 ", tc: "烏干達", ja: "ウガンダ" },
    countryCode: "UG",
    areaCode: "256",
  },
  {
    countryName: {
      en: "United States/Canada",
      zh: "美国/加拿大 ",
      tc: "美國/加拿大",
      ja: "アメリカ/カナダ",
    },
    countryCode: "US",
    areaCode: "1",
  },
  {
    countryName: {
      en: "Uruguay",
      zh: "乌拉圭 ",
      tc: "烏拉圭",
      ja: "ウルグアイ",
    },
    countryCode: "UY",
    areaCode: "598",
  },
  {
    countryName: {
      en: "Uzbekistan",
      zh: "乌兹别克斯坦 ",
      tc: "烏茲別克斯坦",
      ja: "ウズベキスタン",
    },
    countryCode: "UZ",
    areaCode: "998",
  },
  {
    countryName: {
      en: "Saint Vincent and the Grenadines",
      zh: "圣文森特和格林纳丁斯 ",
      tc: "聖文森及格瑞那丁",
      ja: "セントビンセントおよびグレナディーン諸島",
    },
    countryCode: "VC",
    areaCode: "1784",
  },
  {
    countryName: {
      en: "Venezuela",
      zh: "委内瑞拉 ",
      tc: "委內瑞拉",
      ja: "ベネズエラ",
    },
    countryCode: "VE",
    areaCode: "58",
  },
  {
    countryName: {
      en: "British Virgin Islands",
      zh: "英属处女群岛 ",
      tc: "英屬維京群島",
      ja: "イギリス領ヴァージン諸島",
    },
    countryCode: "VG",
    areaCode: "1284",
  },
  {
    countryName: { en: "Vietnam", zh: "越南 ", tc: "越南", ja: "ベトナム" },
    countryCode: "VN",
    areaCode: "84",
  },
  {
    countryName: {
      en: "Vanuatu",
      zh: "瓦努阿图 ",
      tc: "萬那杜",
      ja: "バヌアツ",
    },
    countryCode: "VU",
    areaCode: "678",
  },
  {
    countryName: { en: "Samoa", zh: "萨摩亚 ", tc: "薩摩亞", ja: "サモア" },
    countryCode: "WS",
    areaCode: "685",
  },
  {
    countryName: { en: "Yemen", zh: "也门 ", tc: "葉門", ja: "イエメン" },
    countryCode: "YE",
    areaCode: "967",
  },
  {
    countryName: {
      en: "Mayotte",
      zh: "马约特 ",
      tc: "馬約特島",
      ja: "マヨット",
    },
    countryCode: "YT",
    areaCode: "269",
  },
  {
    countryName: {
      en: "South Africa",
      zh: "南非 ",
      tc: "南非",
      ja: "南アフリカ",
    },
    countryCode: "ZA",
    areaCode: "27",
  },
  {
    countryName: { en: "Zambia", zh: "赞比亚 ", tc: "尚比亞", ja: "ザンビア" },
    countryCode: "ZM",
    areaCode: "260",
  },
  {
    countryName: {
      en: "Zimbabwe",
      zh: "津巴布韦 ",
      tc: "辛巴威",
      ja: "ジンバブエ",
    },
    countryCode: "ZW",
    areaCode: "263",
  },
  {
    countryName: {
      en: "Kosovo",
      zh: "科索沃共和国 ",
      tc: "科索沃",
      ja: "コソボ",
    },
    countryCode: "XK",
    areaCode: "383",
  },
  {
    countryName: {
      en: "U.S. Virgin Islands",
      zh: "美属维尔京群岛 ",
      tc: "美屬維京群島",
      ja: "アメリカ領ヴァージン諸島",
    },
    countryCode: "VI",
    areaCode: "1340",
  },
  {
    countryName: {
      en: "Sint Maarten",
      zh: "荷属圣马丁 ",
      tc: "聖馬丁島",
      ja: "シント・マールテン",
    },
    countryCode: "SX",
    areaCode: "1721",
  },
  {
    countryName: {
      en: "South Sudan",
      zh: "南苏丹 ",
      tc: "南蘇丹",
      ja: "南スーダン",
    },
    countryCode: "SS",
    areaCode: "211",
  },
  {
    countryName: {
      en: "Palestine",
      zh: "巴勒斯坦 ",
      tc: "巴勒斯坦",
      ja: "パレスチナ",
    },
    countryCode: "PS",
    areaCode: "970",
  },
  {
    countryName: {
      en: "Martinique",
      zh: "马丁尼克 ",
      tc: "馬提尼克",
      ja: "マルティニーク",
    },
    countryCode: "MQ",
    areaCode: "596",
  },
  {
    countryName: {
      en: "Northern Mariana Islands",
      zh: "北马利安纳群岛 ",
      tc: "北馬利安納群島",
      ja: "北マリアナ諸島",
    },
    countryCode: "MP",
    areaCode: "1670",
  },
  {
    countryName: {
      en: "Western Sahara",
      zh: "西撒哈拉 ",
      tc: "西撒哈拉",
      ja: "西サハラ",
    },
    countryCode: "EH",
    areaCode: "212",
  },
  {
    countryName: {
      en: "Bonaire",
      zh: "荷属安的列斯 ",
      tc: "波奈爾島",
      ja: "ボネール",
    },
    countryCode: "AN",
    areaCode: "599",
  },
  {
    countryName: {
      en: "Ascension Island",
      zh: "阿森松岛 ",
      tc: "阿森松島",
      ja: "アセンション島",
    },
    countryCode: "AC",
    areaCode: "247",
  },
];

export default countries;