import fs from 'fs';
// import admin, { auth } from 'firebase-admin';
import admin from 'firebase-admin';
import express from 'express';
import { MongoClient } from 'mongodb';
import { db, connectToDb } from './db.js';

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);

admin.initializeApp({
    credential: admin.credential.cert(credentials),
})

const app = express();
app.use(express.json());


/******************************************************
 * 
 * load user automatically from auth token
 * 
 ******************************************************/


app.use(async (req, response, next ) => {

    const  { authtoken } = req.headers;

    if (authtoken) {

        try {
            const user = await admin.auth().verifyIdToken(authtoken);
            response.user = user;    
        }
        catch (error) {
            console.log(`Server Error: ${error.message }`)

            //prevent next() from being called
            return response.sendStatus(400);
            
        }}   

        // in case req.user is empty
        req.user = req.user || {};

        next();
    })

/******************************************************
 * 
 * Endpoint for getting an article 
 * 
 ******************************************************/

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('react-blog-db');

    const article = await db.collection('articles').findOne({ name });

    if (article) {

        // default value is empty erray
        const upvoteIds = article.upvoteIds || [];

        // ensure user's ID isn't already in the upvote ID's array
        article.canUpvote = uid && !upvoteIds.includes(uid);  

        //res.send(article)
        res.json(article);
        console.log("article found")
    } else {
        res.sendStatus(404);
        console.log("article NOT found")
    }
});


/******************************************************
 * 
 * Middleware
 * 
 ******************************************************/


app.use((request, response, next ) => {

    if (request.user) {
        next();
    } 
    else {
        response.sentStatus(401);
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

    // same 3 lines as finding an artice
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('react-blog-db');


    const article = await db.collection('articles').findOne({ name });

    if (article) {

        // default value is empty erray
        const upvoteIds = article.upvoteIds || [];
        
        // ensure user's ID isn't already in the upvote ID's array
        const canUpvote = uid && !upvoteIds.includes(uid);  

        if (canUpvote) {

            //$inc is increment, $set is set
            await db.collection('articles').updateOne({name}, {
                $inc: {upvotes: 1},
                $push: { upvoteIds: uid },
            });
        }
  
        // load the updated article
        const updatedArticle = await db.collection('articles').findOne({name});

        
        // res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`);
        res.json(updatedArticle);
        console.log(`upvoted: the ${name} article now has ${article.upvotes} votes!!!`);
    }  
    else {
        res.send('That article doesn\'t exist!');
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

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('react-blog-db');

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy: email, text } },
    });
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        //res.send(article.comments);
        res.json(article.comments);
    } else {
        res.send('That article doesn\'t exist!');
    }
});

// connectToDb(() => {
//     console.log('Successfully connected to database!');
//     app.listen(8001, () => {
//         console.log('Server is listening on port 8001');
//     });
// })

app.listen(8001, () => {
    console.log('Server is listening on port 8001');
});