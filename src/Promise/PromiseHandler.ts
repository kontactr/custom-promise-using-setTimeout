import CPromise from "./Promise";

const PROMISE_PENDING = 0;
const PROMISE_RESOLVED = 1;
const PROMISE_REJECTED = 2;
const PROMISE_EVENT_QUEUE_TIME = 100;

export default class PromiseHandler {
  constructor(firstTask) {
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
      this.getPullTask
    );
    this.preserveOutput = null;
    this.currentStatus = PROMISE_PENDING;
  }

  getPopFunctions = type => {
    if (this.taskIndex < this.counterTask) {
      while (this.tasks[this.taskIndex].type !== type) {
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
      }
    } else {
      return {
        nextSuccess: undefined,
        nextError: undefined
      };
    }
  };

  res(data) {
    this.preserveOutput = data;
    this.currentStatus = PROMISE_RESOLVED;
    this.promise.notifyFetchTask();
  }

  rej(data) {
    this.preserveOutput = data;
    this.currentStatus = PROMISE_REJECTED;
    this.promise.notifyFetchTask();
  }

  getPullTask() {
    if (this.currentStatus === PROMISE_RESOLVED) {
      let { nextError, nextSuccess } = this.getPopFunctions("then");
      return [nextSuccess, this.preserveOutput];
    } else if (this.currentStatus === PROMISE_REJECTED) {
      let { nextError, nextSuccess } = this.getPopFunctions("catch");
      return [nextError, this.preserveOutput];
    } else {
      return [undefined, this.preserveOutput];
    }
  }

  then(func) {
    this.tasks.push({
      target: func,
      type: "then"
    });
    this.counterTask++;
    this.thens.push(func);
    return this;
  }

  catch(func) {
    this.tasks.push({
      target: func,
      type: "catch"
    });
    this.counterTask++;
    this.catches.push(func);
    return this;
  }
}
