# Rome2Rio API 配置说明

## 获取 API Key

1. 访问 https://www.rome2rio.com/api/
2. 注册账号并登录
3. 创建新的 API Key
4. 复制 API Key

## 配置环境变量

在 `client` 目录下创建 `.env` 文件：

```env
VITE_ROME2RIO_API_KEY=your_api_key_here
```

## 免费额度

Rome2Rio 提供免费额度：
- 每月 500 次请求
- 足够个人使用

## 功能说明

配置 API Key 后：
- 费用估算会优先使用 API 返回的真实价格
- 如果 API 失败或未配置，自动回退到本地估算
- 查询结果会缓存 24 小时

## 未配置 API Key

如果未配置 API Key：
- 使用基于距离的估算值
- 驾车：0.8元/公里
- 火车：0.4元/公里
- 飞机：阶梯价格
