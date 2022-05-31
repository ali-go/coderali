// 创建其他指令

const program = require("commander");
const { createProjectAction, addComponentAction, addPageAndRouteAction, addStoreAction } = require("./actions");

const createCommands = () => {
  // 说明：
  // command第一个参数中第一个是命令名称，第二个是命令参数，第三个可选的是其他参数
  // 1.create创建项目指令([]表示可选)
  // action参数可以是promise对象或者是函数
  program.command("create <project> [gitRepo]").description("clone a repository into a folder,例如：coderali create demo https://github.com/coderwhy/hy-vue-temp.git").action(createProjectAction);

  // 2.创建添加组件的命令([]表示可选)
  program
    .command("addcpn <name>")
    .description("add vue component，例如：coderali addcpn HelloWorld [-d src/components]")
    .action((name) => {
      addComponentAction(name, program.opts().dest || "src/components"); //此处也可改为不在这里调用传递参数，参数写在addComponentAction方法中接收
    });

  // 3.创建页面的组件和路由([]表示可选)
  program
    .command("addpage <page>")
    .description("add vue page and router config，例如：coderali addpage Home [-d src/pages]")
    .action((page) => {
      addPageAndRouteAction(page, program.opts().dest || "src/pages");
    });

  // 4.创建store的模块module([]表示可选)
  program
    .command("addstore <store>")
    .description("add store's module of vue，例如：coderali addstore login [-d src/store/modules]")
    .action((store) => {
      addStoreAction(store, program.opts().dest || "src/store/modules");
    });
};

module.exports = createCommands;
