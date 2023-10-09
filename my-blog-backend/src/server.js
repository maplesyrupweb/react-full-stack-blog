import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import { db, connectToDb } from './db.js';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminPassword = encodeURIComponent( process.env.MONGO_PASSWORD );
console.log(adminPassword);

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

// static serve build folder copied from frontend
app.use(express.static(path.join(__dirname, '../build')));


// reg expression that handles all the routes that don't start with API
// app.get(/^(?!\/api)).+/, (req, res) => { 
//     res.sendFile(path.join(__dirname, '..build/inde.html'));
// })

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})


/******************************************************
 * 
 * load user automatically from auth token
 * 
 ******************************************************/


app.use(async (req, res, next) => {
    const { authtoken } = req.headers;

    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch (e) {
            return res.sendStatus(400);
        }
    }

    req.user = req.user || {};

    next();
});

/******************************************************
 * 
 * Endpoint for getting an article 
 * 
 ******************************************************/


app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    // const client = new MongoClient('mongodb://127.0.0.1:27017');
    // const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dev0vku.mongodb.net/?retryWrites=true&w=majority`)

    

    const client = new MongoClient(`mongodb+srv://node-server:${process.env.MONGO_USERNAME}:${adminPassword}@cluster0.dev0vku.mongodb.net/?retryWrites=true&w=majority`);
    
    
    // mongosh "mongodb+srv://cluster0.dev0vku.mongodb.net/" --apiVersion 1 --username node-server

    await client.connect();
    const db = client.db('react-blog-db');


    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.includes(uid);
        res.json(article);
    } else {
        res.sendStatus(404);
    }
});

/******************************************************
 * 
 * Middleware
 * 
 ******************************************************/


app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
        console.log("401. User is not allowed to access the resource.");
    }
});

/******************************************************
 * 
 * Endpoint for upvoting an article
 * 
 ******************************************************/


app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    // const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dev0vku.mongodb.net/?retryWrites=true&w=majority`)

    const client = new MongoClient(`mongodb+srv://node-server:${process.env.MONGO_USERNAME}:${adminPassword}@cluster0.dev0vku.mongodb.net/?retryWrites=true&w=majority`);
    
    
    await client.connect();
    const db = client.db('react-blog-db');


    const article = await db.collection('articles').findOne({ name });

    if (article) {
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);
   
        if (canUpvote) {
            await db.collection('articles').updateOne({ name }, {
                $inc: { upvotes: 1 },
                $push: { upvoteIds: uid },
            });
        }

        const updatedArticle = await db.collection('articles').findOne({ name });
        res.json(updatedArticle);
    } else {
        res.send('That article doesn\'t exist');
    }
});

/******************************************************
 * 
 * Endpoint for adding a comment to article
 * 
 ******************************************************/


app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { text } = req.body;
    const { email } = req.user;

    // const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dev0vku.mongodb.net/?retryWrites=true&w=majority`)

    const client = new MongoClient(`mongodb+srv://node-server:${process.env.MONGO_USERNAME}:${adminPassword}@cluster0.dev0vku.mongodb.net/?retryWrites=true&w=majority`);
    
    
    await client.connect();
    const db = client.db('react-blog-db');

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy: email, text } },
    });
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article);
    } else {
        res.send('That article doesn\'t exist!');
    }
});

const PORT = process.env.PORT || 8001;

connectToDb(() => {
    console.log('Successfully connected to database!');
    app.listen(PORT, () => {
        console.log('Server is listening on port ' + PORT);
    });
})


