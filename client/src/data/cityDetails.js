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
  },
  
  // ==================== 更多中国城市 ====================
  '武汉': {
    description: '湖北省会，九省通衢，长江中游重要城市。',
    population: '1232万',
    attractions: ['黄鹤楼', '东湖', '武汉大学', '户部巷', '长江大桥'],
    timezone: 'UTC+8'
  },
  '南京': {
    description: '江苏省会，六朝古都，历史文化名城。',
    population: '942万',
    attractions: ['中山陵', '夫子庙', '明孝陵', '玄武湖', '总统府'],
    timezone: 'UTC+8'
  },
  '天津': {
    description: '中国四大直辖市之一，北方重要港口城市。',
    population: '1387万',
    attractions: ['天津之眼', '五大道', '意式风情街', '瓷房子', '古文化街'],
    timezone: 'UTC+8'
  },
  '重庆': {
    description: '山城、雾都，火锅之都，8D魔幻城市。',
    population: '3212万',
    attractions: ['洪崖洞', '解放碑', '磁器口', '长江索道', '武隆天坑'],
    timezone: 'UTC+8'
  },
  '苏州': {
    description: '江南水乡，园林之城，上有天堂下有苏杭。',
    population: '1274万',
    attractions: ['拙政园', '虎丘', '周庄', '同里', '金鸡湖'],
    timezone: 'UTC+8'
  },
  '厦门': {
    description: '海上花园，文艺之城，鼓浪屿所在地。',
    population: '516万',
    attractions: ['鼓浪屿', '南普陀寺', '曾厝垵', '环岛路', '厦门大学'],
    timezone: 'UTC+8'
  },
  '青岛': {
    description: '海滨城市，啤酒之城，帆船之都。',
    population: '1007万',
    attractions: ['栈桥', '八大关', '崂山', '青岛啤酒博物馆', '金沙滩'],
    timezone: 'UTC+8'
  },
  '大连': {
    description: '北方明珠，浪漫之都，海滨城市。',
    population: '745万',
    attractions: ['星海广场', '老虎滩', '金石滩', '发现王国', '俄罗斯风情街'],
    timezone: 'UTC+8'
  },
  '哈尔滨': {
    description: '冰城，东方莫斯科，冰雪大世界。',
    population: '988万',
    attractions: ['冰雪大世界', '中央大街', '圣索菲亚教堂', '太阳岛', '松花江'],
    timezone: 'UTC+8'
  },
  '长沙': {
    description: '湖南省会，娱乐之都，美食之城。',
    population: '1005万',
    attractions: ['岳麓山', '橘子洲', '太平街', '湖南省博物馆', '世界之窗'],
    timezone: 'UTC+8'
  },
  '昆明': {
    description: '云南省会，春城，四季如春。',
    population: '846万',
    attractions: ['滇池', '石林', '翠湖', '西山', '民族村'],
    timezone: 'UTC+8'
  },
  '大理': {
    description: '风花雪月，苍山洱海，文艺圣地。',
    population: '361万',
    attractions: ['苍山', '洱海', '大理古城', '双廊', '崇圣寺三塔'],
    timezone: 'UTC+8'
  },
  '丽江': {
    description: '古城之都，纳西族文化，玉龙雪山。',
    population: '125万',
    attractions: ['丽江古城', '玉龙雪山', '束河古镇', '泸沽湖', '蓝月谷'],
    timezone: 'UTC+8'
  },
  '拉萨': {
    description: '西藏首府，日光城，藏传佛教圣地。',
    population: '87万',
    attractions: ['布达拉宫', '大昭寺', '八廓街', '纳木错', '罗布林卡'],
    timezone: 'UTC+8'
  },
  '乌鲁木齐': {
    description: '新疆首府，亚心之都，多民族聚居。',
    population: '405万',
    attractions: ['天山天池', '国际大巴扎', '红山公园', '南山牧场', '新疆博物馆'],
    timezone: 'UTC+8'
  },
  '呼和浩特': {
    description: '内蒙古首府，青色的城，草原之城。',
    population: '344万',
    attractions: ['大召寺', '内蒙古博物院', '昭君墓', '哈素海', '草原'],
    timezone: 'UTC+8'
  },
  '银川': {
    description: '宁夏首塞上江南，西夏文化。',
    population: '285万',
    attractions: ['西夏王陵', '沙湖', '镇北堡影视城', '贺兰山', '水洞沟'],
    timezone: 'UTC+8'
  },
  '西宁': {
    description: '青海省会，高原古城，夏都。',
    population: '247万',
    attractions: ['塔尔寺', '青海湖', '东关清真大寺', '北禅寺', '日月山'],
    timezone: 'UTC+8'
  },
  '兰州': {
    description: '甘肃省会，黄河之城，牛肉面之乡。',
    population: '435万',
    attractions: ['黄河铁桥', '白塔山', '甘肃省博物馆', '五泉山', '黄河母亲雕塑'],
    timezone: 'UTC+8'
  },
  '贵阳': {
    description: '贵州省会，林城，避暑之都。',
    population: '598万',
    attractions: ['黄果树瀑布', '青岩古镇', '甲秀楼', '黔灵山公园', '花溪公园'],
    timezone: 'UTC+8'
  },
  '南宁': {
    description: '广西首府，绿城，东盟博览会举办地。',
    population: '874万',
    attractions: ['青秀山', '南宁动物园', '大明山', '扬美古镇', '民歌湖'],
    timezone: 'UTC+8'
  },
  '海口': {
    description: '海南省会，椰城，热带海滨城市。',
    population: '287万',
    attractions: ['假日海滩', '骑楼老街', '火山口公园', '万绿园', '五公祠'],
    timezone: 'UTC+8'
  },
  '三亚': {
    description: '热带滨海旅游城市，东方夏威夷。',
    population: '103万',
    attractions: ['亚龙湾', '天涯海角', '南山寺', '蜈支洲岛', '大东海'],
    timezone: 'UTC+8'
  },
  
  // ==================== 更多亚洲城市 ====================
  '京都': {
    description: '日本古都，千年之城，寺庙之城。',
    population: '147万',
    attractions: ['金阁寺', '清水寺', '伏见稻荷大社', '岚山', '二条城'],
    timezone: 'UTC+9'
  },
  '奈良': {
    description: '日本古都，鹿之城，世界遗产之城。',
    population: '36万',
    attractions: ['奈良公园', '东大寺', '春日大社', '若草山', '奈良町'],
    timezone: 'UTC+9'
  },
  '北海道': {
    description: '日本最北岛屿，雪国，薰衣草之地。',
    population: '538万',
    attractions: ['富良野', '小樽运河', '函馆山', '旭川动物园', '洞爷湖'],
    timezone: 'UTC+9'
  },
  '济州': {
    description: '韩国度假胜地，蜜月之岛，火山岛。',
    population: '67万',
    attractions: ['汉拿山', '城山日出峰', '泰迪熊博物馆', '龙头岩', '济州民俗村'],
    timezone: 'UTC+9'
  },
  '巴厘岛': {
    description: '印尼度假胜地，众神之岛，文化之岛。',
    population: '430万',
    attractions: ['海神庙', '乌布皇宫', '库塔海滩', '德格拉朗梯田', '金巴兰海滩'],
    timezone: 'UTC+8'
  },
  '清迈': {
    description: '泰国北部城市，玫瑰之城，寺庙之城。',
    population: '131万',
    attractions: ['双龙寺', '契迪龙寺', '周日夜市', '素贴山', '清迈古城'],
    timezone: 'UTC+7'
  },
  '普吉岛': {
    description: '泰国最大岛屿，安达曼海明珠。',
    population: '40万',
    attractions: ['芭东海滩', '皮皮岛', '幻多奇乐园', '大佛寺', '攀牙湾'],
    timezone: 'UTC+7'
  },
  '暹粒': {
    description: '柬埔寨城市，吴哥窟所在地。',
    population: '25万',
    attractions: ['吴哥窟', '吴哥通王城', '巴戎寺', '塔布隆寺', '女王宫'],
    timezone: 'UTC+7'
  },
  '河内': {
    description: '越南首都，千年之城，还剑湖之城。',
    population: '805万',
    attractions: ['还剑湖', '胡志明纪念堂', '文庙', '河内古街', '西湖'],
    timezone: 'UTC+7'
  },
  '胡志明市': {
    description: '越南最大城市，东方明珠。',
    population: '900万',
    attractions: ['红教堂', '统一宫', '战争遗迹博物馆', '范五老街', '古芝地道'],
    timezone: 'UTC+7'
  },
  '雅加达': {
    description: '印尼首都，东南亚最大城市。',
    population: '1056万',
    attractions: ['独立广场', '伊斯蒂克拉尔清真寺', '安佐尔梦幻公园', '雅加达老城', '千岛群岛'],
    timezone: 'UTC+7'
  },
  '吉隆坡': {
    description: '马来西亚首都，多元文化之城。',
    population: '180万',
    attractions: ['双子塔', '黑风洞', '独立广场', '阿罗街', '中央市场'],
    timezone: 'UTC+8'
  },
  '科伦坡': {
    description: '斯里兰卡首都，印度洋明珠。',
    population: '75万',
    attractions: ['科伦坡博物馆', '独立广场', '加勒菲斯绿地', '红色清真寺', '贝塔区'],
    timezone: 'UTC+5:30'
  },
  '加德满都': {
    description: '尼泊尔首都，寺庙之城，喜马拉雅门户。',
    population: '140万',
    attractions: ['杜巴广场', '猴庙', '博达哈大佛塔', '帕坦', '巴德岗'],
    timezone: 'UTC+5:45'
  },
  
  // ==================== 更多欧洲城市 ====================
  '佛罗伦萨': {
    description: '意大利文艺复兴发源地，艺术之城。',
    population: '38万',
    attractions: ['圣母百花大教堂', '乌菲兹美术馆', '老桥', '米开朗基罗广场', '皮蒂宫'],
    timezone: 'UTC+1'
  },
  '威尼斯': {
    description: '意大利水城，浪漫之都。',
    population: '26万',
    attractions: ['圣马可广场', '叹息桥', '贡多拉', '里亚托桥', '彩色岛'],
    timezone: 'UTC+1'
  },
  '米兰': {
    description: '意大利时尚之都，设计之城。',
    population: '140万',
    attractions: ['米兰大教堂', '达芬奇《最后的晚餐》', '埃马努埃莱二世拱廊', '斯福尔扎城堡', '时尚街区'],
    timezone: 'UTC+1'
  },
  '那不勒斯': {
    description: '意大利南部城市，披萨发源地。',
    population: '96万',
    attractions: ['庞贝古城', '维苏威火山', '那不勒斯王宫', '蛋堡', '那不勒斯国家考古博物馆'],
    timezone: 'UTC+1'
  },
  '慕尼黑': {
    description: '德国巴伐利亚首府，啤酒之城。',
    population: '147万',
    attractions: ['玛利亚广场', '新天鹅堡', '英国花园', '慕尼黑皇宫', '宝马博物馆'],
    timezone: 'UTC+1'
  },
  '科隆': {
    description: '德国莱茵河畔城市，大教堂之城。',
    population: '108万',
    attractions: ['科隆大教堂', '霍亨索伦桥', '路德维希博物馆', '莱茵河', '巧克力博物馆'],
    timezone: 'UTC+1'
  },
  '海德堡': {
    description: '德国大学城，浪漫之城。',
    population: '16万',
    attractions: ['海德堡城堡', '哲学家小径', '老桥', '海德堡大学', '内卡河'],
    timezone: 'UTC+1'
  },
  '萨尔茨堡': {
    description: '奥地利音乐之城，莫扎特故乡。',
    population: '15万',
    attractions: ['萨尔茨堡城堡', '米拉贝尔花园', '莫扎特故居', '粮食胡同', '海尔布伦宫'],
    timezone: 'UTC+1'
  },
  '因特拉肯': {
    description: '瑞士度假胜地，少女峰脚下。',
    population: '5700',
    attractions: ['少女峰', '图恩湖', '布里恩茨湖', '荷黑马特', '冒险运动'],
    timezone: 'UTC+1'
  },
  '卢塞恩': {
    description: '瑞士湖畔城市，蜜月之城。',
    population: '8万',
    attractions: ['卡佩尔桥', '狮子纪念碑', '皮拉图斯山', '瑞吉山', '琉森湖'],
    timezone: 'UTC+1'
  },
  '布鲁塞尔': {
    description: '比利时首都，欧盟总部所在地。',
    population: '120万',
    attractions: ['大广场', '撒尿小童', '原子球塔', '漫画博物馆', '圣米歇尔大教堂'],
    timezone: 'UTC+1'
  },
  '布鲁日': {
    description: '比利时中世纪小城，北方威尼斯。',
    population: '12万',
    attractions: ['市场广场', '钟楼', '圣血教堂', '运河游船', '巧克力博物馆'],
    timezone: 'UTC+1'
  },
  '卢森堡市': {
    description: '卢森堡大公国首都，欧洲最美阳台。',
    population: '12万',
    attractions: ['大公宫', '阿道夫桥', '伯克要塞', '宪法广场', '大峡谷'],
    timezone: 'UTC+1'
  },
  '布拉格': {
    description: '捷克首都，千塔之城，童话之城。',
    population: '131万',
    attractions: ['查理大桥', '布拉格城堡', '老城广场', '天文钟', '圣维特大教堂'],
    timezone: 'UTC+1'
  },
  '维也纳': {
    description: '奥地利首都，音乐之都，帝国之城。',
    population: '190万',
    attractions: ['美泉宫', '圣斯特凡大教堂', '国家歌剧院', '霍夫堡宫', '艺术史博物馆'],
    timezone: 'UTC+1'
  },
  '布达佩斯': {
    description: '匈牙利首都，多瑙河明珠。',
    population: '175万',
    attractions: ['渔人堡', '布达城堡', '国会大厦', '塞切尼温泉', '英雄广场'],
    timezone: 'UTC+1'
  },
  '雅典': {
    description: '希腊首都，西方文明摇篮。',
    population: '380万',
    attractions: ['帕特农神庙', '卫城', '宪法广场', '普拉卡区', '国家考古博物馆'],
    timezone: 'UTC+2'
  },
  '圣托里尼': {
    description: '希腊蜜月圣地，蓝白之城。',
    population: '15000',
    attractions: ['伊亚日落', '费拉小镇', '红沙滩', '火山口', '蓝顶教堂'],
    timezone: 'UTC+2'
  },
  '杜布罗夫尼克': {
    description: '克罗地亚亚得里亚海明珠，权力的游戏取景地。',
    population: '4万',
    attractions: ['古城墙', '斯特拉敦大道', '洛夫里耶纳茨堡', '缆车', '洛克鲁姆岛'],
    timezone: 'UTC+1'
  },
  '里斯本': {
    description: '葡萄牙首都，七丘之城。',
    population: '54万',
    attractions: ['贝伦塔', '热罗尼莫斯修道院', '28路电车', '阿尔法玛区', '商业广场'],
    timezone: 'UTC+0'
  },
  '波尔图': {
    description: '葡萄牙第二大城市，酒窖之城。',
    population: '24万',
    attractions: ['路易斯一世大桥', '莱罗书店', '圣本笃车站', '杜罗河', '酒窖'],
    timezone: 'UTC+0'
  },
  '赫尔辛基': {
    description: '芬兰首都，设计之城，千湖之国。',
    population: '65万',
    attractions: ['赫尔辛基大教堂', '岩石教堂', '芬兰堡', '设计区', '露天市场'],
    timezone: 'UTC+2'
  },
  '斯德哥尔摩': {
    description: '瑞典首都，北方威尼斯。',
    population: '97万',
    attractions: ['瓦萨博物馆', '市政厅', '老城', '王宫', '斯堪森露天博物馆'],
    timezone: 'UTC+1'
  },
  '哥本哈根': {
    description: '丹麦首都，童话之城。',
    population: '135万',
    attractions: ['小美人鱼', '趣伏里公园', '新港', '阿美琳堡宫', '玫瑰堡宫'],
    timezone: 'UTC+1'
  },
  '奥斯陆': {
    description: '挪威首都，峡湾门户。',
    population: '103万',
    attractions: ['维格兰雕塑公园', '奥斯陆歌剧院', '阿克胡斯城堡', '比格迪半岛', '霍尔门科伦滑雪跳台'],
    timezone: 'UTC+1'
  },
  '雷克雅未克': {
    description: '冰岛首都，世界最北首都。',
    population: '13万',
    attractions: ['哈尔格林姆斯教堂', '蓝湖温泉', '黄金圈', '极光', '珍珠楼'],
    timezone: 'UTC+0'
  },
  '莫斯科': {
    description: '俄罗斯首都，红场之城。',
    population: '1250万',
    attractions: ['红场', '克里姆林宫', '圣瓦西里大教堂', '莫斯科地铁', '阿尔巴特街'],
    timezone: 'UTC+3'
  },
  '圣彼得堡': {
    description: '俄罗斯文化首都，白夜之城。',
    population: '538万',
    attractions: ['冬宫', '滴血大教堂', '彼得保罗要塞', '涅瓦大街', '夏宫'],
    timezone: 'UTC+3'
  },
  
  // ==================== 更多北美城市 ====================
  '华盛顿': {
    description: '美国首都，政治中心。',
    population: '71万',
    attractions: ['白宫', '国会大厦', '林肯纪念堂', '华盛顿纪念碑', '史密森尼博物馆'],
    timezone: 'UTC-5'
  },
  '波士顿': {
    description: '美国历史名城，大学之城。',
    population: '69万',
    attractions: ['自由之路', '哈佛大学', 'MIT', '波士顿公园', '法尼尔厅'],
    timezone: 'UTC-5'
  },
  '西雅图': {
    description: '美国西北部城市，咖啡之城。',
    population: '74万',
    attractions: ['太空针塔', '派克市场', '奇胡利玻璃艺术园', '星巴克第一家店', '奥林匹克国家公园'],
    timezone: 'UTC-8'
  },
  '迈阿密': {
    description: '美国佛罗里达州城市，阳光之州。',
    population: '47万',
    attractions: ['南海滩', '小哈瓦那', '大沼泽地', '温伍德墙', '维兹卡亚博物馆'],
    timezone: 'UTC-5'
  },
  '拉斯维加斯': {
    description: '美国内华达州城市，世界娱乐之都。',
    population: '65万',
    attractions: ['拉斯维加斯大道', '百乐宫喷泉', '大峡谷', '胡佛水坝', '凯撒宫'],
    timezone: 'UTC-8'
  },
  '旧金山': {
    description: '美国西海岸城市，金门大桥所在地。',
    population: '87万',
    attractions: ['金门大桥', '渔人码头', '九曲花街', '恶魔岛', '唐人街'],
    timezone: 'UTC-8'
  },
  '芝加哥': {
    description: '美国第三大城市，风城。',
    population: '270万',
    attractions: ['云门', '千禧公园', '威利斯大厦', '密歇根大道', '艺术博物馆'],
    timezone: 'UTC-6'
  },
  '多伦多': {
    description: '加拿大第一大城市，多元文化之都。',
    population: '293万',
    attractions: ['CN塔', '尼亚加拉瀑布', '卡萨罗马城堡', '皇家安大略博物馆', '多伦多群岛'],
    timezone: 'UTC-5'
  },
  '温哥华': {
    description: '加拿大西海岸城市，宜居之城。',
    population: '63万',
    attractions: ['斯坦利公园', '卡皮拉诺吊桥', '格兰维尔岛', '煤气镇', '伊丽莎白女王公园'],
    timezone: 'UTC-8'
  },
  '蒙特利尔': {
    description: '加拿大法语区城市，节日之城。',
    population: '178万',
    attractions: ['圣母大教堂', '皇家山', '老港', '奥林匹克公园', '地下城'],
    timezone: 'UTC-5'
  },
  '魁北克城': {
    description: '加拿大法语区首府，北美小巴黎。',
    population: '54万',
    attractions: ['芳堤娜城堡', '老魁北克城', '战场公园', '圣安妮大教堂', '冬季嘉年华'],
    timezone: 'UTC-5'
  },
  '墨西哥城': {
    description: '墨西哥首都，美洲最古老城市之一。',
    population: '920万',
    attractions: ['宪法广场', '国家宫殿', '特奥蒂瓦坎金字塔', '查普尔特佩克公园', '弗里达博物馆'],
    timezone: 'UTC-6'
  },
  '坎昆': {
    description: '墨西哥度假胜地，加勒比海明珠。',
    population: '89万',
    attractions: ['酒店区', '奇琴伊察', '谢尔哈天然井', '科苏梅尔岛', '水下博物馆'],
    timezone: 'UTC-5'
  },
  
  // ==================== 更多南美城市 ====================
  '里约热内卢': {
    description: '巴西第二大城市，狂欢节之城。',
    population: '675万',
    attractions: ['基督山', '科帕卡巴纳海滩', '面包山', '马拉卡纳球场', '蒂茹卡国家公园'],
    timezone: 'UTC-3'
  },
  '圣保罗': {
    description: '巴西最大城市，南美洲金融中心。',
    population: '1233万',
    attractions: ['保利斯塔大道', '伊比拉普埃拉公园', '圣保罗大教堂', '自由区', '东方街'],
    timezone: 'UTC-3'
  },
  '布宜诺斯艾利斯': {
    description: '阿根廷首都，南美巴黎，探戈发源地。',
    population: '306万',
    attractions: ['五月广场', '博卡区', '雷科莱塔公墓', '雅典人书店', '圣特尔莫区'],
    timezone: 'UTC-3'
  },
  '利马': {
    description: '秘鲁首都，美食之都。',
    population: '975万',
    attractions: ['武器广场', '米拉弗洛雷斯', '利马大教堂', '黄金博物馆', '帕拉卡斯'],
    timezone: 'UTC-5'
  },
  '波哥大': {
    description: '哥伦比亚首都，南美洲的雅典。',
    population: '740万',
    attractions: ['玻利瓦尔广场', '蒙塞拉特山', '黄金博物馆', 'La Candelaria', '盐教堂'],
    timezone: 'UTC-5'
  },
  '圣地亚哥': {
    description: '智利首都，安第斯山脚下的城市。',
    population: '560万',
    attractions: ['圣卢西亚山', '武器广场', '拉莫内达宫', '中央市场', '瓦尔帕莱索'],
    timezone: 'UTC-4'
  },
  '基多': {
    description: '厄瓜多尔首都，赤道之城。',
    population: '197万',
    attractions: ['赤道纪念碑', '老城区', '面包山', '圣弗朗西斯科教堂', '科托帕希火山'],
    timezone: 'UTC-5'
  },
  
  // ==================== 更多大洋洲城市 ====================
  '悉尼': {
    description: '澳大利亚最大城市，海港之城。',
    population: '531万',
    attractions: ['悉尼歌剧院', '海港大桥', '邦迪海滩', '蓝山', '达令港'],
    timezone: 'UTC+10'
  },
  '墨尔本': {
    description: '澳大利亚第二大城市，文化之都。',
    population: '508万',
    attractions: ['联邦广场', '大洋路', '皇家植物园', '涂鸦巷', '菲利普岛'],
    timezone: 'UTC+10'
  },
  '布里斯班': {
    description: '澳大利亚第三大城市，阳光之城。',
    population: '256万',
    attractions: ['南岸公园', '龙柏考拉保护区', '故事桥', '莫顿岛', '黄金海岸'],
    timezone: 'UTC+10'
  },
  '珀斯': {
    description: '澳大利亚西海岸城市，最孤独的城市。',
    population: '210万',
    attractions: ['国王公园', '弗里曼特尔', '罗特尼斯岛', '天鹅河', '卡弗沙姆野生动物园'],
    timezone: 'UTC+8'
  },
  '奥克兰': {
    description: '新西兰最大城市，帆船之都。',
    population: '165万',
    attractions: ['天空塔', '怀赫科岛', '伊甸山', '奥克兰博物馆', '使命湾'],
    timezone: 'UTC+12'
  },
  '皇后镇': {
    description: '新西兰冒险之都，户外天堂。',
    population: '4万',
    attractions: ['蹦极', '米尔福德峡湾', '瓦卡蒂普湖', '天际线缆车', '格林诺奇'],
    timezone: 'UTC+12'
  },
  
  // ==================== 更多非洲城市 ====================
  '开罗': {
    description: '埃及首都，金字塔所在地。',
    population: '1010万',
    attractions: ['吉萨金字塔', '狮身人面像', '埃及博物馆', '哈利利市场', '萨拉丁城堡'],
    timezone: 'UTC+2'
  },
  '开普敦': {
    description: '南非立法首都，母亲城。',
    population: '460万',
    attractions: ['桌山', '好望角', '企鹅海滩', '罗本岛', '维多利亚港'],
    timezone: 'UTC+2'
  },
  '内罗毕': {
    description: '肯尼亚首都，东非门户。',
    population: '473万',
    attractions: ['内罗毕国家公园', '长颈鹿中心', '凯伦博物馆', '马赛市场', '安博塞利'],
    timezone: 'UTC+3'
  },
  '约翰内斯堡': {
    description: '南非最大城市，黄金之城。',
    population: '560万',
    attractions: ['种族隔离博物馆', '宪法山', '金矿城', '曼德拉广场', '狮子园'],
    timezone: 'UTC+2'
  },
  '马拉喀什': {
    description: '摩洛哥南部城市，红城。',
    population: '93万',
    attractions: ['德吉玛广场', '巴希亚宫', '马约尔花园', '库图比亚清真寺', '撒哈拉沙漠'],
    timezone: 'UTC+0'
  },
  '卡萨布兰卡': {
    description: '摩洛哥最大城市，大西洋明珠。',
    population: '370万',
    attractions: ['哈桑二世清真寺', '老麦地那', '里克咖啡馆', '穆罕默德五世广场', '安法区'],
    timezone: 'UTC+0'
  },
  '亚的斯亚贝巴': {
    description: '埃塞俄比亚首都，非洲之角。',
    population: '520万',
    attractions: ['国家博物馆', '圣三一大教堂', '恩托托山', '梅尔卡托市场', '非洲联盟总部'],
    timezone: 'UTC+3'
  },
  '达累斯萨拉姆': {
    description: '坦桑尼亚最大城市，和平之家。',
    population: '670万',
    attractions: ['国家博物馆', '库里奥市场', '可可海滩', '巴加莫约', '桑给巴尔岛'],
    timezone: 'UTC+3'
  },
  '拉各斯': {
    description: '尼日利亚最大城市，非洲硅谷。',
    population: '1540万',
    attractions: ['国家博物馆', '拉各斯海滩', '莱基花园', '尼日利亚国家剧院', '巴达格里'],
    timezone: 'UTC+1'
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
