import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import classes from './RegisterForm.module.css';
import 'react-toastify/dist/ReactToastify.css';


toast.configure();

class RegisterForm extends Component {
    constructor() {
        super();

        this.state = {
            name: '',
            email: '',
            password: '',
            submitting: false
        }
    }

    notify = (type, value) => {
        if (type === 'success') {
            toast.success(value, { autoClose: 8000 });
        }

        if (type === 'error') {
            toast.error(value, { autoClose: 8000 });
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

        const { name, email, password } = this.state;

        const userData = {
            name,
            email,
            password
        }

        axios.post("/users/sign-up", userData, {
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => {
                // console.log(response.data.message);
                this.setState({
                    name: '',
                    email: '',
                    password: '',
                    submitting: false
                });
                this.notify('success', response.data.message)
            })
            .catch(error => {

                if (error.response.data.error) {
                    this.notify('error', error.response.data.error)
                }
              
    
                this.setState({
                    name: '',
                    email: '',
                    password: '',
                    submitting: false
                })
            })
    }


    render() {
        let btnText = this.state.submitting ? <Spinner animation="border" size="sm" /> : 'Register';

        return (
            <Container fluid>
                <Row className={classes.row}>
                    <Col sm={12} md={8} className={classes.row}>
                        <div className={classes.formContainer}>
                            <h2 className={classes.heading}>SIGN UP</h2>
                            <div className = {classes.underline}></div>
                            <form className={classes.form} method="POST" onSubmit={this.onSubmitHandler}>
                                <div className = {classes.formGroup}>
                                    <label className={classes.label} for="name">Username</label>
                                    <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Enter name"
                                    value={this.state.name}
                                    onChange={(e) => this.onChangeHandler(e)}  />
                                </div>
                                <div className = {classes.formGroup}>
                                    <label className={classes.label} for="email">Email</label>
                                    <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Enter email" 
                                    value={this.state.email}
                                    onChange={(e) => this.onChangeHandler(e)} />
                                </div>
                                <div className = {classes.formGroup}>
                                    <label className={classes.label} for="password">Password</label>
                                    <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Enter password" 
                                    value={this.state.password}
                                    onChange={(e) => this.onChangeHandler(e)}/>
                                </div>

                                <button className = {classes.submitBtn}>
                                    {btnText}
                                </button>
                            </form>
                            <div id="horizontal-line"></div>
                            <p>Already have an acccount ?</p>
                            <button className = {classes.forgotPasswordBtn}><Link to='/signin'>Sign in</Link></button>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}


export default RegisterForm;