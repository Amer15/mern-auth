import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './ForgotPassword.module.css'


toast.configure();

class ForgotPassword extends Component {
    constructor(){
        super();

        this.state = {
            email: ''
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
          [e.target.name] : e.target.value
        })
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.setState({
            submitting: true
        })

        if(this.state.email.length === 0){
            this.notify('error', 'email should not be empty.')
            return false
        }


        const { email } = this.state;
        const userData = {
            email
        }

        axios.post("users/forgot-password", userData, {
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => {
                // console.log(response.data.message);
                this.setState({
                    email: '',
                    submitting: false
                });
                this.notify('success', response.data.message)
            })
            .catch(err => {
        
                this.notify('error', 'failed to send email.')
                this.setState({
                    email: '',
                    submitting: false
                })
            })
    }


    render() {
        let btnText = this.state.submitting ? 'Submitting...' :  'Submit'
        return (
            <Container fluid>
            <Row className={classes.row}>
                <Col sm={12} md={8} className={classes.col}>
                    <div className={classes.formContainer}>
                        <h2>FORGOT PASSWORD</h2>
                        <div className={classes.underline}></div>
                        <form method="POST" onSubmit={this.onSubmitHandler}>
                            <div className = {classes.formGroup}>
                                <label for="email">Email</label>
                                <input type="email" 
                                name="email" 
                                placeholder="Enter email" 
                                value={this.state.email}
                                onChange={this.onChangeHandler} />
                            </div>

                            <p>Please provide an email linked to your account.</p>
                            <button className= {classes.submitBtn}>
                               {btnText}
                            </button>
                        </form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
    }
}

export default ForgotPassword;