import React from 'react';
import Form from './Form/Form'

const RegisterForm = (props) => {
    return ( <Form isRegisterForm={true} {...props}></Form> );
}
 
export default RegisterForm