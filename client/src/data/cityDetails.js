// 城市详情数据库
// 包含主要城市的简介、人口、景点、图片等信息

const CITY_DETAILS = {
  // 中国
  '北京': {
    description: '中国首都，政治、文化中心，拥有3000多年建城史。',
    population: '2189万',
    attractions: ['故宫', '长城', '天坛', '颐和园', '天安门'],
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=300',
    timezone: 'UTC+8'
  },
  '上海': {
    description: '中国最大的经济中心，国际化大都市。',
    population: '2489万',
    attractions: ['外滩', '东方明珠', '豫园', '南京路', '迪士尼'],
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b18f120?w=300',
    timezone: 'UTC+8'
  },
  '广州': {
    description: '广东省会，南方最大的城市之一，美食之都。',
    population: '1881万',
    attractions: ['广州塔', '白云山', '陈家祠', '沙面', '长隆'],
    image: 'https://images.unsplash.com/photo-1583996046891-a83c8a947780?w=300',
    timezone: 'UTC+8'
  },
  '深圳': {
    description: '中国改革开放的窗口，科技创新中心。',
    population: '1768万',
    attractions: ['世界之窗', '欢乐谷', '大梅沙', '华强北', '平安大厦'],
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300',
    timezone: 'UTC+8'
  },
  '成都': {
    description: '四川省会，天府之国，大熊猫的故乡。',
    population: '2119万',
    attractions: ['大熊猫基地', '宽窄巷子', '武侯祠', '锦里', '都江堰'],
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300',
    timezone: 'UTC+8'
  },
  '杭州': {
    description: '浙江省会，人间天堂，西湖所在地。',
    population: '1237万',
    attractions: ['西湖', '灵隐寺', '千岛湖', '宋城', '龙井茶园'],
    image: 'https://images.unsplash.com/photo-1567240299810-426e0bdf4c4e?w=300',
    timezone: 'UTC+8'
  },
  '西安': {
    description: '十三朝古都，丝绸之路起点，兵马俑所在地。',
    population: '1316万',
    attractions: ['兵马俑', '大雁塔', '城墙', '回民街', '华清池'],
    image: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=300',
    timezone: 'UTC+8'
  },
  '重庆': {
    description: '山城、雾都，火锅之都，8D魔幻城市。',
    population: '3212万',
    attractions: ['洪崖洞', '解放碑', '磁器口', '长江索道', '武隆天坑'],
    image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300',
    timezone: 'UTC+8'
  },
  '昆明': {
    description: '云南省会，春城，四季如春。',
    population: '846万',
    attractions: ['滇池', '石林', '翠湖', '西山', '民族村'],
    image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=300',
    timezone: 'UTC+8'
  },
  '拉萨': {
    description: '西藏首府，日光城，藏传佛教圣地。',
    population: '87万',
    attractions: ['布达拉宫', '大昭寺', '八廓街', '纳木错', '罗布林卡'],
    image: 'https://images.unsplash.com/photo-1569411032431-07598b0012c2?w=300',
    timezone: 'UTC+8'
  },
  
  // 亚洲
  '东京': {
    description: '日本首都，全球最大的都市圈，传统与现代交融。',
    population: '1396万',
    attractions: ['浅草寺', '东京塔', '涩谷', '新宿', '秋叶原'],
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300',
    timezone: 'UTC+9'
  },
  '大阪': {
    description: '日本第二大城市，美食之都，热情奔放。',
    population: '275万',
    attractions: ['大阪城', '道顿堀', '环球影城', '心斋桥', '通天阁'],
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=300',
    timezone: 'UTC+9'
  },
  '首尔': {
    description: '韩国首都，K-POP发源地，购物天堂。',
    population: '978万',
    attractions: ['景福宫', '明洞', '南山塔', '北村韩屋', '弘大'],
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=300',
    timezone: 'UTC+9'
  },
  '曼谷': {
    description: '泰国首都，天使之城，佛教圣地。',
    population: '1053万',
    attractions: ['大皇宫', '卧佛寺', '考山路', '暹罗广场', '水上市场'],
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300',
    timezone: 'UTC+7'
  },
  '新加坡': {
    description: '花园城市，多元文化交汇的国际都会。',
    population: '545万',
    attractions: ['滨海湾金沙', '鱼尾狮', '圣淘沙', '牛车水', '小印度'],
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300',
    timezone: 'UTC+8'
  },
  '迪拜': {
    description: '阿联酋城市，奢华之都，未来之城。',
    population: '340万',
    attractions: ['哈利法塔', '帆船酒店', '棕榈岛', '迪拜商场', '沙漠冲沙'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300',
    timezone: 'UTC+4'
  },
  
  // 欧洲
  '巴黎': {
    description: '法国首都，浪漫之都，艺术之都。',
    population: '216万',
    attractions: ['埃菲尔铁塔', '卢浮宫', '凯旋门', '凡尔赛宫', '巴黎圣母院'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300',
    timezone: 'UTC+1'
  },
  '伦敦': {
    description: '英国首都，全球金融中心，历史文化名城。',
    population: '898万',
    attractions: ['大本钟', '白金汉宫', '大英博物馆', '伦敦眼', '塔桥'],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300',
    timezone: 'UTC+0'
  },
  '罗马': {
    description: '意大利首都，永恒之城，古罗马帝国中心。',
    population: '287万',
    attractions: ['斗兽场', '许愿池', '梵蒂冈', '万神殿', '西班牙广场'],
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300',
    timezone: 'UTC+1'
  },
  '柏林': {
    description: '德国首都，历史与现代交融的文化之都。',
    population: '364万',
    attractions: ['勃兰登堡门', '柏林墙', '博物馆岛', '国会大厦', '波茨坦广场'],
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=300',
    timezone: 'UTC+1'
  },
  '巴塞罗那': {
    description: '西班牙第二大城市，高迪建筑艺术之城。',
    population: '162万',
    attractions: ['圣家堂', '米拉之家', '古埃尔公园', '兰布拉大道', '诺坎普球场'],
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300',
    timezone: 'UTC+1'
  },
  '阿姆斯特丹': {
    description: '荷兰首都，运河之城，开放包容。',
    population: '87万',
    attractions: ['梵高博物馆', '安妮之家', '运河游船', '红灯区', '库肯霍夫公园'],
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300',
    timezone: 'UTC+1'
  },
  '维也纳': {
    description: '奥地利首都，音乐之都，帝国之城。',
    population: '190万',
    attractions: ['美泉宫', '圣斯特凡大教堂', '国家歌剧院', '霍夫堡宫', '艺术史博物馆'],
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=300',
    timezone: 'UTC+1'
  },
  '布拉格': {
    description: '捷克首都，千塔之城，童话般的中世纪城市。',
    population: '131万',
    attractions: ['查理大桥', '布拉格城堡', '老城广场', '天文钟', '圣维特大教堂'],
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=300',
    timezone: 'UTC+1'
  },
  '雅典': {
    description: '希腊首都，西方文明的摇篮。',
    population: '380万',
    attractions: ['帕特农神庙', '卫城', '宪法广场', '普拉卡区', '国家考古博物馆'],
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=300',
    timezone: 'UTC+2'
  },
  
  // 北美洲
  '纽约': {
    description: '美国第一大城市，世界之都，不夜城。',
    population: '834万',
    attractions: ['自由女神像', '时代广场', '中央公园', '帝国大厦', '大都会博物馆'],
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300',
    timezone: 'UTC-5'
  },
  '洛杉矶': {
    description: '美国第二大城市，天使之城，好莱坞所在地。',
    population: '398万',
    attractions: ['好莱坞', '环球影城', '迪士尼', '圣莫尼卡海滩', '比弗利山庄'],
    image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=300',
    timezone: 'UTC-8'
  },
  '旧金山': {
    description: '美国西海岸城市，金门大桥所在地。',
    population: '87万',
    attractions: ['金门大桥', '渔人码头', '九曲花街', '恶魔岛', '唐人街'],
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300',
    timezone: 'UTC-8'
  },
  '芝加哥': {
    description: '美国第三大城市，风城，摩天大楼发源地。',
    population: '270万',
    attractions: ['云门', '千禧公园', '威利斯大厦', '密歇根大道', '艺术博物馆'],
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=300',
    timezone: 'UTC-6'
  },
  '拉斯维加斯': {
    description: '美国内华达州城市，世界娱乐之都。',
    population: '65万',
    attractions: ['拉斯维加斯大道', '百乐宫喷泉', '大峡谷', '胡佛水坝', '凯撒宫'],
    image: 'https://images.unsplash.com/photo-1605833556210-a2e65a1aefc7?w=300',
    timezone: 'UTC-8'
  },
  '华盛顿': {
    description: '美国首都，政治中心。',
    population: '71万',
    attractions: ['白宫', '国会大厦', '林肯纪念堂', '华盛顿纪念碑', '史密森尼博物馆'],
    image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=300',
    timezone: 'UTC-5'
  },
  '迈阿密': {
    description: '美国佛罗里达州城市，阳光之州。',
    population: '47万',
    attractions: ['南海滩', '小哈瓦那', '大沼泽地', '温伍德墙', '维兹卡亚博物馆'],
    image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=300',
    timezone: 'UTC-5'
  },
  '多伦多': {
    description: '加拿大第一大城市，多元文化之都。',
    population: '293万',
    attractions: ['CN塔', '尼亚加拉瀑布', '卡萨罗马城堡', '皇家安大略博物馆', '多伦多群岛'],
    image: 'https://images.unsplash.com/photo-1517090504332-c60ed64a4fdc?w=300',
    timezone: 'UTC-5'
  },
  '温哥华': {
    description: '加拿大西海岸城市，宜居之城。',
    population: '63万',
    attractions: ['斯坦利公园', '卡皮拉诺吊桥', '格兰维尔岛', '煤气镇', '伊丽莎白女王公园'],
    image: 'https://images.unsplash.com/photo-1559511260-66a68e7f3764?w=300',
    timezone: 'UTC-8'
  },
  '墨西哥城': {
    description: '墨西哥首都，美洲最古老的城市之一。',
    population: '920万',
    attractions: ['宪法广场', '国家宫殿', '特奥蒂瓦坎金字塔', '查普尔特佩克公园', '弗里达博物馆'],
    image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=300',
    timezone: 'UTC-6'
  },
  
  // 南美洲
  '里约热内卢': {
    description: '巴西第二大城市，狂欢节之城。',
    population: '675万',
    attractions: ['基督山', '科帕卡巴纳海滩', '面包山', '马拉卡纳球场', '蒂茹卡国家公园'],
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300',
    timezone: 'UTC-3'
  },
  '圣保罗': {
    description: '巴西最大城市，南美洲金融中心。',
    population: '1233万',
    attractions: ['保利斯塔大道', '伊比拉普埃拉公园', '圣保罗大教堂', '自由区', '东方街'],
    image: 'https://images.unsplash.com/photo-1548585744-3ef1e12e484e?w=300',
    timezone: 'UTC-3'
  },
  '布宜诺斯艾利斯': {
    description: '阿根廷首都，南美巴黎，探戈发源地。',
    population: '306万',
    attractions: ['五月广场', '博卡区', '雷科莱塔公墓', '雅典人书店', '圣特尔莫区'],
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=300',
    timezone: 'UTC-3'
  },
  '利马': {
    description: '秘鲁首都，美食之都。',
    population: '975万',
    attractions: ['武器广场', '米拉弗洛雷斯', '利马大教堂', '黄金博物馆', '帕拉卡斯'],
    image: 'https://images.unsplash.com/photo-1531968455001-5c5272a67c71?w=300',
    timezone: 'UTC-5'
  },
  
  // 大洋洲
  '悉尼': {
    description: '澳大利亚最大城市，海港之城。',
    population: '531万',
    attractions: ['悉尼歌剧院', '海港大桥', '邦迪海滩', '蓝山', '达令港'],
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=300',
    timezone: 'UTC+10'
  },
  '墨尔本': {
    description: '澳大利亚第二大城市，文化之都。',
    population: '508万',
    attractions: ['联邦广场', '大洋路', '皇家植物园', '涂鸦巷', '菲利普岛'],
    image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=300',
    timezone: 'UTC+10'
  },
  '奥克兰': {
    description: '新西兰最大城市，帆船之都。',
    population: '165万',
    attractions: ['天空塔', '怀赫科岛', '伊甸山', '奥克兰博物馆', '使命湾'],
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=300',
    timezone: 'UTC+12'
  },
  
  // 非洲
  '开罗': {
    description: '埃及首都，金字塔所在地。',
    population: '1010万',
    attractions: ['吉萨金字塔', '狮身人面像', '埃及博物馆', '哈利利市场', '萨拉丁城堡'],
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=300',
    timezone: 'UTC+2'
  },
  '开普敦': {
    description: '南非立法首都，母亲城。',
    population: '460万',
    attractions: ['桌山', '好望角', '企鹅海滩', '罗本岛', '维多利亚港'],
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300',
    timezone: 'UTC+2'
  },
  '内罗毕': {
    description: '肯尼亚首都，东非门户。',
    population: '473万',
    attractions: ['内罗毕国家公园', '长颈鹿中心', '凯伦博物馆', '马赛市场', '安博塞利'],
    image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300',
    timezone: 'UTC+3'
  },
  '马拉喀什': {
    description: '摩洛哥南部城市，红城。',
    population: '93万',
    attractions: ['德吉玛广场', '巴希亚宫', '马约尔花园', '库图比亚清真寺', '撒哈拉沙漠'],
    image: 'https://images.unsplash.com/photo-1597212618440-806e22e73e97?w=300',
    timezone: 'UTC+0'
  }
};

// 获取城市详情
export function getCityDetails(cityName) {
  return CITY_DETAILS[cityName] || null;
}

// 检查城市是否有详情
export function hasCityDetails(cityName) {
  return cityName in CITY_DETAILS;
}

export default CITY_DETAILS;
