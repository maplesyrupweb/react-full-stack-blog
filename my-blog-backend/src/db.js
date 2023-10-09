import { MongoClient } from 'mongodb';

let db;

async function connectToDb(cb) {

    // const client = new MongoClient('mongodb://127.0.0.1:27017');

    const adminPassword = encodeURIComponent( process.env.MONGO_PASSWORD );


    const client = new MongoClient(`mongodb+srv://node-server:${process.env.MONGO_USERNAME}:${adminPassword}@cluster0.dev0vku.mongodb.net/?retryWrites=true&w=majority`);
    
    // copied from Mongo DB dashboad
    // mongodb+srv://node-server:<password>@cluster0.dev0vku.mongodb.net/?retryWrites=true&w=majority

    
    

    await client.connect();
    const db = client.db('react-blog-db');
    cb();
}

export {
    db,
    connectToDb,
};