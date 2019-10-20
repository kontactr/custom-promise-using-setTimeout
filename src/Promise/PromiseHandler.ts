import CPromise from "./Promise";

const PROMISE_PENDING = 0;
const PROMISE_RESOLVED = 1;
const PROMISE_REJECTED = 2;
const PROMISE_EVENT_QUEUE_TIME = 100;

export default class PromiseHandler {
  constructor(firstTask) {
    this.generatedID = new Date().toString();
    console.log(this.generatedID, 11);

    this.thens = [];
    this.catches = [];

    this.tasks = [];
    this.counterTask = 0;
    this.taskIndex = 0;

    this.promise = new CPromise(
      firstTask,
      this.res,
      this.rej,
      this,
      this.getPullTask,
      PromiseHandler
    );
    this.preserveOutput = null;
    this.currentStatus = PROMISE_PENDING;
    this.currentHandler = this;
  }

  getOffBoarding = newHandler => {
    //console.log("Hang tight....we are performing some offboarding task....:)");
    let previousLength = newHandler.tasks.length;
    //console.log(this.tasks.length , 32)
    while (this.tasks.length) {
      let offBoardTask = this.tasks.shift();
      //console.log("In loop" , 35)
      if (offBoardTask.type === "then") {
        newHandler.then(offBoardTask.target);
      } else if (offBoardTask.type === "catch") {
        newHandler.catch(offBoardTask.target);
      } else if (offBoardTask.type === "finally") {
        newHandler.finally(offBoardTask.target);
      }
    }
    //let nextLength = newHandler.tasks.length
    this.currentHandler = newHandler;
    if (!previousLength) {
      //console.log(44 , newHandler.tasks.length , "In offboarding")
      //console.log(newHandler.promise.notifyFetchTask , 46897)
      newHandler.promise.notifyFetchTask();
    }
    //console.log("Done..... :)", newHandler.tasks.length);
  };

  getPopFunctions = type => {
    if (this.tasks.length) {
      while (
        this.tasks.length &&
        (this.tasks[0].type !== type && this.tasks[0].type !== "finally")
      ) {
        this.tasks.shift();
      }
      if (this.tasks.length) {
        let temp = this.tasks.shift();
        return {
          nextSuccess:
            temp.type === type || temp.type === "finally"
              ? temp.target
              : undefined,
          nextError:
            temp.type === type || temp.type === "finally"
              ? temp.target
              : undefined
        };
      } else {
        return {
          nextSuccess: undefined,
          nextError: undefined
        };
      }
      /*while (this.tasks[this.taskIndex].type !== type) {
        this.taskIndex += 1;
      }

      if (this.taskIndex < this.counterTask) {
        return {
          nextSuccess:
            type === "then" ? this.tasks[this.taskIndex++].target : undefined,
          nextError:
            type === "catch" ? this.tasks[this.taskIndex++].target : undefined
        };
      } else {
        return {
          nextSuccess: undefined,
          nextError: undefined
        };
      }*/
    } else {
      return {
        nextSuccess: undefined,
        nextError: undefined
      };
    }
  };

  res = data => {
    this.preserveOutput = data;
    this.currentStatus = PROMISE_RESOLVED;
    this.promise.notifyFetchTask();
  };

  rej = data => {
    this.preserveOutput = data;
    this.currentStatus = PROMISE_REJECTED;
    this.promise.notifyFetchTask();
  };

  getPullTask = () => {
    if (this.currentStatus === PROMISE_RESOLVED) {
      let { nextError, nextSuccess } = this.getPopFunctions("then");

      return [nextSuccess, this.preserveOutput];
    } else if (this.currentStatus === PROMISE_REJECTED) {
      let { nextError, nextSuccess } = this.getPopFunctions("catch");
      return [nextError, this.preserveOutput];
    } else {
      return [undefined, this.preserveOutput];
    }
  };

  then(func) {
    this.currentHandler.tasks.push({
      target: func,
      type: "then"
    });
    //this.counterTask++;
    //this.thens.push(func);
    if (this.currentHandler.tasks.length === 1) {
      this.currentHandler.promise.notifyFetchTask();
    }
    return this.currentHandler;
  }

  catch(func) {
    this.currentHandler.tasks.push({
      target: func,
      type: "catch"
    });
    //this.counterTask++;
    //this.catches.push(func);
    if (this.currentHandler.tasks.length === 1) {
      this.currentHandler.promise.notifyFetchTask();
    }
    return this.currentHandler;
  }

  finally(func) {
    this.currentHandler.tasks.push({
      target: func,
      type: "finally"
    });
    //this.counterTask++;
    //this.catches.push(func);
    if (this.currentHandler.tasks.length === 1) {
      this.currentHandler.promise.notifyFetchTask();
    }
    return this.currentHandler;
  }
}
