import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import articles from "./article-content.js"
import NotFoundPage from "./NotFoundPage.js";

const ArticlePage = () => {

    // initial state is 0 votes, no comments
    const [articleInfo, setArticleInfo] = useState({
        upvotes: 0 , comments: [] 
    })

    const { articleId } = useParams();

    useEffect(() => {
        setArticleInfo( {upvotes: Math.ceil(Math.random() * 10), comments: [] })
    }, []);

    
    // const articleId = params.articleId;
    // const { articleId } = params;


    //find articl from articles array with matching article ID 
    const article = articles.find(article =>
        article.name === articleId);
 
    if (!article) {
        return (
            <NotFoundPage />
        )
        
    } else {
        //<></> is react fragment
  
    return (
        <>
        <h1>{article.title}</h1>
        <p>This article has {articleInfo.upvotes} upvote(s)</p>
        {article.content.map((paragraph, index) => (
            
            <p key={index}>{paragraph}</p>
        ))}
        </>        

    );
    }
 
    
}

export default ArticlePage;