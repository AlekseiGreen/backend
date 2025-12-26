//***************//
//    EXPRESS    //
//***************//

// подключение express
const express = require('express');


// создаем объект приложения
const app = express();
const port = 3000;

// определяем обработчик для маршрута "/"
app.get('/', (req, res)=>{
    // отправляем ответ
    res.send('RUN SERVER');
})

// начинаем прослушивать подключения на 3000 порту
app.listen(port, ()=>{
    console.log(`Port=${port}`);
})
