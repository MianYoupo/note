# mock.js 学习

```
#使用axios发送ajax
cnpm install axios --save
#使用mockjs产生随机数据
cnpm install mockjs --save-dev
# 使用json5解决json文件,无法添加注释问题
cnpm install json5 --save-dev
```

Mock.mock() 的使用案例

```javascript
const Mock = require("mockjs");

let id = Mock.mock("@id");
console.log(id);

var obj = Mock.mock({
id: "@id()",
username: "@cname()",
avatar: "@image('200x200', 'red', '#fff', 'avatar')",
description:"@paragraph()",
ip:"@ip()",
email:"@email()"
})
console.log(obj)
```

mock.js的配置文件

```javascript
const fs = require('fs');
const path = require('path');
//导入 mockjs 模块
const Mock = require('mockjs');
const JSON5 = require('json5')

function getJsonFile(filePath){
	let json = fs.readFileSync(path.join(_dirname,filePath),'utf-8');
	return JSON5.parse(json);
}

module.exports = function(app){
	app.get('/user/userinfo',function(req,res){
		let json = getJsonFile('./userInfo.json5');
		res.json(Mock.mock(json));
	})
}
```

