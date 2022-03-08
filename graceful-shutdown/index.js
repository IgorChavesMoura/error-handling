import { MongoClient } from 'mongodb';
import { createServer } from 'http';
import { promisify } from 'util';

async function dbConnect() {
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();

    console.log('mongodb is connected!');

    const db = client.db('comics');

    return {
        collections: { heroes: db.collection('heroes') },
        client
    };
}

const { collections, client } = await dbConnect();

async function handler(request, response) {

    for await(const data of request) {
        try {
            const hero = JSON.parse(data);
            await collections.heroes.insertOne({ updatedAt: new Date().toISOString(), ...hero });

            const heroes = await collections.heroes.find().toArray();
            console.log({ heroes });

            response.writeHead(200);
            response.write(JSON.stringify(heroes));
            response.end();
        } catch (error) {
            console.log('an request error has happened', error);
            response.writeHead(500);
            response.write(JSON.stringify({ message: "internal server error!" }));
        }
    }


}

/*
    curl -i localhost:3000 -X POST --data '{ "name": "Batman", "age": "80" }'
*/



const server = createServer(handler).listen(3000, () => console.log('running at 3000 and process', process.pid));

const onStop = async (signal) => {
    console.info(`\n${signal} received`);

    console.log('Closing http server');
    await promisify(server.close.bind(server))();
    console.log('Http server has closed');

    console.log('Closing database connection');
    await client.close();
    console.log('Database connection has closed');

    //0 exited with success, 1 exited with error
    process.exit(0);
};

// SIGINT -> Ctrl C
// SIGTERM -> Kill
["SIGINT", "SIGTERM"].forEach(event => {
    process.on(event, onStop);
});
