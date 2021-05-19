import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/input/Input';

const emailReducer = (state, action) => {
  if(action.type === 'USER_INPUT') {
    return {value: action.val, isValid:action.val.includes('@')};
  }
  if(action.type ==='INPUT_BLUR') {
    return {value:state.value, isValid:state.value.includes('@')};
  }
  return {value: '', isValid:false}
};


const passReducer = (state, action) => {
  if(action.type === 'USER_INPUT') {
    return {value:action.val, isValid:action.val.trim().length > 6};
  }
  if(action.type === 'INPUT_BLUR') {
    return {value:state.value, isValid:state.value.trim().length > 6};
  }
    return {value: '', isValid: false}
};

const Login = (props) => {

  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passInputRef = useRef();
  // const [enteredEmail, setEnteredEmail] = useState('');
  // // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [passState, dispatchPassword] = useReducer(passReducer, {
    value: '',
    isValid: null,
  })

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const {isValid: emailIsValid} = emailState;
  const {isValid: passIsValid} = passState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('CHECKING FORM VALIDITY')
      setFormIsValid(
        emailIsValid && passIsValid
      )
    }, 500)

    return () => {
      console.log('CLEANING');
      clearTimeout(identifier);
    }

  }, [emailIsValid, passIsValid]);


  const emailChangeHandler = (event) => {
    dispatchEmail({type:'USER_INPUT', val:event.target.value});

    // setFormIsValid(
    //   event.target.value.includes('@') && passState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type:'USER_INPUT', val:event.target.value});

    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6 
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type:'INPUT_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid) {
      authCtx.onLogin(emailState.value, passState.value);
    } else if(!emailIsValid) {
      emailInputRef.current.cursorPoint();
    } else {
      passInputRef.current.cursorPoint();
    }
    
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input id='email' type='email' label='E-mail'
        ref={emailInputRef}
        isValid={emailIsValid}
        value={emailState.value}
        onChange={emailChangeHandler}
        onBlur={validateEmailHandler}
        />
        <Input id='password' type='password' label='Password'
        ref={passInputRef}
        isValid={passIsValid}
        value={passState.value}
        onChange={passwordChangeHandler}
        onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
