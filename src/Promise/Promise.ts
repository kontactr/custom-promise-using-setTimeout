const PROMISE_PENDING = 0;
const PROMISE_RESOLVED = 1;
const PROMISE_REJECTED = 2;
const PROMISE_EVENT_QUEUE_TIME = 100;

class Promise {
  constructor(firstTask, res, rej, assginer, puller) {
    this.res = res;
    this.rej = rej;
    this.pullTask = puller;
    this.assginer = assginer;
    this.runFirstTask(() => {
      //console.log("START RUN");
      firstTask(this.res.bind(assginer), this.rej.bind(assginer));
      //console.log("END RUN");
    });
  }

  runFirstTask(task) {
    setTimeout(task, PROMISE_EVENT_QUEUE_TIME);
  }

  notifyFetchTask() {
    let [task, data] = this.pullTask.call(this.assginer);
    //let task = this.pullTask();
    if (task) {
      this.doTask(task, data);
    }
  }

  doTask(task, data) {
    setTimeout(() => {
      try {
        let resp = task(data) || data;

        this.res.bind(this.assginer)(resp);
      } catch (err) {
        this.rej.bind(this.assginer)(err);
      }
    }, PROMISE_EVENT_QUEUE_TIME);
  }
}

export default Promise;
