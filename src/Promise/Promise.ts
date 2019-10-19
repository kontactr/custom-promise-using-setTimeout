

const PROMISE_PENDING = 0;
const PROMISE_RESOLVED = 1;
const PROMISE_REJECTED = 2;
const PROMISE_EVENT_QUEUE_TIME = 100;
const asyncFunction = process && process.nextTick || setTimeout

class Promise {
  constructor(firstTask, res, rej, assginer, puller , signature) {
    this.res = res;
    this.rej = rej;
    this.pullTask = puller;
    this.assginer = assginer;
    this.signature = signature
    this.runFirstTask(() => {
      //console.log("START RUN");
      firstTask(this.res.bind(assginer), this.rej.bind(assginer));
      //console.log("END RUN");
    });
    
  }

  runFirstTask = (task) => {
    asyncFunction(task, PROMISE_EVENT_QUEUE_TIME);
  }

  notifyFetchTask = () => {
    
    let [task, data] = this.pullTask.call(this.assginer);
    //console.log("Called" , task , undefined ,28)
    //let task = this.pullTask();
    if (task) {
      this.doTask(task, data);
    }
  }

  doTask = (task, data) => {
    setTimeout(() => {
      try {
        let resp = task(data) || data;
        //console.log(resp instanceof this.signature , 3999)
        if (resp instanceof this.signature) {
          //console.log("YES", resp , 36);
          this.assginer.getOffBoarding(resp);
          this.assginer = resp;
          //this.res.bind(resp)
        }else{
          this.res.bind(this.assginer)(resp);
        }
      } catch (err) {
        if(err instanceof this.signature){
          console.log("Err",  err instanceof this.signature, 36);
          this.assginer.getOffBoarding(err);
          this.assginer = err;
        }else{
          this.rej.bind(this.assginer)(err);
        }

      }
    }, PROMISE_EVENT_QUEUE_TIME);
  }
}

export default Promise;
