import {useState} from 'react';
import axios from 'axios';


const CommentForm = ({articleName, onArticleUpdated}) => {


    const [name, setName] = useState('');
    const [commentText, setCommentText] = useState('');

    const addComment = async () =>{
        const response = await axios.post(`/api/articles/${articleName}/comments`, {
            postedBy: name,
            text: commentText,
        });

    const updatedArticle = response.data;
    onArticleUpdated = updatedArticle;

    //addComment is not used?

    // Clear the input
    setName('');
    setCommentText('');

} 

    
    return (
        <div id="add-comment-form">
            <h3>Add a Comment</h3>
            <label htmlFor="name">Name:
                <input 
                    type="text" 
                    id="name" name="name" 
                    value={name} 
                    onChange={event => setName(event.target.value)}
                />
            </label> 

            <label htmlFor="comments">Comment:
                <textarea 
                    rows="4" 
                    cols="50" 
                    id="comments" 
                    name="comments" 
                    value={commentText} 
                    onChange={event => setCommentText(event.target.value)}
                />
            </label>
            <button 
                onClick={addComment}>
                Add Comment
            </button>
        </div>
    )  
}





export default CommentForm;