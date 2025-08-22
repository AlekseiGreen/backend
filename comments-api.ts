import { createServer, IncomingMessage, ServerResponse } from 'http';
import { IComment } from "./types";
import { readFile } from "fs/promises";


const loadComments = async (): Promise<IComment[]>=>{
    try{
        const rawData = await readFile("mock-comments.json", "utf-8");
        return JSON.parse(rawData) as IComment[];
    } catch(err) {
        console.log('Error on read file mock-comment.json', err);
        throw new Error('Not load comments');
    }
    
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse)=>{
    if (req.url === '/api/comments' && req.method === 'GET') {
        try{
            const comments = await loadComments();
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(comments)); // ответ клиенту
            res.end();
        } catch {
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
        
    } else if(req.url === '/api/comments' && req.method === 'POST') {
        let rawBody ='';
        req.on('data', (chunk)=>{
            rawBody += chunk.toString();
        })

        req.on('end', ()=>{
            try {
                console.log('Try');

                const result = JSON.parse(rawBody) as IComment[];
                if(!Array.isArray(result)){
                    console.log('Try-!Array');

                    res.statusCode = 400;
                    return res.end('Expected array of comments');
                }
                const item = result[0];
                item.status = "sold";
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(item));
            } catch (err) { // Если JSON пришел пустым
                console.log('Catch');
                console.error("JSON parsing error:", err);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                error: 'Invalid JSON format',
                message: err instanceof SyntaxError ? err.message : 'Unknown error'
                }));
            }
        })
    } else {
        res.statusCode = 404;
        res.end('Not found page');
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// {import { createServer, IncomingMessage, ServerResponse } from 'http';
// import { IComment } from './types';
// import { readFile, writeFile } from 'fs/promises';

// // Загрузка комментариев
// const loadComments = async (): Promise<IComment[]> => {
//   try {
//     const rawData = await readFile('mock-comments.json', 'utf-8');
//     return JSON.parse(rawData) as IComment[];
//   } catch (err) {
//     console.error('Ошибка при чтении файла mock-comments.json:', err);
//     throw new Error('Не удалось загрузить комментарии');
//   }
// };

// // Сохранение комментариев (если нужно сохранять изменения)
// const saveComments = async (comments: IComment[]): Promise<void> => {
//   try {
//     await writeFile('mock-comments.json', JSON.stringify(comments, null, 2), 'utf-8');
//   } catch (err) {
//     console.error('Ошибка при записи файла mock-comments.json:', err);
//     throw new Error('Не удалось сохранить комментарии');
//   }
// };

// // Универсальный ответ
// const sendResponse = (
//   res: ServerResponse,
//   statusCode: number,
//   data: any,
//   contentType = 'application/json'
// ) => {
//   res.writeHead(statusCode, { 'Content-Type': contentType });
//   res.end(typeof data === 'string' ? data : JSON.stringify(data));
// };

// // CORS
// const allowCors = (res: ServerResponse) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
// };

// const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
//   // Обработка CORS preflight
//   if (req.method === 'OPTIONS') {
//     allowCors(res);
//     return res.end();
//   }

//   // Установка CORS для всех ответов
//   allowCors(res);

//   try {
//     if (req.url === '/api/comments' && req.method === 'GET') {
//       const comments = await loadComments();
//       return sendResponse(res, 200, comments);

//     } else if (req.url === '/api/comments' && req.method === 'POST') {
//       let rawBody = '';

//       req.on('data', (chunk) => {
//         rawBody += chunk.toString();
//       });

//       req.on('end', async () => {
//         try {
//           if (!rawBody.trim()) {
//             return sendResponse(res, 400, { error: 'Тело запроса пустое' });
//           }

//           const result = JSON.parse(rawBody) as unknown;

//           if (!Array.isArray(result)) {
//             return sendResponse(res, 400, { error: 'Ожидался массив комментариев' });
//           }

//           const item = result[0];
//           if (!item || typeof item !== 'object') {
//             return sendResponse(res, 400, { error: 'Неверная структура комментария' });
//           }

//           item.status = item.status || "sold"; // добавляем статус, если его нет

//           // Можно сохранить изменения, если нужно:
//           // const comments = await loadComments();
//           // comments.push(item);
//           // await saveComments(comments);

//           return sendResponse(res, 201, item); // 201 — создано

//         } catch (err) {
//           console.error('Ошибка парсинга JSON:', err);
//           return sendResponse(res, 400, {
//             error: 'Неверный формат JSON',
//             message: err instanceof SyntaxError ? err.message : 'Неизвестная ошибка'
//           });
//         }
//       });

//     } else {
//       return sendResponse(res, 404, { error: 'Страница не найдена' });
//     }
//   } catch (err) {
//     console.error('Неожиданная ошибка на сервере:', err);
//     return sendResponse(res, 500, { error: 'Внутренняя ошибка сервера' });
//   }
// });

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
//   console.log(`➡️  GET /api/comments — получить комментарии`);
//   console.log(`➡️  POST /api/comments — отправить комментарий (в виде массива)`);
// });}