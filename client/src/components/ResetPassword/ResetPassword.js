import React, { Component } from 'react';
import axios from 'axios';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classes from './ResetPassword.module.css';


toast.configure();

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newPassword: '',
            submitting: false
        }
    }


    notify = (type, value) => {
        if (type === 'success') {
            toast.success(value, { autoClose: 5000 });
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

        const body = {
            token: this.props.match.params.token,
            newPassword: this.state.newPassword
        }

        axios.post('users/reset-password', body, {
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => {
                this.setState({
                    newPassword: '',
                    submitting: false
                });
                this.notify('success', response.data.message);
                this.props.history.push('/signin')
            })
            .catch(err => {
                // console.log(err);
                const { error } = err.response.data;
                this.notify('error', error)
                this.setState({
                    newPassword: '',
                    submitting: false
                })
            })

    }


    render() {
        let btnText = this.state.submitting ? <Spinner animation="border" size="sm" /> : 'Submit';

        return (
            <Container fluid>
                <Row className={classes.row}>
                    <Col sm={12} md={8} className={classes.col}>
                        <div className={classes.formContainer}>
                            <h2>RESET PASSWORD</h2>
                            <div className={classes.underline}></div>
                            <form method="POST" onSubmit={this.onSubmitHandler}>
                                <div className={classes.formGroup}>
                                    <label for="newPassword">New Password</label>
                                    <input type="password"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        value={this.state.newPassword}
                                        onChange={this.onChangeHandler} />
                                </div>
                                <button className={classes.submitBtn}>
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

export default ResetPassword;

