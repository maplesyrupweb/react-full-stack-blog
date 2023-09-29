import { useParams } from "react-router-dom";
import articles from "./article-content.js"
import NotFoundPage from "./NotFoundPage.js";

const ArticlePage = () => {
    const { articleId } = useParams();
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

        {article.content.map((paragraph, index) => (
            
            <p key={index}>{paragraph}</p>
        ))}
        </>        

    );
    }
 
    
}

export default ArticlePage;