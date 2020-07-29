import React,{ Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

class Dashboard extends Component{

    state = {
        noOfDocs : ''
    }

    onClickHandler = (e) => {
        e.preventDefault();

        axios.get('users/get-users')
        .then(res => {
            this.setState({
                noOfDocs: res.data.no_of_documents
            })
        })
        .catch(err => console.log(err.response))
    }

    render(){
        return (
            <Container>
                <Row>
                    <Col xs={10} md={6} className="mx-auto mt-4">
                        <h3>Welcome to Dashboard Page.</h3>
                        <Button className="mt-4"
                        variant="outline-success"
                        onClick={this.onClickHandler}>
                         Fetch Docs
                        </Button>
                        <h6 className="mt-5">{`No of documents fetched: `+ this.state.noOfDocs}</h6>
                    </Col>
                </Row>
            </Container>
        )    
    }
}



export default Dashboard;