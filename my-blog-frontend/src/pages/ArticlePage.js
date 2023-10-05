import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import articles from "./article-content.js"
import NotFoundPage from "./NotFoundPage.js";
import axios from 'axios';
import CommentsList from "../components/CommentsList.js";
import CommentForm from "../components/CommentForm.js";

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
 

    const addUpvote = async () => {

        const response = await axios.put(`/api/articles/${articleId}/upvote`); 

        const updatedArticle = response.data;
        //setArticleInfo is used in loadArticleInfo and updatedArticle
        setArticleInfo(updatedArticle);        
    }
    

    if (!article) {
        return (
            <NotFoundPage />
        )
        
    }   
      return (
        <>
            <h1>{article.title}</h1>
            <div className="upvotes-section">
                <button onClick={addUpvote}>Upvote</button>
            </div>
            

            <p>This article has {articleInfo.upvotes} upvote(s)</p>
            {article.content.map((paragraph, index) => (
                
                <p key={index}>{paragraph}</p>
            ))}

            
                <CommentForm 
                    //we get articleName from URL paraemter
                    articleName={articleId}
                    //annonymous function
                    //setArticleInfo is used in loadArticleInfo and updatedArticle above
                    onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}
                />

                <CommentsList comments={articleInfo.comments} />
        </>        

    );

}

export default ArticlePage;