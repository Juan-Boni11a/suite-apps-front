import { Button, Card, Form, Input, message } from 'antd';
import React, { useContext, useState } from 'react';
import { LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { postData } from '../../services/common/postData';
import { emailRgx } from '../../utils/exp';


export const FormLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { login } = useContext(AuthContext);


    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const datarequest = { email: values.email, password: values.password };
            /*const resp = await postData('api/users/login', datarequest)
            let resp: any = {}
            if (datarequest.email === "admin@mail.com" && datarequest.password === "123123") {
                resp = {
                    userData: datarequest,
                    token: 'ey1232131'
                }
            }
            */
            
            const resp = await postData('login', datarequest)
            console.log('resp', resp)
            if ('token' in resp && resp.token!=="") {
                const { token } = resp
                localStorage.setItem("userData", JSON.stringify(resp.userData));
                localStorage.setItem("token", token);
                login(resp.userData)
                message.success(`Bienvenido`)
                
            } else {
                message.error("Credenciales incorrectas");
                //message.error(resp.msg);
            }
            setLoading(false);
        } catch (error) {
            console.error('El error es: ' + error);
        }
    }
    return (

        <Card title="Inicio de Sesión">

            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Por favor ingrese su correo!' },
                        { type: 'email', message: 'Ingrese un email valido!' },
                        { pattern: emailRgx, message: "El email es incorrecto" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}
                    extra={<a onClick={() => navigate("/forget-password")}>Olvidé mi contraseña</a>}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className='button-login'
                        icon={<LoginOutlined />}
                        loading={loading}
                        disabled={loading}
                    >
                        Iniciar Sesión
                    </Button>
                </Form.Item>

                <label>No tienes cuenta?<a onClick={() => navigate("/register")}>Regístrate</a></label>
            </Form>
        </Card>
    )
}