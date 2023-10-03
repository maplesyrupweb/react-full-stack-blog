import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import articles from "./article-content.js"
import NotFoundPage from "./NotFoundPage.js";
import axios from 'axios';

const ArticlePage = () => {

    // initial state is 0 votes, no comments
    const [articleInfo, setArticleInfo] = useState({
        upvotes: 0 , comments: []});

    const { articleId } = useParams();

    useEffect(() => {
        const loadArticleInfo = async () => {
            const response = await axios.get(`/api/articles/${articleId}`);
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        loadArticleInfo();
    }, []);

        
        
    const article = articles.find(article =>
        article.name === articleId);
 
    if (!article) {
        return (
            <NotFoundPage />
        )
        
    }   
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

export default ArticlePage;