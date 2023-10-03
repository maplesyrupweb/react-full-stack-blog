import express from 'express';
import { MongoClient } from 'mongodb';


// fake database
let articlesInfo = [{
    name: 'learn-react',
    upvotes: 0,
    comments: [],
},
{
    name: 'learn-node',
    upvotes: 0,
    comments: [],

},
{
    name: 'mongo-db',
    upvotes: 0,
    comments: [],
}
]

const app = express();
app.use(express.json());

/******************************************************
 * 
 * Endpoint for getting an article 
 * 
 ******************************************************/

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('react-blog-db');

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article);
        console.log("article found")
    } else {
        res.sendStatus(404);
        console.log("article NOT found")
    }
});

/******************************************************
 * 
 * Endpoint for upvoting an article
 * 
 ******************************************************/


app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;

    // same 3 lines as finding an artice
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('react-blog-db');

    //$inc is increment, $set is set
    await db.collection('articles').updateOne({name}, {$inc: {upvotes: 1},
    })

    // load the updated article
    const article = await db.collection('articles').findOne({name})

    if (article) {
        res.send(`The ${name} article now has ${article.upvotes} upvotes!!!`);
        console.log(`upvoted: the ${name} article now has ${article.upvotes} votes!!!`)
    } else {
        res.send('That article doesn\'t exist');
        console.log('That article doesn\'t exist' );
    }
});

/******************************************************
 * 
 * Endpoint for adding a comment to article
 * 
 ******************************************************/


app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('react-blog-db');

    await db.collection('articles').updateOne({ name }, {
        $push: { comments: { postedBy, text } },
    });
    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.send(article.comments);
    } else {
        res.send('That article doesn\'t exist!');
    }
});

app.listen(8001, () => {
    console.log('Server is listening on port 8001');
});