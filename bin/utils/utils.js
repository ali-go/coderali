// 公共方法

const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

// 1.编译ejs模板文件成字符串
const compile = (templateName, data) => {
  const templatePosition = `../templates/${templateName}`; // 获取模板相对于该文件的地址
  const templatePath = path.resolve(__dirname, templatePosition); //拼接获取模板的绝对路径
  // console.log(templatePath, data, 222);
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, { data }, {}, function (err, result) {
      // 注意：参数data经测试必须套一个对象，模板里面是按照data.属性拿值的，猜测是把data内部属性进行了结构，
      // 原传递对象结构只有属性，没有data本身，故报错，所以需要套一个对象，如此解构能拿到data，以上仅是猜测！
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(result); // 编译后的字符串
    });
  });
};

// 2.文件写入
const writeToFile = (path, content) => {
  return fs.promises.writeFile(path, content);
};

// 3.封装方法：path若不存在，则创建对应文件夹（如source/components/category/test）
const createDirSync = (pathName) => {
  // 当前路径存在，返回true
  if (fs.existsSync(pathName)) {
    return true;
  } else {
    // 递归传递当前路径的上一级目录，判断 是否存在
    if (createDirSync(path.dirname(pathName))) {
      // 上一级目录存在的情况下，在该目录下新建对应的目录
      fs.mkdirSync(pathName);
      return true;
    }
  }
};

module.exports = { compile, writeToFile, createDirSync };
