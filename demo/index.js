

let taskId = 0
function workLoop(deadline) {
    taskId++
    // 任务锁
    let sholdYield = false;
    while (!sholdYield) {
        console.log(`run task ${taskId}`)
        sholdYield = deadline.timeRemaining() < 1;
    }
  
    window.requestIdleCallback(workLoop);
  }

requestIdleCallback(workLoop)