import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import articles from "./article-content.js"
import NotFoundPage from "./NotFoundPage.js";
import axios from 'axios';
import CommentsList from "../components/CommentsList.js";
import CommentForm from "../components/CommentForm.js";
import useUser from "../hooks/useUser.js";
import { Link } from 'react-router-dom';


const ArticlePage = () => {

    // initial state is 0 votes, no comments
    const [articleInfo, setArticleInfo] = useState({
        upvotes: 0 , comments: []});

    const { articleId } = useParams();

    const { user, isLoading  } = useUser();


    useEffect(() => {
        const loadArticleInfo = async () => {
            //make sure user exists
            const token = user && await user.getIdToken();

            const headers = token ? {authtoken: token} : {};

            const response = await axios.get(`/api/articles/${articleId}`, 
            { headers });
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }

        loadArticleInfo();
    }, []);

    
    
        
    const article = articles.find(article =>
        article.name === articleId);
 

    const addUpvote = async () => {

        const token = user && await user.getIdToken();

        const headers = token ? {authtoken: token} : {};

        //axios put request requires null in 2nd arg
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers});

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

            {user
                ?  <button onClick={addUpvote}>Upvote</button> 
                :  <Link to="/login">Log in to upvote</Link>

            }

               
            </div>
            

            <p>This article has {articleInfo.upvotes} upvote(s)</p>
            {article.content.map((paragraph, index) => (
                
                <p key={index}>{paragraph}</p>
            ))}

            
                {user 
                    ?

                    <CommentForm 
                    //we get articleName from URL paraemter
                    articleName={articleId}
                    //annonymous function
                    //setArticleInfo is used in loadArticleInfo and updatedArticle above
                    onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}
                    />
                    : <Link to="/login">Log in to comment</Link>
 
                
                }
            
                

                <CommentsList comments={articleInfo.comments} />
        </>        

    );

}

export default ArticlePage;