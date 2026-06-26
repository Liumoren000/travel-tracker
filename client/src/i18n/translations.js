// 语言包
const translations = {
  zh: {
    // 应用标题
    appName: '自由轨迹',
    
    // 搜索
    searchPlaceholder: '输入城市名称搜索...',
    searchPlaceholderMobile: '输入城市名称搜索...',
    
    // 交通方式
    driving: '驾车',
    train: '火车',
    flight: '飞机',
    walking: '步行',
    selectTransport: '选择交通方式',
    selectTransportDesc: '选择从前一个城市到达此城市的交通方式',
    addCity: '添加城市',
    cancel: '取消',
    confirm: '确定',
    
    // 路线
    currentRoute: '当前行程',
    cities: '个城市',
    clear: '清空',
    generateRoute: '生成轨迹',
    addToMap: '添加到地图',
    saveRoute: '保存路线',
    mapRoutes: '地图线路',
    import: '导入',
    export: '导出',
    removeAll: '清除',
    confirmRemoveAll: '确定清除所有线路？',
    
    // 地图
    mapClickAdd: '开启地图点击添加',
    exitMapClick: '退出地图点击添加',
    clickMapToAdd: '点击地图添加城市位置',
    exportImage: '导出图片',
    exporting: '导出中...',
    switchMapStyle: '切换地图样式',
    
    // 路线详情
    routeDetail: '线路详情',
    editRoute: '编辑线路',
    editRouteTag: '编辑中',
    saveEdit: '保存修改',
    close: '关闭',
    startPoint: '起点',
    endPoint: '终点',
    searchAddCity: '搜索并添加城市...',
    transportMode: '交通方式：',
    editTip: '提示：搜索添加城市，或开启"地图点击添加"后在地图上点击添加',
    moveUp: '上移',
    moveDown: '下移',
    delete: '删除',
    viewDetail: '查看详情',
    
    // 保存路线
    saveRouteTitle: '保存路线',
    inputRouteName: '请输入路线名称',
    save: '保存',
    saveSuccess: '路线保存成功',
    saveFailed: '路线保存失败',
    
    // 添加城市
    addCityTitle: '添加城市',
    position: '位置:',
    inputCityName: '请输入城市名称',
    add: '添加',
    addSuccess: '已添加城市:',
    
    // 历史记录
    history: '历史记录',
    refresh: '刷新',
    noHistory: '暂无历史记录',
    view: '查看',
    loadSuccess: '路线已加载到地图',
    loadFailed: '加载路线失败',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    
    // 统计
    countries: '个国家',
    citiesCount: '个城市',
    distance: '距离:',
    totalDistance: '总距离:',
    
    // 天气
    weather: '天气信息',
    currentWeather: '当前天气',
    feelsLike: '体感',
    humidity: '湿度',
    windSpeed: '风速',
    forecast: '未来天气',
    weatherFailed: '天气信息获取失败',
    loadingWeather: '加载天气中...',
    
    // 城市详情
    cityDetail: '城市详情',
    population: '人口:',
    attractions: '主要景点',
    viewOnWikipedia: '查看维基百科了解更多 →',
    noCityInfo: '暂无该城市的详细信息',
    loadingCityInfo: '加载城市信息中...',
    
    // 机票查询
    queryFlightPrice: '查询实时机票价格',
    queryFlightPriceDesc: '查询机票价格：',
    
    // 地图样式
    standard: '标准',
    satellite: '卫星',
    terrain: '地形',
    dark: '暗色',
    switchedTo: '已切换到',
    map: '地图',
    
    // 模式
    darkMode: '切换到深色模式',
    lightMode: '切换到浅色模式',
    
    // 消息
    pleaseAddTwoCities: '请至少添加两个城市',
    pleaseGenerateRoute: '请先生成轨迹',
    routeGenerated: '轨迹生成成功',
    routeGenerateFailed: '生成轨迹失败，请重试',
    addedToMap: '已添加到地图',
    clearedAllRoutes: '已清除所有线路',
    deletedCity: '已删除城市',
    exitedMapClickMode: '已退出地图点击添加模式',
    enteredMapClickMode: '已开启地图点击添加模式，请点击地图选择位置',
    gpxExportSuccess: 'GPX 文件导出成功',
    gpxExportFailed: '导出 GPX 失败，请重试',
    gpxImportSuccess: '成功导入',
    routes: '条路线',
    gpxImportFailed: '导入 GPX 失败',
    noValidRoutes: 'GPX 文件中没有找到有效路线',
    noRoutesToExport: '没有可导出的路线',
    mapExportSuccess: '地图导出成功',
    mapExportFailed: '导出地图失败，请重试',
    routeAtLeastTwoCities: '线路至少需要2个城市',
    routeUpdated: '线路已更新',
    routeUpdateFailed: '更新线路失败，请重试',
    inputCityNameWarning: '请输入城市名称',
    from: '从',
    depart: '出发',
    clickToViewDetail: '查看城市详情',
    
    // GPX
    gpxFiles: '.gpx 文件',
    
    // 自动同步
    autoSync: '自动同步',
    autoSyncDesc: '运行自动同步脚本，代码修改后自动推送到 GitHub',
  },
  
  en: {
    // App title
    appName: 'Travel Tracker',
    
    // Search
    searchPlaceholder: 'Search city name...',
    searchPlaceholderMobile: 'Search city name...',
    
    // Transport modes
    driving: 'Driving',
    train: 'Train',
    flight: 'Flight',
    walking: 'Walking',
    selectTransport: 'Select Transport',
    selectTransportDesc: 'Select transport mode from previous city',
    addCity: 'Add City',
    cancel: 'Cancel',
    confirm: 'Confirm',
    
    // Route
    currentRoute: 'Current Route',
    cities: 'cities',
    clear: 'Clear',
    generateRoute: 'Generate Route',
    addToMap: 'Add to Map',
    saveRoute: 'Save Route',
    mapRoutes: 'Map Routes',
    import: 'Import',
    export: 'Export',
    removeAll: 'Clear All',
    confirmRemoveAll: 'Clear all routes?',
    
    // Map
    mapClickAdd: 'Enable Map Click',
    exitMapClick: 'Exit Map Click',
    clickMapToAdd: 'Click map to add city',
    exportImage: 'Export Image',
    exporting: 'Exporting...',
    switchMapStyle: 'Switch Map Style',
    
    // Route detail
    routeDetail: 'Route Detail',
    editRoute: 'Edit Route',
    editRouteTag: 'Editing',
    saveEdit: 'Save Changes',
    close: 'Close',
    startPoint: 'Start',
    endPoint: 'End',
    searchAddCity: 'Search and add city...',
    transportMode: 'Transport:',
    editTip: 'Tip: Search to add city, or enable "Map Click" to add on map',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    delete: 'Delete',
    viewDetail: 'View Detail',
    
    // Save route
    saveRouteTitle: 'Save Route',
    inputRouteName: 'Enter route name',
    save: 'Save',
    saveSuccess: 'Route saved successfully',
    saveFailed: 'Failed to save route',
    
    // Add city
    addCityTitle: 'Add City',
    position: 'Position:',
    inputCityName: 'Enter city name',
    add: 'Add',
    addSuccess: 'City added:',
    
    // History
    history: 'History',
    refresh: 'Refresh',
    noHistory: 'No history yet',
    view: 'View',
    loadSuccess: 'Route loaded to map',
    loadFailed: 'Failed to load route',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Failed to delete',
    
    // Statistics
    countries: 'countries',
    citiesCount: 'cities',
    distance: 'Distance:',
    totalDistance: 'Total Distance:',
    
    // Weather
    weather: 'Weather',
    currentWeather: 'Current Weather',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    windSpeed: 'Wind',
    forecast: 'Forecast',
    weatherFailed: 'Failed to load weather',
    loadingWeather: 'Loading weather...',
    
    // City info
    cityDetail: 'City Detail',
    population: 'Population:',
    attractions: 'Attractions',
    viewOnWikipedia: 'View on Wikipedia →',
    noCityInfo: 'No city information available',
    loadingCityInfo: 'Loading city info...',
    
    // Flight query
    queryFlightPrice: 'Query Flight Prices',
    queryFlightPriceDesc: 'Query flight prices:',
    
    // Map styles
    standard: 'Standard',
    satellite: 'Satellite',
    terrain: 'Terrain',
    dark: 'Dark',
    switchedTo: 'Switched to',
    map: 'map',
    
    // Mode
    darkMode: 'Switch to dark mode',
    lightMode: 'Switch to light mode',
    
    // Messages
    pleaseAddTwoCities: 'Please add at least 2 cities',
    pleaseGenerateRoute: 'Please generate route first',
    routeGenerated: 'Route generated successfully',
    routeGenerateFailed: 'Failed to generate route',
    addedToMap: 'Added to map',
    clearedAllRoutes: 'All routes cleared',
    deletedCity: 'City deleted',
    exitedMapClickMode: 'Map click mode exited',
    enteredMapClickMode: 'Map click mode enabled, click map to add city',
    gpxExportSuccess: 'GPX file exported',
    gpxExportFailed: 'Failed to export GPX',
    gpxImportSuccess: 'Successfully imported',
    routes: 'routes',
    gpxImportFailed: 'Failed to import GPX',
    noValidRoutes: 'No valid routes found in GPX file',
    noRoutesToExport: 'No routes to export',
    mapExportSuccess: 'Map exported successfully',
    mapExportFailed: 'Failed to export map',
    routeAtLeastTwoCities: 'Route needs at least 2 cities',
    routeUpdated: 'Route updated',
    routeUpdateFailed: 'Failed to update route',
    inputCityNameWarning: 'Please enter city name',
    from: 'from',
    depart: 'depart',
    clickToViewDetail: 'View city detail',
    
    // GPX
    gpxFiles: '.gpx files',
    
    // Auto sync
    autoSync: 'Auto Sync',
    autoSyncDesc: 'Run auto sync script to push changes to GitHub',
  }
};

export default translations;
