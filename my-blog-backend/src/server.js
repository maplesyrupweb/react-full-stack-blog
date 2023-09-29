import express  from 'express';

//localhost:3003/aricles/learn-node
// PUT /articles/learn-react/upvote

// fake database
let articlesInfo = [{
    name: 'learn-react',
    upvotes: 0
},
{
    name: 'learn-node',
    upvotes: 0
},
{
    name: 'mongo-db',
    upvotes: 0
}
]

const app = express();
app.use(express.json());


app.put('/api/articles/:name/upvote', (request, response) => {
    const { name } = request.params
    // const name = request.params.name
    const article = articlesInfo.find(
        // a => a.name === articlesInfo[name]
        a => a.name === name);
        if (article) {
            article.upvotes++;   
            response.send(`The ${name} has ${article.upvotes} upvotes`);
        }
        else
        {
            response.send(`That article doesn\'t' exist`);
        }
});

app.listen(8001, () => {
    console.log("Server is listening on port 8001");
}); 