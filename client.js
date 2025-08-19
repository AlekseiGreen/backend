// fetch('http://localhost:3000/api/comments')
//     .then(res => res.json())
//     .then(data => console.log(data));


new Promise(
    (resolve, reject)=> {
        setTimeout(()=> resolve("setTIMER"), 1000);
    }
).then((value2)=>{
    console.log(value2);
    console.log("RESOLVE");
}
);