import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';


const SignUpPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    

    const signUp = async () => {
        try {
            if (password !== password2) {

                setError('Password do not match.');
                console.log(`Passwords don't match: ${error}`)
                return;
                
            }
                console.log(`Password match ${password} and ${password2}`)
                await createUserWithEmailAndPassword(getAuth(), email, password);
                navigate('/articles');
        }
        catch (error) {
            setError(error.message);
            console.log(`Sign up error: ${error.message }`)
        }
    }

    return (
        <>
            <h1>Sign up</h1>
    
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

                <input 
                    type="password"
                    placeholder='Confirm password'
                    id="password2"
                    value={password2}
                    onChange={event => setPassword2(event.target.value)}
                />
    
                <button onClick={signUp}>Sign Up</button>
    
                <Link to="/login">Log In</Link>                
                
            </>
        )
    }

export default SignUpPage;