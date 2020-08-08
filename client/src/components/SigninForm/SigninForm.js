import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { storeAuthDetails, isAuth } from '../../utils/helper';
import classes from './SigninForm.module.css';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

class SigninForm extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            submitting: false
        }
    }

    notify = (type, value) => {
        if (type === 'success') {
            toast.success('Welcome back ' + value, { autoClose: 5000 });
        }

        if (type === 'error') {
            toast.error(value, { autoClose: 5000 });
        }
    }

    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmitHandler = (e) => {
        e.preventDefault();

        this.setState({
            submitting: true
        })

        const { email, password } = this.state;
        const userData = {
            email,
            password
        }

        axios.post('api/users/sign-in', userData, {
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => {
                // console.log(response);

                this.setState({
                    email: '',
                    password: '',
                    submitting: false,
                });

                storeAuthDetails(response);

                this.notify('success', response.data.user);

                isAuth() ? this.props.history.push('/dashboard') : this.props.history.push('/signin');

                // isAuth() ? window.location.href = '/dashboard' : this.props.history.push('/signin');
            })
            .catch(error => {
                if(error.response.data.error){
                    this.notify('error', error.response.data.error);
                }
            
                this.setState({
                    submitting: false
                })
            })
    }


    render() {
        let btnText = this.state.submitting ? <Spinner animation="border" size="sm" /> : 'Sign in';

        return (
            <Container fluid>
                <Row className={classes.row}>
                    <Col sm={12} md={8} className={classes.col}>
                        <div className={classes.formContainer}>
                            <h2>SIGN IN</h2>
                            <div className={classes.underline}></div>
                            <form method="POST" onSubmit={this.onSubmitHandler}>
                                <div className={classes.formGroup}>
                                    <label className={classes.label} for="email">Email</label>
                                    <input type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        autoComplete="off"
                                        value={this.state.email}
                                        onChange={(e) => this.onChangeHandler(e)} />
                                </div>
                                <div className={classes.formGroup}>
                                    <label className={classes.label} for="password">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={this.state.password}
                                        onChange={(e) => this.onChangeHandler(e)} />
                                </div>


                                <button className={classes.submitBtn}>
                                    {btnText}
                                </button>
                            </form>
                            <button className={classes.forgotPasswordBtn}>
                                <Link to='/forgot-password'>Forgot Password</Link>
                            </button>
                            <div className={classes.horizontalLine}></div>
                            <p>Don't have an account ?</p>
                            <button className={classes.registerBtn}>
                                <Link to='/register'>Register</Link>
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default SigninForm;