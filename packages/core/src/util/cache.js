//把上报的数据存储在map键值对中
//key就是上报的类型
//value就是上报的数据,是一个数组
const cache = new Map();

export function getCache() { 
  return cache;
}

export function addCache(type, data) { 
  //如果有这个类型的数据，就往数组中添加
  //没有就在map中创建新的类型，并且将data放入到数组中
  cache.get(type)? cache.get(type).push(data) : cache.set(type, [data]);
}

export function clearCache() { 
  cache.clear();
}