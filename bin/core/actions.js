// 自定义commands的action

//导入内置的方法去把异步回调转成promise
const { promisify } = require("util");

//默认download实际采用异步回调形式的，现在我们想转成promise形式，因此需要用内置的插件promisify转换
const download = promisify(require("download-git-repo"));
const open = require("open");
const path = require("path");

const { vueRepo } = require("../config/repo-config");
const { commandSpawn } = require("../utils/terminal");
const { compile, writeToFile, createDirSync } = require("../utils/utils");

// 1.create创建项目指令的action
const createProjectAction = async (project, gitRepo) => {
  console.log("coderali helps you create project");
  // console.log(gitRepo);
  // (1).clone项目（克隆项目需要使用一个插件download-git-repo，这个插件没有存在git，而是在gitlab）
  gitRepo = gitRepo ? `direct:${gitRepo}` : vueRepo; //获取git clone的模板地址
  await download(gitRepo, project, { clone: true });
  // (2).执行npm install（需使用内置的插件child_process创建子进程终端去安装依赖）
  // 为了保证该安装依赖的进程执行完毕才执行后续的运行和打开浏览器，同时又不想使用回调函数，因此可以内部转换成promise
  // 注意：window系统不是直接npm命令，而是执行npm.cmd，mac是直接npm
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  await commandSpawn(command, ["install"], { cwd: `./${project}` });
  // (3).创建子进程运行npm run serve(考虑到该进程并不会关闭，本身进程就会阻塞，因此此处不使用await阻塞下面代码执行，否则打不开浏览器)
  commandSpawn(command, ["run", "serve"], { cwd: `./${project}` });
  // (4).打开浏览器(需要使用插件open)
  open("http://localhost:8080/");
};

// 2.创建组件的action
const addComponentAction = async (name, dest) => {
  // console.log(name, dest);
  // (1).编译ejs模板，获得字符串result
  const result = await compile("vue-component.ejs", { name, lowerName: name.toLowerCase() });
  // (2).将result写入到.vue文件
  // dest不是路径片段，path.resolve会返回目录的绝对路径，且返回的是当前终端执行的工作目录，即项目的绝对路径，而不是该脚手架的目录
  const targetPath = path.resolve(dest, `${name}.vue`);
  writeToFile(targetPath, result);
};

// 3.创建页面组件和路由的action
const addPageAndRouteAction = async (name, dest) => {
  // (1).编译ejs模板，获得字符串result
  const data = { name, lowerName: name.toLowerCase() };
  const pageResult = await compile("vue-component.ejs", data);
  const routeResult = await compile("vue-router.ejs", data);

  const targetDest = path.resolve(dest, name); //获取目标目录
  // (2).将result写入到.vue / .js文件
  // 先对目标目录进行操作，若无该目录先创建，即该if判断无论如何都会通过的
  if (createDirSync(targetDest)) {
    const targetPagePath = path.resolve(targetDest, `${name}.vue`);
    const targetRoutePath = path.resolve(targetDest, "router.js");
    writeToFile(targetPagePath, pageResult);
    writeToFile(targetRoutePath, routeResult);
  }
};

// 4.创建store的模块module的action
const addStoreAction = async (name, dest) => {
  const storeResult = await compile("vue-store.ejs");
  const typesResult = await compile("vue-types.ejs");
  const targetDest = path.resolve(dest, name);

  if (createDirSync(targetDest)) {
    const targetStorePath = path.resolve(targetDest, "index.js");
    const targetTypesPath = path.resolve(targetDest, "types.js");
    writeToFile(targetStorePath, storeResult);
    writeToFile(targetTypesPath, typesResult);
  }
};

module.exports = {
  createProjectAction,
  addComponentAction,
  addPageAndRouteAction,
  addStoreAction,
};
