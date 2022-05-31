#!/usr/bin/env node

// 说明：上面这个Shebang代码必须写，目的是为了使用环境中的node执行该文件

// 1.导入commander插件
const program = require("commander");

// 2.导入方法
const helpOptions = require("./bin/core/help");
const createCommands = require("./bin/core/create");

//3. 获取版本
// program.version(require("./package.json").version); //获取版本信息，默认选项名称是-V和--version，此处可自定义
program.version(require("./package.json").version, "-v,--version", "this is description of version"); //此处自定义名称并加描述

// 4.帮助和增加可选信息
helpOptions();

// 5.创建指令
createCommands();

// 6.解析参数
program.parse(process.argv);
// console.log(program.opts());
// console.log(program);
