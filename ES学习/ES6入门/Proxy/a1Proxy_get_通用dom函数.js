const dom = new Proxy({}, {
  get(target, propKeys) {
    return function (attrs = {}, ...children) {
      var el = document.createElement(propKeys)
      for(var prop of Object.keys(attrs)){
        el.appendChild(prop,attrs[prop])
      }
      for (var child of children) {
        if (typeof child == 'string') {
          child = document.createTextNode(child)
        }
        el.appendChild(child)
      }
      return el;
    }
  }
})

const el = dom.div({},
  'Hello, my name is ',
  dom.a({href: '//example.com'}, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
);
