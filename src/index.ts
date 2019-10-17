import PromiseHandler from "./Promise/PromiseHandler";
document.getElementById("app").innerHTML = `
<h1>Hello Parcel!</h1>
<div>
  Look
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>
  for more info about Parcel.
</div>
`;

console.log(
  new PromiseHandler((res, rej) => {
    console.log("HERE 2", res, rej);
    1 % 2 ? res(10) : rej(20);
    console.log("HERE 3");
  })
    .then(data => {
      console.log(data, 150);
      return 170;
    })
    .catch(err => {
      console.log("Nope");
    })
    .then(data => {
      throw new Error(10);
    })
    .catch(data => {
      console.log(data, 24);
    })
    .catch(data => {
      console.log(25);
    })
    .then(data => {
      console.log(26);
    })
);
