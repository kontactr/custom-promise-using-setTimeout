import PromiseHandler from "./Promise/PromiseHandler";
document.getElementById("app").innerHTML = `
<h1>Hello Parcel!</h1>
<div>
  Look
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>
  for more info about Parcel.
</div>
`;

let p = new PromiseHandler((res, rej) => {
  console.log("HERE 2", res, rej);
  setTimeout(() => {
    1 % 2 ? res(10) : rej(20);
  }, 100);
  console.log("HERE 3");
})
  .then(data => {
    console.log(data, 150);
    return 170;
  })
  .catch(err => {
    console.log("Nope Nope");
  })
  .then(data => {
    throw new Error(10);
  })
  .catch(data => {
    console.log(data, 24);
    return 170;
  })
  .catch(data => {
    console.log(25);
  })
  .then(data => {
    console.log(data, 26);
    return data;
  })
  .then(data => {
    return new PromiseHandler((res, rej) => {
      res(50);
    });
  })
  .then(data => {
    console.log(data, "TY 0");
  })
  .then(data => {
    console.log(data, "TY 1");
  })
  .then(data => {
    return data + 70;
  })
  .then(data => {
    console.log(data);
    //return new Error(data);
    throw new Error(data);
  })
  .catch(data => {
    console.log("New Promise Error", data);
  })
  .catch(err => {
    console.log("New Promise Error 1 ", err);
  })
  .then(data => {
    console.log("Finally made it to the last..", data);
  })
  .then(data => {
    //console.log(this , 68)
    return 50 + 50 * 50;
  });

setTimeout(() => {
  console.log(p.generatedID);
  let iop = p.then(data => {
    console.log("checking.... if promise returns to the new one or not");
    console.log(data, 74);
  });
  console.log(iop.generatedID, 76);
}, 9000);

console.log("ASYNC");

let t = new PromiseHandler((res, rej) => {
  res(10);
})
  .then(data => {
    return new PromiseHandler((res, rej) => {
      res(30);
    }).then(data => {
      return new PromiseHandler((res, rej) => {
        res(data * 2);
      });
    });
  })
  .then(data => {
    console.log(data, 8999);
  });

t = new PromiseHandler((res1, rej1) => {
  res1(
    new PromiseHandler((res, rej) => {
      res(50);
    })
  );
})
  .then(data => {
    return data;
  })
  .then(data => {
    console.log(data, 108, "Retrun resolved promise to take over");
  });

const fin = new PromiseHandler((res, rej) => {
  res(10);
})
  .finally(data => {
    console.log("Finally 1");
  })
  .finally(data => {
    console.log("Finally 2");
  }).then((data) => {
    console.log("Then called");
    return throw new Error(300);
  }).finally((data) => {
    console.log("Instead catch");
  }).catch((data) => {
    console.log("Nope not called");
  }).finally((data) => {
    console.log("But i'm called");
    return new PromiseHandler((res , rej) => {
      res(500)
    })
  }).then((data) => {
    console.log("There, we go.." , data)
  });
