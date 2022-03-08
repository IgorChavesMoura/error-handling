import http from 'http';

let count = 1;

async function handler(request, response) {
    count++;
    try {
        count % 2 === 0 && await Promise.reject('some error on handler');
        for await (const data of request) {
            count % 2 !== 0 && await Promise.reject('some error on for');
        }
    } catch (error) {
        console.log('a server error has happened', error);
        response.writeHead(500);
        response.write(JSON.stringify({ message: 'internal server error' }));
    } finally {
        response.end();
    }

}

http.createServer(handler).listen(3000, () => console.log('running at 3000'));