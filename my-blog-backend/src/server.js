import express  from 'express';

//localhost:3003/aricles/learn-node
// PUT /articles/learn-react/upvote

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

/********************************************
 * 
 * Endpoint for upvote
 * 
 ********************************************/


app.put('/api/articles/:name/upvote', (request, response) => {
    const { name } = request.params
    
    const article = articlesInfo.find(
        
        articleSearch => articleSearch.name === name);

        if (article) {
            article.upvotes++;   
            response.send(`The ${name} has ${article.upvotes} upvotes`);
        }
        else
        {
            response.send(`Sorry dude. That article doesn\'t' exist.`);

            
        }
});

/********************************************
 * 
 * Endpoint for adding a comment
 * 
 ********************************************/

app.post('/api/articles/:name/comments', (request, response) => {
    const { name } = request.params;
    const { postedBy, text } = request.body
    
    const article = articlesInfo.find(
    
        articleSearch => articleSearch.name === name);

        if (article) {
            
            article.comments.push({postedBy,text})
            response.send(article.comments)
            console.log(postedBy);
            console.log(text);

            // response.send(`Posted by: ${request.body.postedBy} and text: ${request.body.text}`)

            
        }
        else
        {
            response.send(`Sorry. Comment not added`);

            
        }
});


app.listen(8001, () => {
    console.log("Server is listening on port 8001");
}); 