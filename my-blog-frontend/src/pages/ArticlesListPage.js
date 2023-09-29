import articles from "./article-content.js"
import ArticlesList from "../components/ArticlesList.js";

const ArticlesListPage = () => {
    
    
    return (
        <>
            <ArticlesList 
                articles={articles}
            />
        
        </>

    )
}

export default ArticlesListPage;