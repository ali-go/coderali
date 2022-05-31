/**
 * 执行终端命令的相关代码，包括子进程
 */

//1.导入创建子进程的方法（方法有几个，此处使用spawn，其余可至官网了解）
const { spawn } = require("child_process");

// 2.方法封装
const commandSpawn = (...args) => {
  // 转换成promise，而不采用callback回调
  return new Promise((resolve, reject) => {
    //(1).获取子进程进程（执行子节点终端命令）
    const childProcess = spawn(...args); // child_process.spawn(command[, args][, options])
    // (2).子进程的stdio流（stdin、stdout、stderr）与当前进程的stdio流（stdin、stdout、stderr）之间建立管道实现:
    // 控制台输出的打印是和当前进程绑定的，为了让子进程也看到打印信息，需手动将
    // 子进程的stdio流（stdin、stdout、stderr）和当前（主）进程建立管道关系。
    // 参考文章：https://blog.csdn.net/qq_29470333/article/details/90233235
    childProcess.stdout.pipe(process.stdout); //输出
    childProcess.stderr.pipe(process.stderr); //报错
    // (3).监听子进程执行完毕
    childProcess.on("close", () => {
      resolve(); //子进程完成后通知外部，进而执行其他逻辑
    });
  });
};

module.exports = {
  commandSpawn,
};
