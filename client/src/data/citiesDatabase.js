// 全球主要城市数据库 - 用于本地国家判断
// 数据结构: { name, nameEn, lat, lng, country, countryCode }

const CITIES_DATABASE = [
  // ==================== 中国 ====================
  // 直辖市
  { name: '北京', nameEn: 'Beijing', lat: 39.9042, lng: 116.4074, country: '中国', countryCode: 'CN' },
  { name: '上海', nameEn: 'Shanghai', lat: 31.2304, lng: 121.4737, country: '中国', countryCode: 'CN' },
  { name: '天津', nameEn: 'Tianjin', lat: 39.3434, lng: 117.3616, country: '中国', countryCode: 'CN' },
  { name: '重庆', nameEn: 'Chongqing', lat: 29.4316, lng: 106.9123, country: '中国', countryCode: 'CN' },
  
  // 广东省
  { name: '广州', nameEn: 'Guangzhou', lat: 23.1291, lng: 113.2644, country: '中国', countryCode: 'CN' },
  { name: '深圳', nameEn: 'Shenzhen', lat: 22.5431, lng: 114.0579, country: '中国', countryCode: 'CN' },
  { name: '东莞', nameEn: 'Dongguan', lat: 23.0430, lng: 113.7633, country: '中国', countryCode: 'CN' },
  { name: '佛山', nameEn: 'Foshan', lat: 23.0218, lng: 113.1218, country: '中国', countryCode: 'CN' },
  { name: '珠海', nameEn: 'Zhuhai', lat: 22.2710, lng: 113.5767, country: '中国', countryCode: 'CN' },
  { name: '中山', nameEn: 'Zhongshan', lat: 22.5170, lng: 113.3925, country: '中国', countryCode: 'CN' },
  { name: '惠州', nameEn: 'Huizhou', lat: 23.1116, lng: 114.4162, country: '中国', countryCode: 'CN' },
  { name: '汕头', nameEn: 'Shantou', lat: 23.3541, lng: 116.6820, country: '中国', countryCode: 'CN' },
  { name: '湛江', nameEn: 'Zhanjiang', lat: 21.2707, lng: 110.3594, country: '中国', countryCode: 'CN' },
  { name: '茂名', nameEn: 'Maoming', lat: 21.6682, lng: 110.9255, country: '中国', countryCode: 'CN' },
  { name: '江门', nameEn: 'Jiangmen', lat: 22.5787, lng: 113.0819, country: '中国', countryCode: 'CN' },
  { name: '肇庆', nameEn: 'Zhaoqing', lat: 23.0515, lng: 112.4697, country: '中国', countryCode: 'CN' },
  { name: '梅州', nameEn: 'Meizhou', lat: 24.2886, lng: 116.1223, country: '中国', countryCode: 'CN' },
  { name: '揭阳', nameEn: 'Jieyang', lat: 23.5500, lng: 116.3728, country: '中国', countryCode: 'CN' },
  { name: '清远', nameEn: 'Qingyuan', lat: 23.6818, lng: 113.0561, country: '中国', countryCode: 'CN' },
  { name: '韶关', nameEn: 'Shaoguan', lat: 24.8104, lng: 113.5975, country: '中国', countryCode: 'CN' },
  { name: '河源', nameEn: 'Heyuan', lat: 23.7437, lng: 114.7007, country: '中国', countryCode: 'CN' },
  { name: '潮州', nameEn: 'Chaozhou', lat: 23.6618, lng: 116.6228, country: '中国', countryCode: 'CN' },
  { name: '阳江', nameEn: 'Yangjiang', lat: 21.8575, lng: 111.9826, country: '中国', countryCode: 'CN' },
  { name: '云浮', nameEn: 'Yunfu', lat: 22.9152, lng: 112.0445, country: '中国', countryCode: 'CN' },
  { name: '汕尾', nameEn: 'Shanwei', lat: 22.7862, lng: 115.3756, country: '中国', countryCode: 'CN' },
  
  // 浙江省
  { name: '杭州', nameEn: 'Hangzhou', lat: 30.2741, lng: 120.1551, country: '中国', countryCode: 'CN' },
  { name: '宁波', nameEn: 'Ningbo', lat: 29.8683, lng: 121.5440, country: '中国', countryCode: 'CN' },
  { name: '温州', nameEn: 'Wenzhou', lat: 27.9938, lng: 120.6993, country: '中国', countryCode: 'CN' },
  { name: '绍兴', nameEn: 'Shaoxing', lat: 30.0302, lng: 120.5803, country: '中国', countryCode: 'CN' },
  { name: '台州', nameEn: 'Taizhou', lat: 28.6568, lng: 121.4208, country: '中国', countryCode: 'CN' },
  { name: '嘉兴', nameEn: 'Jiaxing', lat: 30.7539, lng: 120.7585, country: '中国', countryCode: 'CN' },
  { name: '湖州', nameEn: 'Huzhou', lat: 30.8926, lng: 120.0967, country: '中国', countryCode: 'CN' },
  { name: '金华', nameEn: 'Jinhua', lat: 29.0788, lng: 119.6497, country: '中国', countryCode: 'CN' },
  { name: '衢州', nameEn: 'Quzhou', lat: 28.9417, lng: 118.8744, country: '中国', countryCode: 'CN' },
  { name: '丽水', nameEn: 'Lishui', lat: 28.4672, lng: 119.9117, country: '中国', countryCode: 'CN' },
  { name: '舟山', nameEn: 'Zhoushan', lat: 30.0160, lng: 122.1067, country: '中国', countryCode: 'CN' },
  
  // 江苏省
  { name: '南京', nameEn: 'Nanjing', lat: 32.0603, lng: 118.7969, country: '中国', countryCode: 'CN' },
  { name: '苏州', nameEn: 'Suzhou', lat: 31.2990, lng: 120.5853, country: '中国', countryCode: 'CN' },
  { name: '无锡', nameEn: 'Wuxi', lat: 31.4912, lng: 120.3119, country: '中国', countryCode: 'CN' },
  { name: '常州', nameEn: 'Changzhou', lat: 31.8107, lng: 119.9742, country: '中国', countryCode: 'CN' },
  { name: '徐州', nameEn: 'Xuzhou', lat: 34.2610, lng: 117.1949, country: '中国', countryCode: 'CN' },
  { name: '南通', nameEn: 'Nantong', lat: 32.0603, lng: 120.8647, country: '中国', countryCode: 'CN' },
  { name: '连云港', nameEn: 'Lianyungang', lat: 34.5966, lng: 119.2216, country: '中国', countryCode: 'CN' },
  { name: '淮安', nameEn: "Huai'an", lat: 33.6102, lng: 119.0153, country: '中国', countryCode: 'CN' },
  { name: '盐城', nameEn: 'Yancheng', lat: 33.3477, lng: 120.1614, country: '中国', countryCode: 'CN' },
  { name: '扬州', nameEn: 'Yangzhou', lat: 32.3936, lng: 119.4127, country: '中国', countryCode: 'CN' },
  { name: '镇江', nameEn: 'Zhenjiang', lat: 32.1878, lng: 119.4250, country: '中国', countryCode: 'CN' },
  { name: '泰州', nameEn: 'Taizhou', lat: 32.4558, lng: 119.9231, country: '中国', countryCode: 'CN' },
  { name: '宿迁', nameEn: 'Suqian', lat: 33.9632, lng: 118.2752, country: '中国', countryCode: 'CN' },
  
  // 山东省
  { name: '济南', nameEn: 'Jinan', lat: 36.6512, lng: 116.9972, country: '中国', countryCode: 'CN' },
  { name: '青岛', nameEn: 'Qingdao', lat: 36.0671, lng: 120.3826, country: '中国', countryCode: 'CN' },
  { name: '烟台', nameEn: 'Yantai', lat: 37.4638, lng: 121.4479, country: '中国', countryCode: 'CN' },
  { name: '潍坊', nameEn: 'Weifang', lat: 36.7068, lng: 119.1618, country: '中国', countryCode: 'CN' },
  { name: '临沂', nameEn: 'Linyi', lat: 35.1046, lng: 118.3563, country: '中国', countryCode: 'CN' },
  { name: '济宁', nameEn: 'Jining', lat: 35.4150, lng: 116.5873, country: '中国', countryCode: 'CN' },
  { name: '淄博', nameEn: 'Zibo', lat: 36.8131, lng: 118.0548, country: '中国', countryCode: 'CN' },
  { name: '威海', nameEn: 'Weihai', lat: 37.5131, lng: 122.1203, country: '中国', countryCode: 'CN' },
  { name: '德州', nameEn: 'Dezhou', lat: 37.4346, lng: 116.3590, country: '中国', countryCode: 'CN' },
  { name: '泰安', nameEn: "Tai'an", lat: 36.1954, lng: 117.0875, country: '中国', countryCode: 'CN' },
  { name: '聊城', nameEn: 'Liaocheng', lat: 36.4560, lng: 115.9854, country: '中国', countryCode: 'CN' },
  { name: '滨州', nameEn: 'Binzhou', lat: 37.3819, lng: 117.9727, country: '中国', countryCode: 'CN' },
  { name: '菏泽', nameEn: 'Heze', lat: 35.2336, lng: 115.4810, country: '中国', countryCode: 'CN' },
  { name: '枣庄', nameEn: 'Zaozhuang', lat: 34.8564, lng: 117.3283, country: '中国', countryCode: 'CN' },
  { name: '日照', nameEn: 'Rizhao', lat: 35.3813, lng: 119.5269, country: '中国', countryCode: 'CN' },
  { name: '东营', nameEn: 'Dongying', lat: 37.4616, lng: 118.6742, country: '中国', countryCode: 'CN' },
  
  // 四川省
  { name: '成都', nameEn: 'Chengdu', lat: 30.5728, lng: 104.0668, country: '中国', countryCode: 'CN' },
  { name: '绵阳', nameEn: 'Mianyang', lat: 31.4678, lng: 104.7418, country: '中国', countryCode: 'CN' },
  { name: '德阳', nameEn: 'Deyang', lat: 31.1270, lng: 104.3979, country: '中国', countryCode: 'CN' },
  { name: '宜宾', nameEn: 'Yibin', lat: 28.7513, lng: 104.6417, country: '中国', countryCode: 'CN' },
  { name: '南充', nameEn: 'Nanchong', lat: 30.8373, lng: 106.1107, country: '中国', countryCode: 'CN' },
  { name: '达州', nameEn: 'Dazhou', lat: 31.2089, lng: 107.4681, country: '中国', countryCode: 'CN' },
  { name: '泸州', nameEn: 'Luzhou', lat: 28.8717, lng: 105.4423, country: '中国', countryCode: 'CN' },
  { name: '自贡', nameEn: 'Zigong', lat: 29.3528, lng: 104.7786, country: '中国', countryCode: 'CN' },
  { name: '乐山', nameEn: 'Leshan', lat: 29.5520, lng: 103.7656, country: '中国', countryCode: 'CN' },
  { name: '内江', nameEn: 'Neijiang', lat: 29.5802, lng: 105.0584, country: '中国', countryCode: 'CN' },
  { name: '遂宁', nameEn: 'Suining', lat: 30.5327, lng: 105.5714, country: '中国', countryCode: 'CN' },
  { name: '攀枝花', nameEn: 'Panzhihua', lat: 26.5805, lng: 101.7185, country: '中国', countryCode: 'CN' },
  
  // 湖北省
  { name: '武汉', nameEn: 'Wuhan', lat: 30.5928, lng: 114.3055, country: '中国', countryCode: 'CN' },
  { name: '宜昌', nameEn: 'Yichang', lat: 30.6917, lng: 111.2865, country: '中国', countryCode: 'CN' },
  { name: '襄阳', nameEn: 'Xiangyang', lat: 32.0090, lng: 112.1225, country: '中国', countryCode: 'CN' },
  { name: '荆州', nameEn: 'Jingzhou', lat: 30.3261, lng: 112.2389, country: '中国', countryCode: 'CN' },
  { name: '黄冈', nameEn: 'Huanggang', lat: 30.4537, lng: 114.8721, country: '中国', countryCode: 'CN' },
  { name: '十堰', nameEn: 'Shiyan', lat: 32.6292, lng: 110.8010, country: '中国', countryCode: 'CN' },
  { name: '孝感', nameEn: 'Xiaogan', lat: 30.9245, lng: 113.9169, country: '中国', countryCode: 'CN' },
  { name: '荆门', nameEn: 'Jingmen', lat: 31.0354, lng: 112.1993, country: '中国', countryCode: 'CN' },
  { name: '鄂州', nameEn: 'Ezhou', lat: 30.3908, lng: 114.8949, country: '中国', countryCode: 'CN' },
  { name: '黄石', nameEn: 'Huangshi', lat: 30.2161, lng: 115.0385, country: '中国', countryCode: 'CN' },
  
  // 湖南省
  { name: '长沙', nameEn: 'Changsha', lat: 28.2282, lng: 112.9388, country: '中国', countryCode: 'CN' },
  { name: '岳阳', nameEn: 'Yueyang', lat: 29.3572, lng: 113.1290, country: '中国', countryCode: 'CN' },
  { name: '常德', nameEn: 'Changde', lat: 29.0316, lng: 111.6987, country: '中国', countryCode: 'CN' },
  { name: '衡阳', nameEn: 'Hengyang', lat: 26.8931, lng: 112.5720, country: '中国', countryCode: 'CN' },
  { name: '株洲', nameEn: 'Zhuzhou', lat: 27.8277, lng: 113.1338, country: '中国', countryCode: 'CN' },
  { name: '湘潭', nameEn: 'Xiangtan', lat: 27.8298, lng: 112.9441, country: '中国', countryCode: 'CN' },
  { name: '邵阳', nameEn: 'Shaoyang', lat: 27.2389, lng: 111.4678, country: '中国', countryCode: 'CN' },
  { name: '郴州', nameEn: 'Chenzhou', lat: 25.7701, lng: 113.0148, country: '中国', countryCode: 'CN' },
  { name: '娄底', nameEn: 'Loudi', lat: 27.7001, lng: 111.9937, country: '中国', countryCode: 'CN' },
  { name: '益阳', nameEn: 'Yiyang', lat: 28.5539, lng: 112.3552, country: '中国', countryCode: 'CN' },
  
  // 河南省
  { name: '郑州', nameEn: 'Zhengzhou', lat: 34.7466, lng: 113.6253, country: '中国', countryCode: 'CN' },
  { name: '洛阳', nameEn: 'Luoyang', lat: 34.6197, lng: 112.4539, country: '中国', countryCode: 'CN' },
  { name: '南阳', nameEn: 'Nanyang', lat: 32.9990, lng: 112.5283, country: '中国', countryCode: 'CN' },
  { name: '许昌', nameEn: 'Xuchang', lat: 34.0219, lng: 113.8521, country: '中国', countryCode: 'CN' },
  { name: '周口', nameEn: 'Zhoukou', lat: 33.6259, lng: 114.6500, country: '中国', countryCode: 'CN' },
  { name: '新乡', nameEn: 'Xinxiang', lat: 35.3036, lng: 113.9268, country: '中国', countryCode: 'CN' },
  { name: '信阳', nameEn: 'Xinyang', lat: 32.1232, lng: 114.0751, country: '中国', countryCode: 'CN' },
  { name: '商丘', nameEn: 'Shangqiu', lat: 34.4149, lng: 115.6505, country: '中国', countryCode: 'CN' },
  { name: '驻马店', nameEn: 'Zhumadian', lat: 32.9802, lng: 114.0248, country: '中国', countryCode: 'CN' },
  { name: '焦作', nameEn: 'Jiaozuo', lat: 35.2390, lng: 113.2383, country: '中国', countryCode: 'CN' },
  { name: '平顶山', nameEn: 'Pingdingshan', lat: 33.7662, lng: 113.1927, country: '中国', countryCode: 'CN' },
  { name: '安阳', nameEn: 'Anyang', lat: 36.0968, lng: 114.3927, country: '中国', countryCode: 'CN' },
  { name: '开封', nameEn: 'Kaifeng', lat: 34.7972, lng: 114.3076, country: '中国', countryCode: 'CN' },
  
  // 河北省
  { name: '石家庄', nameEn: 'Shijiazhuang', lat: 38.0428, lng: 114.5149, country: '中国', countryCode: 'CN' },
  { name: '唐山', nameEn: 'Tangshan', lat: 39.6292, lng: 118.1802, country: '中国', countryCode: 'CN' },
  { name: '保定', nameEn: 'Baoding', lat: 38.8740, lng: 115.4646, country: '中国', countryCode: 'CN' },
  { name: '廊坊', nameEn: 'Langfang', lat: 39.5168, lng: 116.6837, country: '中国', countryCode: 'CN' },
  { name: '邯郸', nameEn: 'Handan', lat: 36.6256, lng: 114.5391, country: '中国', countryCode: 'CN' },
  { name: '沧州', nameEn: 'Cangzhou', lat: 38.3037, lng: 116.8387, country: '中国', countryCode: 'CN' },
  { name: '邢台', nameEn: 'Xingtai', lat: 37.0598, lng: 114.5049, country: '中国', countryCode: 'CN' },
  { name: '秦皇岛', nameEn: 'Qinhuangdao', lat: 39.9354, lng: 119.5977, country: '中国', countryCode: 'CN' },
  { name: '张家口', nameEn: 'Zhangjiakou', lat: 40.7670, lng: 114.8869, country: '中国', countryCode: 'CN' },
  { name: '承德', nameEn: 'Chengde', lat: 40.9510, lng: 117.9633, country: '中国', countryCode: 'CN' },
  
  // 陕西省
  { name: '西安', nameEn: "Xi'an", lat: 34.3416, lng: 108.9398, country: '中国', countryCode: 'CN' },
  { name: '咸阳', nameEn: 'Xianyang', lat: 34.3296, lng: 108.7090, country: '中国', countryCode: 'CN' },
  { name: '宝鸡', nameEn: 'Baoji', lat: 34.3617, lng: 107.2371, country: '中国', countryCode: 'CN' },
  { name: '渭南', nameEn: 'Weinan', lat: 34.4996, lng: 109.5029, country: '中国', countryCode: 'CN' },
  { name: '汉中', nameEn: 'Hanzhong', lat: 33.0674, lng: 107.0231, country: '中国', countryCode: 'CN' },
  { name: '延安', nameEn: "Yan'an", lat: 36.5853, lng: 109.4896, country: '中国', countryCode: 'CN' },
  { name: '榆林', nameEn: 'Yulin', lat: 38.2853, lng: 109.7347, country: '中国', countryCode: 'CN' },
  { name: '安康', nameEn: 'Ankang', lat: 32.6849, lng: 109.0294, country: '中国', countryCode: 'CN' },
  
  // 福建省
  { name: '福州', nameEn: 'Fuzhou', lat: 26.0745, lng: 119.2965, country: '中国', countryCode: 'CN' },
  { name: '厦门', nameEn: 'Xiamen', lat: 24.4798, lng: 118.0894, country: '中国', countryCode: 'CN' },
  { name: '泉州', nameEn: 'Quanzhou', lat: 24.8741, lng: 118.6757, country: '中国', countryCode: 'CN' },
  { name: '漳州', nameEn: 'Zhangzhou', lat: 24.5130, lng: 117.6471, country: '中国', countryCode: 'CN' },
  { name: '莆田', nameEn: 'Putian', lat: 25.4540, lng: 119.0077, country: '中国', countryCode: 'CN' },
  { name: '龙岩', nameEn: 'Longyan', lat: 25.0751, lng: 117.0175, country: '中国', countryCode: 'CN' },
  { name: '三明', nameEn: 'Sanming', lat: 26.2634, lng: 117.6387, country: '中国', countryCode: 'CN' },
  { name: '南平', nameEn: 'Nanping', lat: 26.6357, lng: 118.1782, country: '中国', countryCode: 'CN' },
  { name: '宁德', nameEn: 'Ningde', lat: 26.6567, lng: 119.5479, country: '中国', countryCode: 'CN' },
  
  // 安徽省
  { name: '合肥', nameEn: 'Hefei', lat: 31.8206, lng: 117.2272, country: '中国', countryCode: 'CN' },
  { name: '芜湖', nameEn: 'Wuhu', lat: 31.3526, lng: 118.3765, country: '中国', countryCode: 'CN' },
  { name: '蚌埠', nameEn: 'Bengbu', lat: 32.9166, lng: 117.3887, country: '中国', countryCode: 'CN' },
  { name: '阜阳', nameEn: 'Fuyang', lat: 32.8902, lng: 115.8142, country: '中国', countryCode: 'CN' },
  { name: '安庆', nameEn: 'Anqing', lat: 30.5430, lng: 117.0632, country: '中国', countryCode: 'CN' },
  { name: '马鞍山', nameEn: "Ma'anshan", lat: 31.6705, lng: 118.5070, country: '中国', countryCode: 'CN' },
  { name: '淮南', nameEn: 'Huainan', lat: 32.6417, lng: 117.0186, country: '中国', countryCode: 'CN' },
  { name: '淮北', nameEn: 'Huaibei', lat: 33.9558, lng: 116.7983, country: '中国', countryCode: 'CN' },
  
  // 辽宁省
  { name: '沈阳', nameEn: 'Shenyang', lat: 41.8057, lng: 123.4315, country: '中国', countryCode: 'CN' },
  { name: '大连', nameEn: 'Dalian', lat: 38.9140, lng: 121.6147, country: '中国', countryCode: 'CN' },
  { name: '鞍山', nameEn: 'Anshan', lat: 41.1100, lng: 122.9944, country: '中国', countryCode: 'CN' },
  { name: '抚顺', nameEn: 'Fushun', lat: 41.8759, lng: 123.9572, country: '中国', countryCode: 'CN' },
  { name: '本溪', nameEn: 'Benxi', lat: 41.2941, lng: 123.7665, country: '中国', countryCode: 'CN' },
  { name: '丹东', nameEn: 'Dandong', lat: 40.1291, lng: 124.3946, country: '中国', countryCode: 'CN' },
  { name: '锦州', nameEn: 'Jinzhou', lat: 41.0952, lng: 121.1269, country: '中国', countryCode: 'CN' },
  { name: '营口', nameEn: 'Yingkou', lat: 40.6670, lng: 122.2352, country: '中国', countryCode: 'CN' },
  { name: '葫芦岛', nameEn: 'Huludao', lat: 40.7110, lng: 120.8369, country: '中国', countryCode: 'CN' },
  
  // 吉林省
  { name: '长春', nameEn: 'Changchun', lat: 43.8171, lng: 125.3235, country: '中国', countryCode: 'CN' },
  { name: '吉林', nameEn: 'Jilin', lat: 43.8378, lng: 126.5496, country: '中国', countryCode: 'CN' },
  { name: '四平', nameEn: 'Siping', lat: 43.1668, lng: 124.3506, country: '中国', countryCode: 'CN' },
  { name: '通化', nameEn: 'Tonghua', lat: 41.7211, lng: 125.9368, country: '中国', countryCode: 'CN' },
  { name: '延边', nameEn: 'Yanbian', lat: 42.8912, lng: 129.5135, country: '中国', countryCode: 'CN' },
  
  // 黑龙江省
  { name: '哈尔滨', nameEn: 'Harbin', lat: 45.8038, lng: 126.5350, country: '中国', countryCode: 'CN' },
  { name: '齐齐哈尔', nameEn: 'Qiqihar', lat: 47.3549, lng: 123.9182, country: '中国', countryCode: 'CN' },
  { name: '牡丹江', nameEn: 'Mudanjiang', lat: 44.5530, lng: 129.6332, country: '中国', countryCode: 'CN' },
  { name: '佳木斯', nameEn: 'Jiamusi', lat: 46.7998, lng: 130.3189, country: '中国', countryCode: 'CN' },
  { name: '大庆', nameEn: 'Daqing', lat: 46.5892, lng: 125.1038, country: '中国', countryCode: 'CN' },
  
  // 云南省
  { name: '昆明', nameEn: 'Kunming', lat: 25.0389, lng: 102.7183, country: '中国', countryCode: 'CN' },
  { name: '大理', nameEn: 'Dali', lat: 25.6065, lng: 100.2676, country: '中国', countryCode: 'CN' },
  { name: '丽江', nameEn: 'Lijiang', lat: 26.8553, lng: 100.2271, country: '中国', countryCode: 'CN' },
  { name: '曲靖', nameEn: 'Qujing', lat: 25.4900, lng: 103.7962, country: '中国', countryCode: 'CN' },
  { name: '玉溪', nameEn: 'Yuxi', lat: 24.3520, lng: 102.5462, country: '中国', countryCode: 'CN' },
  { name: '西双版纳', nameEn: 'Xishuangbanna', lat: 22.0008, lng: 100.7948, country: '中国', countryCode: 'CN' },
  { name: '香格里拉', nameEn: 'Shangri-La', lat: 27.8299, lng: 99.7028, country: '中国', countryCode: 'CN' },
  
  // 贵州省
  { name: '贵阳', nameEn: 'Guiyang', lat: 26.6470, lng: 106.6302, country: '中国', countryCode: 'CN' },
  { name: '遵义', nameEn: 'Zunyi', lat: 27.7254, lng: 106.9273, country: '中国', countryCode: 'CN' },
  
  // 广西壮族自治区
  { name: '南宁', nameEn: 'Nanning', lat: 22.8170, lng: 108.3665, country: '中国', countryCode: 'CN' },
  { name: '桂林', nameEn: 'Guilin', lat: 25.2736, lng: 110.2900, country: '中国', countryCode: 'CN' },
  { name: '柳州', nameEn: 'Liuzhou', lat: 24.3254, lng: 109.4158, country: '中国', countryCode: 'CN' },
  { name: '北海', nameEn: 'Beihai', lat: 21.4812, lng: 109.1201, country: '中国', countryCode: 'CN' },
  
  // 甘肃省
  { name: '兰州', nameEn: 'Lanzhou', lat: 36.0611, lng: 103.8343, country: '中国', countryCode: 'CN' },
  { name: '敦煌', nameEn: 'Dunhuang', lat: 40.1421, lng: 94.6619, country: '中国', countryCode: 'CN' },
  
  // 内蒙古自治区
  { name: '呼和浩特', nameEn: 'Hohhot', lat: 40.8422, lng: 111.7500, country: '中国', countryCode: 'CN' },
  { name: '包头', nameEn: 'Baotou', lat: 40.6574, lng: 109.8401, country: '中国', countryCode: 'CN' },
  { name: '鄂尔多斯', nameEn: 'Ordos', lat: 39.6086, lng: 109.7812, country: '中国', countryCode: 'CN' },
  
  // 新疆维吾尔自治区
  { name: '乌鲁木齐', nameEn: 'Urumqi', lat: 43.8256, lng: 87.6168, country: '中国', countryCode: 'CN' },
  { name: '喀什', nameEn: 'Kashgar', lat: 39.4704, lng: 75.9899, country: '中国', countryCode: 'CN' },
  { name: '伊犁', nameEn: 'Ili', lat: 43.9220, lng: 81.3296, country: '中国', countryCode: 'CN' },
  
  // 西藏自治区
  { name: '拉萨', nameEn: 'Lhasa', lat: 29.6500, lng: 91.1000, country: '中国', countryCode: 'CN' },
  
  // 海南省
  { name: '海口', nameEn: 'Haikou', lat: 20.0440, lng: 110.1999, country: '中国', countryCode: 'CN' },
  { name: '三亚', nameEn: 'Sanya', lat: 18.2528, lng: 109.5120, country: '中国', countryCode: 'CN' },
  
  // 宁夏回族自治区
  { name: '银川', nameEn: 'Yinchuan', lat: 38.4872, lng: 106.2309, country: '中国', countryCode: 'CN' },
  
  // 青海省
  { name: '西宁', nameEn: 'Xining', lat: 36.6171, lng: 101.7782, country: '中国', countryCode: 'CN' },
  
  // 特别行政区
  { name: '香港', nameEn: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: '中国', countryCode: 'HK' },
  { name: '澳门', nameEn: 'Macau', lat: 22.1987, lng: 113.5439, country: '中国', countryCode: 'MO' },
  { name: '台北', nameEn: 'Taipei', lat: 25.0330, lng: 121.5654, country: '中国', countryCode: 'TW' },
  { name: '高雄', nameEn: 'Kaohsiung', lat: 22.6273, lng: 120.3014, country: '中国', countryCode: 'TW' },
  
  // ==================== 日本 ====================
  { name: '东京', nameEn: 'Tokyo', lat: 35.6762, lng: 139.6503, country: '日本', countryCode: 'JP' },
  { name: '大阪', nameEn: 'Osaka', lat: 34.6937, lng: 135.5023, country: '日本', countryCode: 'JP' },
  { name: '京都', nameEn: 'Kyoto', lat: 35.0116, lng: 135.7681, country: '日本', countryCode: 'JP' },
  { name: '横滨', nameEn: 'Yokohama', lat: 35.4437, lng: 139.6380, country: '日本', countryCode: 'JP' },
  { name: '名古屋', nameEn: 'Nagoya', lat: 35.1815, lng: 136.9066, country: '日本', countryCode: 'JP' },
  { name: '札幌', nameEn: 'Sapporo', lat: 43.0618, lng: 141.3545, country: '日本', countryCode: 'JP' },
  { name: '福冈', nameEn: 'Fukuoka', lat: 33.5904, lng: 130.4017, country: '日本', countryCode: 'JP' },
  { name: '神户', nameEn: 'Kobe', lat: 34.6901, lng: 135.1956, country: '日本', countryCode: 'JP' },
  { name: '仙台', nameEn: 'Sendai', lat: 38.2682, lng: 140.8694, country: '日本', countryCode: 'JP' },
  { name: '广岛', nameEn: 'Hiroshima', lat: 34.3853, lng: 132.4553, country: '日本', countryCode: 'JP' },
  { name: '冲绳', nameEn: 'Okinawa', lat: 26.3344, lng: 127.8056, country: '日本', countryCode: 'JP' },
  { name: '奈良', nameEn: 'Nara', lat: 34.6851, lng: 135.8048, country: '日本', countryCode: 'JP' },
  
  // ==================== 韩国 ====================
  { name: '首尔', nameEn: 'Seoul', lat: 37.5665, lng: 126.9780, country: '韩国', countryCode: 'KR' },
  { name: '釜山', nameEn: 'Busan', lat: 35.1796, lng: 129.0756, country: '韩国', countryCode: 'KR' },
  { name: '济州', nameEn: 'Jeju', lat: 33.4996, lng: 126.5312, country: '韩国', countryCode: 'KR' },
  { name: '仁川', nameEn: 'Incheon', lat: 37.4563, lng: 126.7052, country: '韩国', countryCode: 'KR' },
  { name: '大邱', nameEn: 'Daegu', lat: 35.8714, lng: 128.6014, country: '韩国', countryCode: 'KR' },
  { name: '光州', nameEn: 'Gwangju', lat: 35.1595, lng: 126.8526, country: '韩国', countryCode: 'KR' },
  
  // ==================== 东南亚 ====================
  { name: '曼谷', nameEn: 'Bangkok', lat: 13.7563, lng: 100.5018, country: '泰国', countryCode: 'TH' },
  { name: '清迈', nameEn: 'Chiang Mai', lat: 18.7883, lng: 98.9853, country: '泰国', countryCode: 'TH' },
  { name: '普吉', nameEn: 'Phuket', lat: 7.8804, lng: 98.3923, country: '泰国', countryCode: 'TH' },
  { name: '新加坡', nameEn: 'Singapore', lat: 1.3521, lng: 103.8198, country: '新加坡', countryCode: 'SG' },
  { name: '吉隆坡', nameEn: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, country: '马来西亚', countryCode: 'MY' },
  { name: '槟城', nameEn: 'Penang', lat: 5.4164, lng: 100.3327, country: '马来西亚', countryCode: 'MY' },
  { name: '雅加达', nameEn: 'Jakarta', lat: -6.2088, lng: 106.8456, country: '印度尼西亚', countryCode: 'ID' },
  { name: '巴厘岛', nameEn: 'Bali', lat: -8.3405, lng: 115.0920, country: '印度尼西亚', countryCode: 'ID' },
  { name: '河内', nameEn: 'Hanoi', lat: 21.0285, lng: 105.8542, country: '越南', countryCode: 'VN' },
  { name: '胡志明市', nameEn: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, country: '越南', countryCode: 'VN' },
  { name: '岘港', nameEn: 'Da Nang', lat: 16.0544, lng: 108.2022, country: '越南', countryCode: 'VN' },
  { name: '马尼拉', nameEn: 'Manila', lat: 14.5995, lng: 120.9842, country: '菲律宾', countryCode: 'PH' },
  { name: '金边', nameEn: 'Phnom Penh', lat: 11.5564, lng: 104.9282, country: '柬埔寨', countryCode: 'KH' },
  { name: '暹粒', nameEn: 'Siem Reap', lat: 13.3633, lng: 103.8564, country: '柬埔寨', countryCode: 'KH' },
  { name: '仰光', nameEn: 'Yangon', lat: 16.8661, lng: 96.1951, country: '缅甸', countryCode: 'MM' },
  { name: '万象', nameEn: 'Vientiane', lat: 17.9757, lng: 102.6331, country: '老挝', countryCode: 'LA' },
  
  // ==================== 南亚 ====================
  { name: '新德里', nameEn: 'New Delhi', lat: 28.6139, lng: 77.2090, country: '印度', countryCode: 'IN' },
  { name: '孟买', nameEn: 'Mumbai', lat: 19.0760, lng: 72.8777, country: '印度', countryCode: 'IN' },
  { name: '加尔各答', nameEn: 'Kolkata', lat: 22.5726, lng: 88.3639, country: '印度', countryCode: 'IN' },
  { name: '班加罗尔', nameEn: 'Bangalore', lat: 12.9716, lng: 77.5946, country: '印度', countryCode: 'IN' },
  { name: '金奈', nameEn: 'Chennai', lat: 13.0827, lng: 80.2707, country: '印度', countryCode: 'IN' },
  { name: '科伦坡', nameEn: 'Colombo', lat: 6.9271, lng: 79.8612, country: '斯里兰卡', countryCode: 'LK' },
  { name: '加德满都', nameEn: 'Kathmandu', lat: 27.7172, lng: 85.3240, country: '尼泊尔', countryCode: 'NP' },
  { name: '达卡', nameEn: 'Dhaka', lat: 23.8103, lng: 90.4125, country: '孟加拉国', countryCode: 'BD' },
  { name: '伊斯兰堡', nameEn: 'Islamabad', lat: 33.6844, lng: 73.0479, country: '巴基斯坦', countryCode: 'PK' },
  { name: '卡拉奇', nameEn: 'Karachi', lat: 24.8607, lng: 67.0011, country: '巴基斯坦', countryCode: 'PK' },
  
  // ==================== 中东 ====================
  { name: '迪拜', nameEn: 'Dubai', lat: 25.2048, lng: 55.2708, country: '阿联酋', countryCode: 'AE' },
  { name: '阿布扎比', nameEn: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, country: '阿联酋', countryCode: 'AE' },
  { name: '多哈', nameEn: 'Doha', lat: 25.2854, lng: 51.5310, country: '卡塔尔', countryCode: 'QA' },
  { name: '利雅得', nameEn: 'Riyadh', lat: 24.7136, lng: 46.6753, country: '沙特阿拉伯', countryCode: 'SA' },
  { name: '吉达', nameEn: 'Jeddah', lat: 21.4858, lng: 39.1925, country: '沙特阿拉伯', countryCode: 'SA' },
  { name: '伊斯坦布尔', nameEn: 'Istanbul', lat: 41.0082, lng: 28.9784, country: '土耳其', countryCode: 'TR' },
  { name: '安卡拉', nameEn: 'Ankara', lat: 39.9334, lng: 32.8597, country: '土耳其', countryCode: 'TR' },
  { name: '特拉维夫', nameEn: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: '以色列', countryCode: 'IL' },
  { name: '耶路撒冷', nameEn: 'Jerusalem', lat: 31.7683, lng: 35.2137, country: '以色列', countryCode: 'IL' },
  { name: '贝鲁特', nameEn: 'Beirut', lat: 33.8938, lng: 35.5018, country: '黎巴嫩', countryCode: 'LB' },
  { name: '安曼', nameEn: 'Amman', lat: 31.9454, lng: 35.9284, country: '约旦', countryCode: 'JO' },
  { name: '科威特城', nameEn: 'Kuwait City', lat: 29.3759, lng: 47.9774, country: '科威特', countryCode: 'KW' },
  { name: '巴林', nameEn: 'Manama', lat: 26.2285, lng: 50.5860, country: '巴林', countryCode: 'BH' },
  { name: '马斯喀特', nameEn: 'Muscat', lat: 23.5880, lng: 58.3829, country: '阿曼', countryCode: 'OM' },
  { name: '德黑兰', nameEn: 'Tehran', lat: 35.6892, lng: 51.3890, country: '伊朗', countryCode: 'IR' },
  { name: '巴格达', nameEn: 'Baghdad', lat: 33.3152, lng: 44.3661, country: '伊拉克', countryCode: 'IQ' },
  
  // ==================== 欧洲 ====================
  // 英国
  { name: '伦敦', nameEn: 'London', lat: 51.5074, lng: -0.1278, country: '英国', countryCode: 'GB' },
  { name: '曼彻斯特', nameEn: 'Manchester', lat: 53.4808, lng: -2.2426, country: '英国', countryCode: 'GB' },
  { name: '伯明翰', nameEn: 'Birmingham', lat: 52.4862, lng: -1.8904, country: '英国', countryCode: 'GB' },
  { name: '爱丁堡', nameEn: 'Edinburgh', lat: 55.9533, lng: -3.1883, country: '英国', countryCode: 'GB' },
  { name: '格拉斯哥', nameEn: 'Glasgow', lat: 55.8642, lng: -4.2518, country: '英国', countryCode: 'GB' },
  { name: '利物浦', nameEn: 'Liverpool', lat: 53.4084, lng: -2.9916, country: '英国', countryCode: 'GB' },
  
  // 法国
  { name: '巴黎', nameEn: 'Paris', lat: 48.8566, lng: 2.3522, country: '法国', countryCode: 'FR' },
  { name: '马赛', nameEn: 'Marseille', lat: 43.2965, lng: 5.3698, country: '法国', countryCode: 'FR' },
  { name: '里昂', nameEn: 'Lyon', lat: 45.7640, lng: 4.8357, country: '法国', countryCode: 'FR' },
  { name: '尼斯', nameEn: 'Nice', lat: 43.7102, lng: 7.2620, country: '法国', countryCode: 'FR' },
  { name: '波尔多', nameEn: 'Bordeaux', lat: 44.8378, lng: -0.5792, country: '法国', countryCode: 'FR' },
  { name: '斯特拉斯堡', nameEn: 'Strasbourg', lat: 48.5734, lng: 7.7521, country: '法国', countryCode: 'FR' },
  
  // 德国
  { name: '柏林', nameEn: 'Berlin', lat: 52.5200, lng: 13.4050, country: '德国', countryCode: 'DE' },
  { name: '慕尼黑', nameEn: 'Munich', lat: 48.1351, lng: 11.5820, country: '德国', countryCode: 'DE' },
  { name: '法兰克福', nameEn: 'Frankfurt', lat: 50.1109, lng: 8.6821, country: '德国', countryCode: 'DE' },
  { name: '汉堡', nameEn: 'Hamburg', lat: 53.5511, lng: 9.9937, country: '德国', countryCode: 'DE' },
  { name: '科隆', nameEn: 'Cologne', lat: 50.9375, lng: 6.9603, country: '德国', countryCode: 'DE' },
  { name: '斯图加特', nameEn: 'Stuttgart', lat: 48.7758, lng: 9.1829, country: '德国', countryCode: 'DE' },
  { name: '杜塞尔多夫', nameEn: 'Dusseldorf', lat: 51.2277, lng: 6.7735, country: '德国', countryCode: 'DE' },
  
  // 意大利
  { name: '罗马', nameEn: 'Rome', lat: 41.9028, lng: 12.4964, country: '意大利', countryCode: 'IT' },
  { name: '米兰', nameEn: 'Milan', lat: 45.4642, lng: 9.1900, country: '意大利', countryCode: 'IT' },
  { name: '威尼斯', nameEn: 'Venice', lat: 45.4408, lng: 12.3155, country: '意大利', countryCode: 'IT' },
  { name: '佛罗伦萨', nameEn: 'Florence', lat: 43.7696, lng: 11.2558, country: '意大利', countryCode: 'IT' },
  { name: '那不勒斯', nameEn: 'Naples', lat: 40.8518, lng: 14.2681, country: '意大利', countryCode: 'IT' },
  { name: '都灵', nameEn: 'Turin', lat: 45.0703, lng: 7.6869, country: '意大利', countryCode: 'IT' },
  
  // 西班牙
  { name: '马德里', nameEn: 'Madrid', lat: 40.4168, lng: -3.7038, country: '西班牙', countryCode: 'ES' },
  { name: '巴塞罗那', nameEn: 'Barcelona', lat: 41.3851, lng: 2.1734, country: '西班牙', countryCode: 'ES' },
  { name: '塞维利亚', nameEn: 'Seville', lat: 37.3891, lng: -5.9845, country: '西班牙', countryCode: 'ES' },
  { name: '瓦伦西亚', nameEn: 'Valencia', lat: 39.4699, lng: -0.3763, country: '西班牙', countryCode: 'ES' },
  { name: '马拉加', nameEn: 'Malaga', lat: 36.7213, lng: -4.4214, country: '西班牙', countryCode: 'ES' },
  
  // 葡萄牙
  { name: '里斯本', nameEn: 'Lisbon', lat: 38.7223, lng: -9.1393, country: '葡萄牙', countryCode: 'PT' },
  { name: '波尔图', nameEn: 'Porto', lat: 41.1579, lng: -8.6291, country: '葡萄牙', countryCode: 'PT' },
  
  // 荷兰
  { name: '阿姆斯特丹', nameEn: 'Amsterdam', lat: 52.3676, lng: 4.9041, country: '荷兰', countryCode: 'NL' },
  { name: '鹿特丹', nameEn: 'Rotterdam', lat: 51.9244, lng: 4.4777, country: '荷兰', countryCode: 'NL' },
  { name: '海牙', nameEn: 'The Hague', lat: 52.0705, lng: 4.3007, country: '荷兰', countryCode: 'NL' },
  
  // 比利时
  { name: '布鲁塞尔', nameEn: 'Brussels', lat: 50.8503, lng: 4.3517, country: '比利时', countryCode: 'BE' },
  
  // 瑞士
  { name: '苏黎世', nameEn: 'Zurich', lat: 47.3769, lng: 8.5417, country: '瑞士', countryCode: 'CH' },
  { name: '日内瓦', nameEn: 'Geneva', lat: 46.2044, lng: 6.1432, country: '瑞士', countryCode: 'CH' },
  { name: '伯尔尼', nameEn: 'Bern', lat: 46.9480, lng: 7.4474, country: '瑞士', countryCode: 'CH' },
  
  // 奥地利
  { name: '维也纳', nameEn: 'Vienna', lat: 48.2082, lng: 16.3738, country: '奥地利', countryCode: 'AT' },
  { name: '萨尔茨堡', nameEn: 'Salzburg', lat: 47.8095, lng: 13.0550, country: '奥地利', countryCode: 'AT' },
  
  // 北欧
  { name: '哥本哈根', nameEn: 'Copenhagen', lat: 55.6761, lng: 12.5683, country: '丹麦', countryCode: 'DK' },
  { name: '斯德哥尔摩', nameEn: 'Stockholm', lat: 59.3293, lng: 18.0686, country: '瑞典', countryCode: 'SE' },
  { name: '奥斯陆', nameEn: 'Oslo', lat: 59.9139, lng: 10.7522, country: '挪威', countryCode: 'NO' },
  { name: '赫尔辛基', nameEn: 'Helsinki', lat: 60.1699, lng: 24.9384, country: '芬兰', countryCode: 'FI' },
  { name: '雷克雅未克', nameEn: 'Reykjavik', lat: 64.1466, lng: -21.9426, country: '冰岛', countryCode: 'IS' },
  
  // 东欧
  { name: '莫斯科', nameEn: 'Moscow', lat: 55.7558, lng: 37.6173, country: '俄罗斯', countryCode: 'RU' },
  { name: '圣彼得堡', nameEn: 'Saint Petersburg', lat: 59.9343, lng: 30.3351, country: '俄罗斯', countryCode: 'RU' },
  { name: '布拉格', nameEn: 'Prague', lat: 50.0755, lng: 14.4378, country: '捷克', countryCode: 'CZ' },
  { name: '华沙', nameEn: 'Warsaw', lat: 52.2297, lng: 21.0122, country: '波兰', countryCode: 'PL' },
  { name: '布达佩斯', nameEn: 'Budapest', lat: 47.4979, lng: 19.0402, country: '匈牙利', countryCode: 'HU' },
  { name: '雅典', nameEn: 'Athens', lat: 37.9838, lng: 23.7275, country: '希腊', countryCode: 'GR' },
  { name: '贝尔格莱德', nameEn: 'Belgrade', lat: 44.7866, lng: 20.4489, country: '塞尔维亚', countryCode: 'RS' },
  { name: '布加勒斯特', nameEn: 'Bucharest', lat: 44.4268, lng: 26.1025, country: '罗马尼亚', countryCode: 'RO' },
  { name: '索菲亚', nameEn: 'Sofia', lat: 42.6977, lng: 23.3219, country: '保加利亚', countryCode: 'BG' },
  { name: '萨格勒布', nameEn: 'Zagreb', lat: 45.8150, lng: 15.9819, country: '克罗地亚', countryCode: 'HR' },
  { name: '卢布尔雅那', nameEn: 'Ljubljana', lat: 46.0569, lng: 14.5058, country: '斯洛文尼亚', countryCode: 'SI' },
  { name: '布拉迪斯拉发', nameEn: 'Bratislava', lat: 48.1486, lng: 17.1077, country: '斯洛伐克', countryCode: 'SK' },
  { name: '塔林', nameEn: 'Tallinn', lat: 59.4370, lng: 24.7536, country: '爱沙尼亚', countryCode: 'EE' },
  { name: '里加', nameEn: 'Riga', lat: 56.9496, lng: 24.1052, country: '拉脱维亚', countryCode: 'LV' },
  { name: '维尔纽斯', nameEn: 'Vilnius', lat: 54.6872, lng: 25.2797, country: '立陶宛', countryCode: 'LT' },
  
  // ==================== 北美洲 ====================
  // 美国
  { name: '纽约', nameEn: 'New York', lat: 40.7128, lng: -74.0060, country: '美国', countryCode: 'US' },
  { name: '洛杉矶', nameEn: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: '美国', countryCode: 'US' },
  { name: '旧金山', nameEn: 'San Francisco', lat: 37.7749, lng: -122.4194, country: '美国', countryCode: 'US' },
  { name: '芝加哥', nameEn: 'Chicago', lat: 41.8781, lng: -87.6298, country: '美国', countryCode: 'US' },
  { name: '华盛顿', nameEn: 'Washington D.C.', lat: 38.9072, lng: -77.0369, country: '美国', countryCode: 'US' },
  { name: '波士顿', nameEn: 'Boston', lat: 42.3601, lng: -71.0589, country: '美国', countryCode: 'US' },
  { name: '西雅图', nameEn: 'Seattle', lat: 47.6062, lng: -122.3321, country: '美国', countryCode: 'US' },
  { name: '迈阿密', nameEn: 'Miami', lat: 25.7617, lng: -80.1918, country: '美国', countryCode: 'US' },
  { name: '拉斯维加斯', nameEn: 'Las Vegas', lat: 36.1699, lng: -115.1398, country: '美国', countryCode: 'US' },
  { name: '圣地亚哥', nameEn: 'San Diego', lat: 32.7157, lng: -117.1611, country: '美国', countryCode: 'US' },
  { name: '丹佛', nameEn: 'Denver', lat: 39.7392, lng: -104.9903, country: '美国', countryCode: 'US' },
  { name: '休斯顿', nameEn: 'Houston', lat: 29.7604, lng: -95.3698, country: '美国', countryCode: 'US' },
  { name: '达拉斯', nameEn: 'Dallas', lat: 32.7767, lng: -96.7970, country: '美国', countryCode: 'US' },
  { name: '亚特兰大', nameEn: 'Atlanta', lat: 33.7490, lng: -84.3880, country: '美国', countryCode: 'US' },
  { name: '费城', nameEn: 'Philadelphia', lat: 39.9526, lng: -75.1652, country: '美国', countryCode: 'US' },
  { name: '凤凰城', nameEn: 'Phoenix', lat: 33.4484, lng: -112.0740, country: '美国', countryCode: 'US' },
  { name: '圣地亚哥', nameEn: 'San Diego', lat: 32.7157, lng: -117.1611, country: '美国', countryCode: 'US' },
  { name: '奥兰多', nameEn: 'Orlando', lat: 28.5383, lng: -81.3792, country: '美国', countryCode: 'US' },
  { name: '檀香山', nameEn: 'Honolulu', lat: 21.3069, lng: -157.8583, country: '美国', countryCode: 'US' },
  { name: '底特律', nameEn: 'Detroit', lat: 42.3314, lng: -83.0458, country: '美国', countryCode: 'US' },
  { name: '明尼阿波利斯', nameEn: 'Minneapolis', lat: 44.9778, lng: -93.2650, country: '美国', countryCode: 'US' },
  { name: '纳什维尔', nameEn: 'Nashville', lat: 36.1627, lng: -86.7816, country: '美国', countryCode: 'US' },
  { name: '波特兰', nameEn: 'Portland', lat: 45.5155, lng: -122.6789, country: '美国', countryCode: 'US' },
  { name: '新奥尔良', nameEn: 'New Orleans', lat: 29.9511, lng: -90.0715, country: '美国', countryCode: 'US' },
  { name: '匹兹堡', nameEn: 'Pittsburgh', lat: 40.4406, lng: -79.9959, country: '美国', countryCode: 'US' },
  { name: '盐湖城', nameEn: 'Salt Lake City', lat: 40.7608, lng: -111.8910, country: '美国', countryCode: 'US' },
  { name: '奥斯汀', nameEn: 'Austin', lat: 30.2672, lng: -97.7431, country: '美国', countryCode: 'US' },
  
  // 加拿大
  { name: '温哥华', nameEn: 'Vancouver', lat: 49.2827, lng: -123.1207, country: '加拿大', countryCode: 'CA' },
  { name: '多伦多', nameEn: 'Toronto', lat: 43.6532, lng: -79.3832, country: '加拿大', countryCode: 'CA' },
  { name: '蒙特利尔', nameEn: 'Montreal', lat: 45.5017, lng: -73.5673, country: '加拿大', countryCode: 'CA' },
  { name: '渥太华', nameEn: 'Ottawa', lat: 45.4215, lng: -75.6972, country: '加拿大', countryCode: 'CA' },
  { name: '卡尔加里', nameEn: 'Calgary', lat: 51.0447, lng: -114.0719, country: '加拿大', countryCode: 'CA' },
  { name: '埃德蒙顿', nameEn: 'Edmonton', lat: 53.5461, lng: -113.4938, country: '加拿大', countryCode: 'CA' },
  { name: '魁北克城', nameEn: 'Quebec City', lat: 46.8139, lng: -71.2080, country: '加拿大', countryCode: 'CA' },
  
  // 墨西哥
  { name: '墨西哥城', nameEn: 'Mexico City', lat: 19.4326, lng: -99.1332, country: '墨西哥', countryCode: 'MX' },
  { name: '坎昆', nameEn: 'Cancun', lat: 21.1619, lng: -86.8515, country: '墨西哥', countryCode: 'MX' },
  { name: '瓜达拉哈拉', nameEn: 'Guadalajara', lat: 20.6597, lng: -103.3496, country: '墨西哥', countryCode: 'MX' },
  
  // ==================== 南美洲 ====================
  { name: '里约热内卢', nameEn: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, country: '巴西', countryCode: 'BR' },
  { name: '圣保罗', nameEn: 'Sao Paulo', lat: -23.5505, lng: -46.6333, country: '巴西', countryCode: 'BR' },
  { name: '巴西利亚', nameEn: 'Brasilia', lat: -15.7975, lng: -47.8919, country: '巴西', countryCode: 'BR' },
  { name: '布宜诺斯艾利斯', nameEn: 'Buenos Aires', lat: -34.6037, lng: -58.3816, country: '阿根廷', countryCode: 'AR' },
  { name: '圣地亚哥', nameEn: 'Santiago', lat: -33.4489, lng: -70.6693, country: '智利', countryCode: 'CL' },
  { name: '利马', nameEn: 'Lima', lat: -12.0464, lng: -77.0428, country: '秘鲁', countryCode: 'PE' },
  { name: '波哥大', nameEn: 'Bogota', lat: 4.7110, lng: -74.0721, country: '哥伦比亚', countryCode: 'CO' },
  { name: '基多', nameEn: 'Quito', lat: -0.1807, lng: -78.4678, country: '厄瓜多尔', countryCode: 'EC' },
  { name: '加拉加斯', nameEn: 'Caracas', lat: 10.4806, lng: -66.9036, country: '委内瑞拉', countryCode: 'VE' },
  { name: '蒙得维的亚', nameEn: 'Montevideo', lat: -34.9011, lng: -56.1645, country: '乌拉圭', countryCode: 'UY' },
  { name: '亚松森', nameEn: 'Asuncion', lat: -25.2637, lng: -57.5759, country: '巴拉圭', countryCode: 'PY' },
  { name: '拉巴斯', nameEn: 'La Paz', lat: -16.4897, lng: -68.1193, country: '玻利维亚', countryCode: 'BO' },
  
  // ==================== 大洋洲 ====================
  { name: '悉尼', nameEn: 'Sydney', lat: -33.8688, lng: 151.2093, country: '澳大利亚', countryCode: 'AU' },
  { name: '墨尔本', nameEn: 'Melbourne', lat: -37.8136, lng: 144.9631, country: '澳大利亚', countryCode: 'AU' },
  { name: '布里斯班', nameEn: 'Brisbane', lat: -27.4698, lng: 153.0251, country: '澳大利亚', countryCode: 'AU' },
  { name: '珀斯', nameEn: 'Perth', lat: -31.9505, lng: 115.8605, country: '澳大利亚', countryCode: 'AU' },
  { name: '阿德莱德', nameEn: 'Adelaide', lat: -34.9285, lng: 138.6007, country: '澳大利亚', countryCode: 'AU' },
  { name: '堪培拉', nameEn: 'Canberra', lat: -35.2809, lng: 149.1300, country: '澳大利亚', countryCode: 'AU' },
  { name: '黄金海岸', nameEn: 'Gold Coast', lat: -28.0167, lng: 153.4000, country: '澳大利亚', countryCode: 'AU' },
  { name: '奥克兰', nameEn: 'Auckland', lat: -36.8485, lng: 174.7633, country: '新西兰', countryCode: 'NZ' },
  { name: '惠灵顿', nameEn: 'Wellington', lat: -41.2865, lng: 174.7762, country: '新西兰', countryCode: 'NZ' },
  { name: '基督城', nameEn: 'Christchurch', lat: -43.5321, lng: 172.6362, country: '新西兰', countryCode: 'NZ' },
  { name: '皇后镇', nameEn: 'Queenstown', lat: -45.0312, lng: 168.6626, country: '新西兰', countryCode: 'NZ' },
  { name: '苏瓦', nameEn: 'Suva', lat: -18.1416, lng: 178.4419, country: '斐济', countryCode: 'FJ' },
  
  // ==================== 非洲 ====================
  { name: '开罗', nameEn: 'Cairo', lat: 30.0444, lng: 31.2357, country: '埃及', countryCode: 'EG' },
  { name: '开普敦', nameEn: 'Cape Town', lat: -33.9249, lng: 18.4241, country: '南非', countryCode: 'ZA' },
  { name: '约翰内斯堡', nameEn: 'Johannesburg', lat: -26.2041, lng: 28.0473, country: '南非', countryCode: 'ZA' },
  { name: '内罗毕', nameEn: 'Nairobi', lat: -1.2921, lng: 36.8219, country: '肯尼亚', countryCode: 'KE' },
  { name: '卡萨布兰卡', nameEn: 'Casablanca', lat: 33.5731, lng: -7.5898, country: '摩洛哥', countryCode: 'MA' },
  { name: '拉各斯', nameEn: 'Lagos', lat: 6.5244, lng: 3.3792, country: '尼日利亚', countryCode: 'NG' },
  { name: '阿克拉', nameEn: 'Accra', lat: 5.6037, lng: -0.1870, country: '加纳', countryCode: 'GH' },
  { name: '达喀尔', nameEn: 'Dakar', lat: 14.7167, lng: -17.4677, country: '塞内加尔', countryCode: 'SN' },
  { name: '亚的斯亚贝巴', nameEn: 'Addis Ababa', lat: 9.0250, lng: 38.7469, country: '埃塞俄比亚', countryCode: 'ET' },
  { name: '达累斯萨拉姆', nameEn: 'Dar es Salaam', lat: -6.7924, lng: 39.2083, country: '坦桑尼亚', countryCode: 'TZ' },
  { name: '坎帕拉', nameEn: 'Kampala', lat: 0.3476, lng: 32.5825, country: '乌干达', countryCode: 'UG' },
  { name: '金沙萨', nameEn: 'Kinshasa', lat: -4.4419, lng: 15.2663, country: '刚果民主共和国', countryCode: 'CD' },
  { name: '阿尔及尔', nameEn: 'Algiers', lat: 36.7538, lng: 3.0588, country: '阿尔及利亚', countryCode: 'DZ' },
  { name: '突尼斯', nameEn: 'Tunis', lat: 36.8065, lng: 10.1815, country: '突尼斯', countryCode: 'TN' },
  { name: '的黎波里', nameEn: 'Tripoli', lat: 32.8872, lng: 13.1913, country: '利比亚', countryCode: 'LY' },
  { name: '马普托', nameEn: 'Maputo', lat: -25.9692, lng: 32.5732, country: '莫桑比克', countryCode: 'MZ' },
  { name: '卢萨卡', nameEn: 'Lusaka', lat: -15.3875, lng: 28.3228, country: '赞比亚', countryCode: 'ZM' },
  { name: '哈拉雷', nameEn: 'Harare', lat: -17.8252, lng: 31.0335, country: '津巴布韦', countryCode: 'ZW' },
  
  // ==================== 更多中国城市 ====================
  // 旅游城市
  { name: '九寨沟', nameEn: 'Jiuzhaigou', lat: 33.2600, lng: 103.9200, country: '中国', countryCode: 'CN' },
  { name: '张家界', nameEn: 'Zhangjiajie', lat: 29.1170, lng: 110.4793, country: '中国', countryCode: 'CN' },
  { name: '黄山', nameEn: 'Huangshan', lat: 30.1375, lng: 118.1694, country: '中国', countryCode: 'CN' },
  { name: '泰山', nameEn: 'Mount Tai', lat: 36.2550, lng: 117.0950, country: '中国', countryCode: 'CN' },
  { name: '峨眉山', nameEn: 'Mount Emei', lat: 29.5199, lng: 103.3330, country: '中国', countryCode: 'CN' },
  { name: '庐山', nameEn: 'Mount Lu', lat: 29.5580, lng: 115.9850, country: '中国', countryCode: 'CN' },
  { name: '武夷山', nameEn: 'Mount Wuyi', lat: 27.7500, lng: 117.6800, country: '中国', countryCode: 'CN' },
  { name: '长白山', nameEn: 'Changbai Mountain', lat: 42.0060, lng: 128.0560, country: '中国', countryCode: 'CN' },
  { name: '桂林', nameEn: 'Guilin', lat: 25.2736, lng: 110.2900, country: '中国', countryCode: 'CN' },
  { name: '阳朔', nameEn: 'Yangshuo', lat: 24.7786, lng: 110.4966, country: '中国', countryCode: 'CN' },
  { name: '丽江', nameEn: 'Lijiang', lat: 26.8553, lng: 100.2271, country: '中国', countryCode: 'CN' },
  { name: '大理', nameEn: 'Dali', lat: 25.6065, lng: 100.2676, country: '中国', countryCode: 'CN' },
  { name: '西双版纳', nameEn: 'Xishuangbanna', lat: 22.0008, lng: 100.7948, country: '中国', countryCode: 'CN' },
  { name: '香格里拉', nameEn: 'Shangri-La', lat: 27.8299, lng: 99.7028, country: '中国', countryCode: 'CN' },
  { name: '三亚', nameEn: 'Sanya', lat: 18.2528, lng: 109.5120, country: '中国', countryCode: 'CN' },
  { name: '厦门', nameEn: 'Xiamen', lat: 24.4798, lng: 118.0894, country: '中国', countryCode: 'CN' },
  { name: '青岛', nameEn: 'Qingdao', lat: 36.0671, lng: 120.3826, country: '中国', countryCode: 'CN' },
  { name: '大连', nameEn: 'Dalian', lat: 38.9140, lng: 121.6147, country: '中国', countryCode: 'CN' },
  { name: '秦皇岛', nameEn: 'Qinhuangdao', lat: 39.9354, lng: 119.5977, country: '中国', countryCode: 'CN' },
  { name: '北戴河', nameEn: 'Beidaihe', lat: 39.8250, lng: 119.5150, country: '中国', countryCode: 'CN' },
  { name: '承德', nameEn: 'Chengde', lat: 40.9510, lng: 117.9633, country: '中国', countryCode: 'CN' },
  { name: '敦煌', nameEn: 'Dunhuang', lat: 40.1421, lng: 94.6619, country: '中国', countryCode: 'CN' },
  { name: '嘉峪关', nameEn: 'Jiayuguan', lat: 39.8112, lng: 98.2353, country: '中国', countryCode: 'CN' },
  { name: '吐鲁番', nameEn: 'Turpan', lat: 42.9476, lng: 89.1802, country: '中国', countryCode: 'CN' },
  { name: '喀什', nameEn: 'Kashgar', lat: 39.4704, lng: 75.9899, country: '中国', countryCode: 'CN' },
  { name: '伊犁', nameEn: 'Ili', lat: 43.9220, lng: 81.3296, country: '中国', countryCode: 'CN' },
  { name: '拉萨', nameEn: 'Lhasa', lat: 29.6500, lng: 91.1000, country: '中国', countryCode: 'CN' },
  { name: '林芝', nameEn: 'Nyingchi', lat: 29.6490, lng: 94.3620, country: '中国', countryCode: 'CN' },
  { name: '日喀则', nameEn: 'Shigatse', lat: 29.2670, lng: 88.8810, country: '中国', countryCode: 'CN' },
  { name: '凤凰', nameEn: 'Fenghuang', lat: 27.9480, lng: 109.5980, country: '中国', countryCode: 'CN' },
  { name: '平遥', nameEn: 'Pingyao', lat: 37.1890, lng: 112.1740, country: '中国', countryCode: 'CN' },
  { name: '乌镇', nameEn: 'Wuzhen', lat: 30.7440, lng: 120.4850, country: '中国', countryCode: 'CN' },
  { name: '周庄', nameEn: 'Zhouzhuang', lat: 31.1170, lng: 120.8440, country: '中国', countryCode: 'CN' },
  { name: '婺源', nameEn: 'Wuyuan', lat: 29.2480, lng: 117.8620, country: '中国', countryCode: 'CN' },
  { name: '宏村', nameEn: 'Hongcun', lat: 30.0050, lng: 117.9880, country: '中国', countryCode: 'CN' },
  { name: '景德镇', nameEn: 'Jingdezhen', lat: 29.2680, lng: 117.1780, country: '中国', countryCode: 'CN' },
  { name: '洛阳', nameEn: 'Luoyang', lat: 34.6197, lng: 112.4539, country: '中国', countryCode: 'CN' },
  { name: '开封', nameEn: 'Kaifeng', lat: 34.7972, lng: 114.3076, country: '中国', countryCode: 'CN' },
  { name: '大同', nameEn: 'Datong', lat: 40.0763, lng: 113.3000, country: '中国', countryCode: 'CN' },
  { name: '五台山', nameEn: 'Mount Wutai', lat: 39.0250, lng: 113.5670, country: '中国', countryCode: 'CN' },
  { name: '曲阜', nameEn: 'Qufu', lat: 35.5960, lng: 116.9860, country: '中国', countryCode: 'CN' },
  { name: '峨眉山', nameEn: 'Emeishan', lat: 29.5199, lng: 103.3330, country: '中国', countryCode: 'CN' },
  { name: '乐山', nameEn: 'Leshan', lat: 29.5520, lng: 103.7656, country: '中国', countryCode: 'CN' },
  { name: '都江堰', nameEn: 'Dujiangyan', lat: 31.0020, lng: 103.6470, country: '中国', countryCode: 'CN' },
  { name: '青城山', nameEn: 'Mount Qingcheng', lat: 30.9000, lng: 103.5500, country: '中国', countryCode: 'CN' },
  { name: '黄果树', nameEn: 'Huangguoshu', lat: 25.9830, lng: 105.6670, country: '中国', countryCode: 'CN' },
  { name: '荔波', nameEn: 'Libo', lat: 25.4120, lng: 107.8890, country: '中国', countryCode: 'CN' },
  { name: '镇远', nameEn: 'Zhenyuan', lat: 27.0490, lng: 108.3330, country: '中国', countryCode: 'CN' },
  { name: '西江', nameEn: 'Xijiang', lat: 26.5050, lng: 108.1830, country: '中国', countryCode: 'CN' },
  { name: '恩施', nameEn: 'Enshi', lat: 30.2720, lng: 109.4880, country: '中国', countryCode: 'CN' },
  { name: '神农架', nameEn: 'Shennongjia', lat: 31.7440, lng: 110.6800, country: '中国', countryCode: 'CN' },
  { name: '武当山', nameEn: 'Mount Wudang', lat: 32.4030, lng: 111.0030, country: '中国', countryCode: 'CN' },
  { name: '衡山', nameEn: 'Mount Heng', lat: 27.2500, lng: 112.8600, country: '中国', countryCode: 'CN' },
  { name: '华山', nameEn: 'Mount Hua', lat: 34.4750, lng: 110.0900, country: '中国', countryCode: 'CN' },
  { name: '嵩山', nameEn: 'Mount Song', lat: 34.4500, lng: 112.9350, country: '中国', countryCode: 'CN' },
  
  // 更多中国地级市
  { name: '常州', nameEn: 'Changzhou', lat: 31.8107, lng: 119.9742, country: '中国', countryCode: 'CN' },
  { name: '徐州', nameEn: 'Xuzhou', lat: 34.2610, lng: 117.1949, country: '中国', countryCode: 'CN' },
  { name: '潍坊', nameEn: 'Weifang', lat: 36.7068, lng: 119.1618, country: '中国', countryCode: 'CN' },
  { name: '临沂', nameEn: 'Linyi', lat: 35.1046, lng: 118.3563, country: '中国', countryCode: 'CN' },
  { name: '淄博', nameEn: 'Zibo', lat: 36.8131, lng: 118.0548, country: '中国', countryCode: 'CN' },
  { name: '绵阳', nameEn: 'Mianyang', lat: 31.4678, lng: 104.7418, country: '中国', countryCode: 'CN' },
  { name: '宜宾', nameEn: 'Yibin', lat: 28.7513, lng: 104.6417, country: '中国', countryCode: 'CN' },
  { name: '泸州', nameEn: 'Luzhou', lat: 28.8717, lng: 105.4423, country: '中国', countryCode: 'CN' },
  { name: '宜昌', nameEn: 'Yichang', lat: 30.6917, lng: 111.2865, country: '中国', countryCode: 'CN' },
  { name: '襄阳', nameEn: 'Xiangyang', lat: 32.0090, lng: 112.1225, country: '中国', countryCode: 'CN' },
  { name: '岳阳', nameEn: 'Yueyang', lat: 29.3572, lng: 113.1290, country: '中国', countryCode: 'CN' },
  { name: '常德', nameEn: 'Changde', lat: 29.0316, lng: 111.6987, country: '中国', countryCode: 'CN' },
  { name: '九江', nameEn: 'Jiujiang', lat: 29.7050, lng: 116.0010, country: '中国', countryCode: 'CN' },
  { name: '赣州', nameEn: 'Ganzhou', lat: 25.8310, lng: 114.9330, country: '中国', countryCode: 'CN' },
  { name: '上饶', nameEn: 'Shangrao', lat: 28.4550, lng: 117.9430, country: '中国', countryCode: 'CN' },
  { name: '宜昌', nameEn: 'Yichang', lat: 30.6917, lng: 111.2865, country: '中国', countryCode: 'CN' },
  { name: '荆州', nameEn: 'Jingzhou', lat: 30.3261, lng: 112.2389, country: '中国', countryCode: 'CN' },
  { name: '株洲', nameEn: 'Zhuzhou', lat: 27.8277, lng: 113.1338, country: '中国', countryCode: 'CN' },
  { name: '柳州', nameEn: 'Liuzhou', lat: 24.3254, lng: 109.4158, country: '中国', countryCode: 'CN' },
  { name: '北海', nameEn: 'Beihai', lat: 21.4812, lng: 109.1201, country: '中国', countryCode: 'CN' },
  { name: '泉州', nameEn: 'Quanzhou', lat: 24.8741, lng: 118.6757, country: '中国', countryCode: 'CN' },
  { name: '漳州', nameEn: 'Zhangzhou', lat: 24.5130, lng: 117.6471, country: '中国', countryCode: 'CN' },
  { name: '莆田', nameEn: 'Putian', lat: 25.4540, lng: 119.0077, country: '中国', countryCode: 'CN' },
  { name: '宁德', nameEn: 'Ningde', lat: 26.6567, lng: 119.5479, country: '中国', countryCode: 'CN' },
  { name: '漳州', nameEn: 'Zhangzhou', lat: 24.5130, lng: 117.6471, country: '中国', countryCode: 'CN' },
  { name: '龙岩', nameEn: 'Longyan', lat: 25.0751, lng: 117.0175, country: '中国', countryCode: 'CN' },
  { name: '三明', nameEn: 'Sanming', lat: 26.2634, lng: 117.6387, country: '中国', countryCode: 'CN' },
  { name: '南平', nameEn: 'Nanping', lat: 26.6357, lng: 118.1782, country: '中国', countryCode: 'CN' },
  { name: '芜湖', nameEn: 'Wuhu', lat: 31.3526, lng: 118.3765, country: '中国', countryCode: 'CN' },
  { name: '蚌埠', nameEn: 'Bengbu', lat: 32.9166, lng: 117.3887, country: '中国', countryCode: 'CN' },
  { name: '阜阳', nameEn: 'Fuyang', lat: 32.8902, lng: 115.8142, country: '中国', countryCode: 'CN' },
  { name: '安庆', nameEn: 'Anqing', lat: 30.5430, lng: 117.0632, country: '中国', countryCode: 'CN' },
  { name: '马鞍山', nameEn: "Ma'anshan", lat: 31.6705, lng: 118.5070, country: '中国', countryCode: 'CN' },
  { name: '淮南', nameEn: 'Huainan', lat: 32.6417, lng: 117.0186, country: '中国', countryCode: 'CN' },
  { name: '淮北', nameEn: 'Huaibei', lat: 33.9558, lng: 116.7983, country: '中国', countryCode: 'CN' },
  { name: '铜陵', nameEn: 'Tongling', lat: 30.9450, lng: 117.8120, country: '中国', countryCode: 'CN' },
  { name: '宣城', nameEn: 'Xuancheng', lat: 30.9400, lng: 118.7580, country: '中国', countryCode: 'CN' },
  { name: '池州', nameEn: 'Chizhou', lat: 30.6650, lng: 117.4910, country: '中国', countryCode: 'CN' },
  { name: '亳州', nameEn: 'Bozhou', lat: 33.8450, lng: 115.7790, country: '中国', countryCode: 'CN' },
  { name: '宿州', nameEn: 'Suzhou', lat: 33.6340, lng: 116.9640, country: '中国', countryCode: 'CN' },
  { name: '六安', nameEn: "Lu'an", lat: 31.7350, lng: 116.5210, country: '中国', countryCode: 'CN' },
  { name: '滁州', nameEn: 'Chuzhou', lat: 32.3010, lng: 118.3170, country: '中国', countryCode: 'CN' },
  { name: '巢湖', nameEn: 'Chaohu', lat: 31.6000, lng: 117.8670, country: '中国', countryCode: 'CN' },
  { name: '黄山市', nameEn: 'Huangshan City', lat: 29.7150, lng: 118.3380, country: '中国', countryCode: 'CN' },
  
  // ==================== 更多国际城市 ====================
  // 亚洲补充
  { name: '清迈', nameEn: 'Chiang Mai', lat: 18.7883, lng: 98.9853, country: '泰国', countryCode: 'TH' },
  { name: '普吉', nameEn: 'Phuket', lat: 7.8804, lng: 98.3923, country: '泰国', countryCode: 'TH' },
  { name: '芭提雅', nameEn: 'Pattaya', lat: 12.9236, lng: 100.8825, country: '泰国', countryCode: 'TH' },
  { name: '甲米', nameEn: 'Krabi', lat: 8.0863, lng: 98.9063, country: '泰国', countryCode: 'TH' },
  { name: '苏梅岛', nameEn: 'Koh Samui', lat: 9.5120, lng: 100.0130, country: '泰国', countryCode: 'TH' },
  { name: '琅勃拉邦', nameEn: 'Luang Prabang', lat: 19.8860, lng: 102.1350, country: '老挝', countryCode: 'LA' },
  { name: '暹粒', nameEn: 'Siem Reap', lat: 13.3633, lng: 103.8564, country: '柬埔寨', countryCode: 'KH' },
  { name: '西哈努克', nameEn: 'Sihanoukville', lat: 10.6280, lng: 103.5230, country: '柬埔寨', countryCode: 'KH' },
  { name: '美奈', nameEn: 'Mui Ne', lat: 10.9330, lng: 108.2830, country: '越南', countryCode: 'VN' },
  { name: '芽庄', nameEn: 'Nha Trang', lat: 12.2388, lng: 109.1967, country: '越南', countryCode: 'VN' },
  { name: '下龙湾', nameEn: 'Ha Long Bay', lat: 20.9100, lng: 107.1830, country: '越南', countryCode: 'VN' },
  { name: '宿务', nameEn: 'Cebu', lat: 10.3157, lng: 123.8854, country: '菲律宾', countryCode: 'PH' },
  { name: '长滩岛', nameEn: 'Boracay', lat: 11.9670, lng: 121.9240, country: '菲律宾', countryCode: 'PH' },
  { name: '巴厘岛库塔', nameEn: 'Kuta Bali', lat: -8.7180, lng: 115.1690, country: '印度尼西亚', countryCode: 'ID' },
  { name: '日惹', nameEn: 'Yogyakarta', lat: -7.7956, lng: 110.3695, country: '印度尼西亚', countryCode: 'ID' },
  { name: '万隆', nameEn: 'Bandung', lat: -6.9175, lng: 107.6191, country: '印度尼西亚', countryCode: 'ID' },
  { name: '马尔代夫', nameEn: 'Male', lat: 4.1755, lng: 73.5093, country: '马尔代夫', countryCode: 'MV' },
  { name: '博卡拉', nameEn: 'Pokhara', lat: 28.2096, lng: 83.9856, country: '尼泊尔', countryCode: 'NP' },
  { name: '瓦拉纳西', nameEn: 'Varanasi', lat: 25.3176, lng: 83.0068, country: '印度', countryCode: 'IN' },
  { name: '阿格拉', nameEn: 'Agra', lat: 27.1767, lng: 78.0081, country: '印度', countryCode: 'IN' },
  { name: '斋浦尔', nameEn: 'Jaipur', lat: 26.9124, lng: 75.7873, country: '印度', countryCode: 'IN' },
  { name: '果阿', nameEn: 'Goa', lat: 15.2993, lng: 74.1240, country: '印度', countryCode: 'IN' },
  { name: '乌代浦', nameEn: 'Udaipur', lat: 24.5854, lng: 73.7125, country: '印度', countryCode: 'IN' },
  { name: '杰伊瑟尔梅尔', nameEn: 'Jaisalmer', lat: 26.9157, lng: 70.9083, country: '印度', countryCode: 'IN' },
  { name: '斯里兰卡康提', nameEn: 'Kandy', lat: 7.2906, lng: 80.6337, country: '斯里兰卡', countryCode: 'LK' },
  { name: '斯里兰卡加勒', nameEn: 'Galle', lat: 6.0535, lng: 80.2210, country: '斯里兰卡', countryCode: 'LK' },
  
  // 欧洲补充
  { name: '佛罗伦萨', nameEn: 'Florence', lat: 43.7696, lng: 11.2558, country: '意大利', countryCode: 'IT' },
  { name: '五渔村', nameEn: 'Cinque Terre', lat: 44.1460, lng: 9.6430, country: '意大利', countryCode: 'IT' },
  { name: '阿马尔菲', nameEn: 'Amalfi', lat: 40.6340, lng: 14.6027, country: '意大利', countryCode: 'IT' },
  { name: '比萨', nameEn: 'Pisa', lat: 43.7228, lng: 10.4017, country: '意大利', countryCode: 'IT' },
  { name: '博洛尼亚', nameEn: 'Bologna', lat: 44.4949, lng: 11.3426, country: '意大利', countryCode: 'IT' },
  { name: '维罗纳', nameEn: 'Verona', lat: 45.4384, lng: 10.9916, country: '意大利', countryCode: 'IT' },
  { name: '西西里', nameEn: 'Sicily', lat: 37.5994, lng: 14.0154, country: '意大利', countryCode: 'IT' },
  { name: '圣托里尼', nameEn: 'Santorini', lat: 36.3932, lng: 25.4615, country: '希腊', countryCode: 'GR' },
  { name: '米科诺斯', nameEn: 'Mykonos', lat: 37.4467, lng: 25.3289, country: '希腊', countryCode: 'GR' },
  { name: '克里特', nameEn: 'Crete', lat: 35.2401, lng: 24.4709, country: '希腊', countryCode: 'GR' },
  { name: '杜布罗夫尼克', nameEn: 'Dubrovnik', lat: 42.6507, lng: 18.0944, country: '克罗地亚', countryCode: 'HR' },
  { name: '斯普利特', nameEn: 'Split', lat: 43.5081, lng: 16.4402, country: '克罗地亚', countryCode: 'HR' },
  { name: '十六湖', nameEn: 'Plitvice Lakes', lat: 44.8654, lng: 15.5820, country: '克罗地亚', countryCode: 'HR' },
  { name: '格拉纳达', nameEn: 'Granada', lat: 37.1773, lng: -3.5986, country: '西班牙', countryCode: 'ES' },
  { name: '圣塞巴斯蒂安', nameEn: 'San Sebastian', lat: 43.3183, lng: -1.9812, country: '西班牙', countryCode: 'ES' },
  { name: '托莱多', nameEn: 'Toledo', lat: 39.8628, lng: -4.0273, country: '西班牙', countryCode: 'ES' },
  { name: '科尔多瓦', nameEn: 'Cordoba', lat: 37.8882, lng: -4.7794, country: '西班牙', countryCode: 'ES' },
  { name: '塞维利亚', nameEn: 'Seville', lat: 37.3891, lng: -5.9845, country: '西班牙', countryCode: 'ES' },
  { name: '尼斯', nameEn: 'Nice', lat: 43.7102, lng: 7.2620, country: '法国', countryCode: 'FR' },
  { name: '戛纳', nameEn: 'Cannes', lat: 43.5528, lng: 7.0174, country: '法国', countryCode: 'FR' },
  { name: '普罗旺斯', nameEn: 'Provence', lat: 43.9493, lng: 6.0679, country: '法国', countryCode: 'FR' },
  { name: '里昂', nameEn: 'Lyon', lat: 45.7640, lng: 4.8357, country: '法国', countryCode: 'FR' },
  { name: '马赛', nameEn: 'Marseille', lat: 43.2965, lng: 5.3698, country: '法国', countryCode: 'FR' },
  { name: '布鲁日', nameEn: 'Bruges', lat: 51.2093, lng: 3.2247, country: '比利时', countryCode: 'BE' },
  { name: '安特卫普', nameEn: 'Antwerp', lat: 51.2194, lng: 4.4025, country: '比利时', countryCode: 'BE' },
  { name: '卢森堡', nameEn: 'Luxembourg', lat: 49.6116, lng: 6.1319, country: '卢森堡', countryCode: 'LU' },
  { name: '因特拉肯', nameEn: 'Interlaken', lat: 46.6863, lng: 7.8632, country: '瑞士', countryCode: 'CH' },
  { name: '卢塞恩', nameEn: 'Lucerne', lat: 47.0502, lng: 8.3093, country: '瑞士', countryCode: 'CH' },
  { name: '采尔马特', nameEn: 'Zermatt', lat: 46.0207, lng: 7.7491, country: '瑞士', countryCode: 'CH' },
  { name: '少女峰', nameEn: 'Jungfrau', lat: 46.5370, lng: 7.9630, country: '瑞士', countryCode: 'CH' },
  { name: '慕尼黑', nameEn: 'Munich', lat: 48.1351, lng: 11.5820, country: '德国', countryCode: 'DE' },
  { name: '海德堡', nameEn: 'Heidelberg', lat: 49.3988, lng: 8.6724, country: '德国', countryCode: 'DE' },
  { name: '新天鹅堡', nameEn: 'Neuschwanstein', lat: 47.5576, lng: 10.7498, country: '德国', countryCode: 'DE' },
  { name: '罗滕堡', nameEn: 'Rothenburg', lat: 49.3769, lng: 10.1789, country: '德国', countryCode: 'DE' },
  { name: '纽伦堡', nameEn: 'Nuremberg', lat: 49.4521, lng: 11.0767, country: '德国', countryCode: 'DE' },
  { name: '德累斯顿', nameEn: 'Dresden', lat: 51.0504, lng: 13.7373, country: '德国', countryCode: 'DE' },
  { name: '维也纳', nameEn: 'Vienna', lat: 48.2082, lng: 16.3738, country: '奥地利', countryCode: 'AT' },
  { name: '萨尔茨堡', nameEn: 'Salzburg', lat: 47.8095, lng: 13.0550, country: '奥地利', countryCode: 'AT' },
  { name: '哈尔施塔特', nameEn: 'Hallstatt', lat: 47.5622, lng: 13.6493, country: '奥地利', countryCode: 'AT' },
  { name: '克拉科夫', nameEn: 'Krakow', lat: 50.0647, lng: 19.9450, country: '波兰', countryCode: 'PL' },
  { name: '布拉迪斯拉发', nameEn: 'Bratislava', lat: 48.1486, lng: 17.1077, country: '斯洛伐克', countryCode: 'SK' },
  { name: '塔林', nameEn: 'Tallinn', lat: 59.4370, lng: 24.7536, country: '爱沙尼亚', countryCode: 'EE' },
  { name: '里加', nameEn: 'Riga', lat: 56.9496, lng: 24.1052, country: '拉脱维亚', countryCode: 'LV' },
  { name: '维尔纽斯', nameEn: 'Vilnius', lat: 54.6872, lng: 25.2797, country: '立陶宛', countryCode: 'LT' },
  { name: '赫尔辛基', nameEn: 'Helsinki', lat: 60.1699, lng: 24.9384, country: '芬兰', countryCode: 'FI' },
  { name: '罗瓦涅米', nameEn: 'Rovaniemi', lat: 66.5039, lng: 25.7294, country: '芬兰', countryCode: 'FI' },
  { name: '卑尔根', nameEn: 'Bergen', lat: 60.3913, lng: 5.3221, country: '挪威', countryCode: 'NO' },
  { name: '特罗姆瑟', nameEn: 'Tromso', lat: 69.6492, lng: 18.9553, country: '挪威', countryCode: 'NO' },
  { name: '哥德堡', nameEn: 'Gothenburg', lat: 57.7089, lng: 11.9746, country: '瑞典', countryCode: 'SE' },
  { name: '马尔默', nameEn: 'Malmo', lat: 55.6049, lng: 13.0038, country: '瑞典', countryCode: 'SE' },
  { name: '雷克雅未克', nameEn: 'Reykjavik', lat: 64.1466, lng: -21.9426, country: '冰岛', countryCode: 'IS' },
  
  // 北美补充
  { name: '檀香山', nameEn: 'Honolulu', lat: 21.3069, lng: -157.8583, country: '美国', countryCode: 'US' },
  { name: '安克雷奇', nameEn: 'Anchorage', lat: 61.2181, lng: -149.9003, country: '美国', countryCode: 'US' },
  { name: '基韦斯特', nameEn: 'Key West', lat: 24.5551, lng: -81.7800, country: '美国', countryCode: 'US' },
  { name: '圣安东尼奥', nameEn: 'San Antonio', lat: 29.4241, lng: -98.4936, country: '美国', countryCode: 'US' },
  { name: '圣何塞', nameEn: 'San Jose', lat: 37.3382, lng: -121.8863, country: '美国', countryCode: 'US' },
  { name: '印第安纳波利斯', nameEn: 'Indianapolis', lat: 39.7684, lng: -86.1581, country: '美国', countryCode: 'US' },
  { name: '哥伦布', nameEn: 'Columbus', lat: 39.9612, lng: -82.9988, country: '美国', countryCode: 'US' },
  { name: '夏洛特', nameEn: 'Charlotte', lat: 35.2271, lng: -80.8431, country: '美国', countryCode: 'US' },
  { name: '印第安纳波利斯', nameEn: 'Indianapolis', lat: 39.7684, lng: -86.1581, country: '美国', countryCode: 'US' },
  { name: '旧金山', nameEn: 'San Francisco', lat: 37.7749, lng: -122.4194, country: '美国', countryCode: 'US' },
  { name: '蒙特利尔', nameEn: 'Montreal', lat: 45.5017, lng: -73.5673, country: '加拿大', countryCode: 'CA' },
  { name: '魁北克城', nameEn: 'Quebec City', lat: 46.8139, lng: -71.2080, country: '加拿大', countryCode: 'CA' },
  { name: '班夫', nameEn: 'Banff', lat: 51.1784, lng: -115.5708, country: '加拿大', countryCode: 'CA' },
  { name: '贾斯珀', nameEn: 'Jasper', lat: 52.8737, lng: -118.0814, country: '加拿大', countryCode: 'CA' },
  { name: '尼亚加拉瀑布', nameEn: 'Niagara Falls', lat: 43.0962, lng: -79.0377, country: '加拿大', countryCode: 'CA' },
  { name: '坎昆', nameEn: 'Cancun', lat: 21.1619, lng: -86.8515, country: '墨西哥', countryCode: 'MX' },
  { name: '墨西哥城', nameEn: 'Mexico City', lat: 19.4326, lng: -99.1332, country: '墨西哥', countryCode: 'MX' },
  { name: '瓦哈卡', nameEn: 'Oaxaca', lat: 17.0732, lng: -96.7266, country: '墨西哥', countryCode: 'MX' },
  { name: '蒂华纳', nameEn: 'Tijuana', lat: 32.5149, lng: -117.0382, country: '墨西哥', countryCode: 'MX' },
  
  // 南美补充
  { name: '里约热内卢', nameEn: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, country: '巴西', countryCode: 'BR' },
  { name: '伊瓜苏', nameEn: 'Iguazu Falls', lat: -25.6953, lng: -54.4367, country: '巴西', countryCode: 'BR' },
  { name: '萨尔瓦多', nameEn: 'Salvador', lat: -12.9714, lng: -38.5124, country: '巴西', countryCode: 'BR' },
  { name: '玛瑙斯', nameEn: 'Manaus', lat: -3.1190, lng: -60.0217, country: '巴西', countryCode: 'BR' },
  { name: '乌斯怀亚', nameEn: 'Ushuaia', lat: -54.8019, lng: -68.3030, country: '阿根廷', countryCode: 'AR' },
  { name: '门多萨', nameEn: 'Mendoza', lat: -32.8895, lng: -68.8458, country: '阿根廷', countryCode: 'AR' },
  { name: '巴里洛切', nameEn: 'Bariloche', lat: -41.1335, lng: -71.3103, country: '阿根廷', countryCode: 'AR' },
  { name: '库斯科', nameEn: 'Cusco', lat: -13.5320, lng: -71.9675, country: '秘鲁', countryCode: 'PE' },
  { name: '马丘比丘', nameEn: 'Machu Picchu', lat: -13.1631, lng: -72.5450, country: '秘鲁', countryCode: 'PE' },
  { name: '的的喀喀湖', nameEn: 'Lake Titicaca', lat: -15.8422, lng: -69.3330, country: '秘鲁', countryCode: 'PE' },
  { name: '加拉帕戈斯', nameEn: 'Galapagos', lat: -0.9538, lng: -90.9656, country: '厄瓜多尔', countryCode: 'EC' },
  { name: '百内', nameEn: 'Torres del Paine', lat: -51.2533, lng: -72.3460, country: '智利', countryCode: 'CL' },
  { name: '复活节岛', nameEn: 'Easter Island', lat: -27.1127, lng: -109.3497, country: '智利', countryCode: 'CL' },
  
  // 非洲补充
  { name: '马拉喀什', nameEn: 'Marrakech', lat: 31.6295, lng: -7.9811, country: '摩洛哥', countryCode: 'MA' },
  { name: '非斯', nameEn: 'Fes', lat: 34.0181, lng: -5.0078, country: '摩洛哥', countryCode: 'MA' },
  { name: '舍夫沙万', nameEn: 'Chefchaouen', lat: 35.1714, lng: -5.2697, country: '摩洛哥', countryCode: 'MA' },
  { name: '乞力马扎罗', nameEn: 'Kilimanjaro', lat: -3.0674, lng: 37.3556, country: '坦桑尼亚', countryCode: 'TZ' },
  { name: '桑给巴尔', nameEn: 'Zanzibar', lat: -6.1659, lng: 39.2026, country: '坦桑尼亚', countryCode: 'TZ' },
  { name: '马赛马拉', nameEn: 'Masai Mara', lat: -1.5060, lng: 35.1440, country: '肯尼亚', countryCode: 'KE' },
  { name: '维多利亚瀑布', nameEn: 'Victoria Falls', lat: -17.9243, lng: 25.8572, country: '赞比亚', countryCode: 'ZM' },
  { name: '好望角', nameEn: 'Cape of Good Hope', lat: -34.3568, lng: 18.4740, country: '南非', countryCode: 'ZA' },
  { name: '德班', nameEn: 'Durban', lat: -29.8587, lng: 31.0218, country: '南非', countryCode: 'ZA' },
  { name: '卢克索', nameEn: 'Luxor', lat: 25.6872, lng: 32.6396, country: '埃及', countryCode: 'EG' },
  { name: '阿斯旺', nameEn: 'Aswan', lat: 24.0889, lng: 32.8998, country: '埃及', countryCode: 'EG' },
  { name: '沙姆沙伊赫', nameEn: 'Sharm El Sheikh', lat: 27.9158, lng: 34.3300, country: '埃及', countryCode: 'EG' },
];

// 按名称查询城市
export function findCityByName(name) {
  const lowerName = name.toLowerCase();
  return CITIES_DATABASE.find(city => 
    city.name === name || 
    city.nameEn.toLowerCase() === lowerName ||
    city.nameEn.toLowerCase().includes(lowerName) ||
    lowerName.includes(city.nameEn.toLowerCase())
  );
}

// 按坐标查询最近的城市（阈值内）
export function findCityByCoordinates(lat, lng, thresholdKm = 50) {
  let closestCity = null;
  let minDistance = Infinity;

  for (const city of CITIES_DATABASE) {
    const distance = calculateDistance(lat, lng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }

  // 如果最近城市在阈值范围内，返回该城市
  if (closestCity && minDistance <= thresholdKm) {
    return { ...closestCity, distance: minDistance };
  }

  return null;
}

// 计算两点之间的距离（Haversine 公式，单位：公里）
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 地球半径（公里）
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// 获取数据库中的所有国家
export function getAllCountries() {
  const countries = new Set();
  CITIES_DATABASE.forEach(city => countries.add(city.country));
  return Array.from(countries);
}

// 获取数据库统计信息
export function getDatabaseStats() {
  const countries = new Set();
  CITIES_DATABASE.forEach(city => countries.add(city.country));
  return {
    totalCities: CITIES_DATABASE.length,
    totalCountries: countries.size
  };
}

// 导出数据库
export { CITIES_DATABASE };
export default CITIES_DATABASE;
