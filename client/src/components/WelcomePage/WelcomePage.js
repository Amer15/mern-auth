import React from 'react';
import { Container, Row, Col }  from 'react-bootstrap';
import { isAuth, getLocalStorage } from '../../utils/helper';


const WelcomePage = () => {
    let text;
    if(isAuth()){
      let name = getLocalStorage('user');
      text = <h2>Welcome, {name}</h2>
    }
    else{
        text = <>
         <h2>Welcome, user</h2>
        <p>Please Signin to continue to Dashboard</p>
        </>
    }

    
    return(
        <Container>
            <Row>
                <Col xs={10} md={6} className="mx-auto mt-4">
                     {text}
                </Col>
            </Row>
        </Container>
    )
}


export default WelcomePage;