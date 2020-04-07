/*

解析url参数
 @example ?id=12345$a=b
 @return Object {id:1234,a:b}

*/

export function urlParse() {
  let url = window.location.search; //拿到字符串 ?id=12345$a=b
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg); //拿到['?id=12345','&a=b']
  if (arr){
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('='); //substring(1)删除第一个元素?，然后split('=')，等号进行拆分，得到数组[id,12345]
      let key = decodeURIComponent(tempArr[0])   //id
      let value = decodeURIComponent(tempArr[1])   //12345
      obj[key] = value;
    });
  }
  return obj;
}
