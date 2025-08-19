fetch('http://localhost:3000/api/comments')
    .then(res => res.json())
    .then(data => console.log(data));