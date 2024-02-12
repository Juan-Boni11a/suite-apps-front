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
            const resp = await postData('api/login', datarequest)
            
            if ('token' in resp && resp.token !== "") {
                if (resp.userData.active && resp.userData.role.id !== 3) {
                    const { token } = resp
                    localStorage.setItem("userData", JSON.stringify(resp.userData));
                    localStorage.setItem("token", token);
                    login(resp.userData)
                    message.success("Bienvenido")
                }else{
                    message.warning("Su usuario no tiene acceso al sistema, por favor contáctese con el administrador del sistema")
                }

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
                        //{ pattern: emailRgx, message: "El email es incorrecto" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}
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

            </Form>
        </Card>
    )
}