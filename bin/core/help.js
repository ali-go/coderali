// 封装commander设置的帮助和可选信息

// 示例：如果是多个参数则会存在数组中
// program
//    .option('-c, --compress [percentage]') // 0 或 1 个参数
//    .option('--preprocess <file...>') // 至少 1 个参数
//    .option('--test [name...]') // 0 或多个参数

const program = require("commander");

const helpOptions = () => {
  // 增加自己的options可选信息
  program.option("-a --ali", "a ali cli"); //描述-a或--ali选项为脚手架
  program.option("-d --dest <dest>", "a destination folder 例如：-d /src/components"); //-d或--dest后面跟目标路径
  program.option("-f --framework <framework>", "your framework"); // -f或--framework表示当前框架

  // 可以对可选参数进行监听，进而处理一些自定义的逻辑
  // program.on("--help", function () {
  program.on("option:dest", function () {
    // console.log("");
    // console.log("Other:");
    // console.log("	other options~");
    // console.log(this.opts().dest);
  });
};

module.exports = helpOptions;
