import express  from 'express';

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



app.listen(8001, () => {
    console.log("Server is listening on port 8001");
}); 