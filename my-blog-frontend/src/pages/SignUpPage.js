import { useState } from 'react';

const SignUpPage = () => {

    return(

        <>
        <h1>Create Account</h1>
 
            <form>
                <label>
                    Email:
                    <input type="email" />
                </label>
                
                <label>
                    Password:
                    <input type="password" />
                </label>
                

                <input type={"submit"}

                    style={{ backgroundColor: "#a1eafb" }} />
            </form>
        </>
    )

}

export default SignUpPage;