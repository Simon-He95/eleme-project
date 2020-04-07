export function saveToLocal(id,key,val) {
  let seller = window.localStorage._seller_;
  if (!seller){ //如果没有创建过seller，去创建一个seller对象
     seller = {};
     seller[id] = {};
  } else {  //如果seller已存在
    seller = JSON.parse(seller);
    if (!seller[id]){ //判断id是否存在，如果不存在给id一个空对象
      seller[id] = {}
    }
  }
  seller[id][key] = val;

  window.localStorage._seller_ = JSON.stringify(seller)
}

export function loadFromLocal(id,key,def) {
  console.log(id,key,def)
  let seller = window.localStorage._seller_;
  if (!seller){  //如果值为空，返回默认值def
    return def;
  }
  seller = JSON.parse(seller)[id];  //转json去当前id商家下的信息
  if (!seller) {  //如果为空，返回默认值def
    return def;
  }
  let ret = seller[key];  //找商家下的key

  return  ret || def;

}
