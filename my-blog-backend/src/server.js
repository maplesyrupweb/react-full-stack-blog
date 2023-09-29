import express  from 'express';

//localhost:3003/aricles/learn-node
// PUT /articles/learn-react/upvote

const app = express();
app.use(express.json());

app.get('/hello', (request,response) => {
    console.log(request.body);
    response.send(`GET - Hello, ${request.body.name}`);
    
});

app.post('/hello', (request,response) => {
    console.log(request.body);
    response.send(`POST - Hello, ${request.body.name}`);
});

app.get('/hello/:name', (request, response)  => {
    // const name = request.params.name; 
    const { name } = request.params;
    response.send(`Hello there ${name}!!`);
});

app.get('/hello/:name/goodbye/:otherName', (request, response)  => {
    console.log(request.params);
    const { name } = request.params;
    const { otherName } = request.params;
    response.send(`Hello there ${name} Goodbye ${otherName}`);
});



app.listen(8001, () => {
    console.log("Server is listening on port 8001");
}); 