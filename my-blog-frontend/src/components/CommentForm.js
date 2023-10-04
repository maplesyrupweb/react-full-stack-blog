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
            <p>Add a Comment</p>
            <label htmlFor="name">Name:</label> 
            <input 
                type="text" 
                id="name" name="name" 
                value={name} 
                onChange={event => setName(event.target.value)}
            />

            <label htmlFor="comments">Comment:</label>
            <textarea 
                rows="4" 
                cols="50" 
                id="comments" 
                name="comments" 
                value={commentText} 
                onChange={event => setCommentText(event.target.value)}
            />
            <button 
                onClick={addComment}
                type="submit">
                Add Comment
            </button>
        </div>
    )  
}





export default CommentForm;