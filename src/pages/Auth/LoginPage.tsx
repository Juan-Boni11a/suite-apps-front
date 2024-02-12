import {Col, Row } from 'antd';
import './styles.css';
import { FormLogin } from '../../components/Login/FormLogin';


const LoginPage = () => {
    
    return(
        <>
        <div className='content-principal'>
            <Row>
                <Col xxl={12} xl={12} lg={12}  md={24} sm={24} xs={24} className="login-first-col">
                    <img width={500} src="./mainLogin.svg" alt="" />
                </Col>
                
                <Col xxl={12} xl={12} lg={12}  md={24} sm={24} xs={24} className="login-second-col">
                    <FormLogin />
                </Col>
            </Row>
        </div>
        </>
    )
}

export default LoginPage;