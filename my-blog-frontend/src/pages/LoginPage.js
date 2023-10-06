import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    
    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);   
            console.log("successful");
            //route after successful login
            navigate('/articles');
        }
        catch (error) {
            setError(error.message);
            console.log(`Error: ${error}`)
        }
        
    }
    
    return (
    <>
        <h1>Login Page</h1>

        {error && <p className="error">{error}</p> }

            <input 
                type="email" 
                placeholder='Email'
                id="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
            />
            <input 
                type="password"
                placeholder='Password'
                id="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
            />

            <button onClick={logIn}>Log In</button>

            <Link to="/signup">Sign Up</Link>                
            
        </>
    )
}

export default LoginPage;