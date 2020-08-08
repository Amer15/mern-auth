import React, { Component } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


toast.configure();


class ActivationPage extends Component {

    notify = (type, value) => {
        if (type === 'success') {
            toast.success(value, { autoClose: 8000 });
        }

        if (type === 'error') {
            toast.error(value, { autoClose: 8000 });
        }
    }

    onClickHandler = () => {
        const { token } = this.props.match.params;

        axios.post('users/activate-account', { token },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response.status);
                this.notify('success', response.data.message)
            })
            .catch(err => {
                const { error } = err.response.data;
                console.log(err.response.status);
                this.notify('error', error)
            })
    }



    render() {
        const { token } = this.props.match.params;

        const { name } = jwt.decode(token);
        return (
            <Container>
                <Row>
                    <Col xs={10} md={6} className="mx-auto mt-4">
                        <h3>Hey {name}, Welcome to activation Page.</h3>
                        <p className="mb-4">Please click on the activate button to activate your account.</p>
                        <Button className="mt-4"
                        variant="outline-success"
                        onClick={this.onClickHandler}>
                         Activate Now
                        </Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ActivationPage;