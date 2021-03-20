const UrlJoin = (...args) => {
  const ProtocolPattern = /http[s]?/;
  const DomainPattern = /http[s]?:\/\/(.*?)\//;
  let url = '';
  let protocl = '';
  let domain = '';
  let path = [];

  args.forEach(item => {
    if (ProtocolPattern.exec(item)) {
      protocl = ProtocolPattern.exec(item)[0]
    };

    if (DomainPattern.exec(item)) {
      domain = DomainPattern.exec(item)[1];
    }
    if (!ProtocolPattern.exec(item) && !DomainPattern.exec(item)) {
      if (0 == item.indexOf('/')) {
        path[0] = item.substr(1);
      } else {
        path.push(item)
      }
    }
  })
 
  console.log('url',url,'domain',domain,path);
  url = protocl + '://' + domain + '/' + path.join('');
  return url;
}

module.exports = {
  UrlJoin
}