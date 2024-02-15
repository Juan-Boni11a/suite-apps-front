import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Layout, Menu, MenuTheme, Modal, Row, Col, MenuProps, Dropdown, Space, Typography, Tag } from "antd";
import {
    MenuOutlined,
    UserOutlined,
    DownOutlined,
} from "@ant-design/icons";
import "./styles.css";
import { AuthContext } from "../../../context/AuthContext";


interface IMenuOptionsProps {
    theme?: MenuTheme;
    closeModal?: any
}

const MenuOptions = ({ theme = "dark", closeModal = () => console.log('Default close') }: IMenuOptionsProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user }: any = useContext(AuthContext)
    console.log('user', user)

    const isAdmin = user.role.id !== 2 ? true : false


    const goToPage = (page: string) => {
        //Se valida que la ruta la que quiero ir es diferente a la de origen, sino no tiene sentido navegar ni reiniciar el state de items
        if (location.pathname !== page) {
            navigate(page);
            closeModal()
        }
    };

    return (
        <Menu theme={theme} mode="inline" className="auth-menu">
            <>
                <Menu.Item
                    key="12"
                    className="navbar-brand"
                    onClick={() => goToPage("/selection")}
                >
                    Inicio
                </Menu.Item>
                {
                    isAdmin && (

                        <Menu.Item
                            key="0"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/")}
                        >
                            Dashboard
                        </Menu.Item>
                    )
                }
                <Menu.Item
                    key="1"
                    className="navbar-brand"
                    onClick={() => goToPage("/transports/movilizationOrders")}
                >
                    Solicitudes de movilización
                </Menu.Item>
            </>

            {
                isAdmin && (
                    <>

                        <Menu.Item
                            key="4"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/solicitudMantenimiento")}
                        >
                            Solicitudes de Mantenimiento
                        </Menu.Item>
                        <Typography.Text style={{ color: 'white' }} >Administración</Typography.Text>
                        <Menu.Item
                            key="5"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/conductores")}
                        >
                            Conductores
                        </Menu.Item>
                        
                        <Menu.Item
                            key="6"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/vehiculos")}
                        >
                            Vehículos
                        </Menu.Item>
                        <Menu.Item
                            key="7"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/ciudades")}
                        >
                            Ciudades
                        </Menu.Item>
                        <Menu.Item
                            key="8"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/estaciones")}
                        >
                            Estaciones de servicio
                        </Menu.Item>
                        <Menu.Item
                            key="9"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/tiposMovilizacion")}
                        >
                            Tipos de movilización
                        </Menu.Item>
                        <Menu.Item
                            key="10"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/parasMovilizacion")}
                        >
                            Tipo Persona
                        </Menu.Item>
                       
                        <Menu.Item
                            key="13"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/actividades")}
                        >
                            Actividades
                        </Menu.Item>
                        <Menu.Item
                            key="11"
                            className="navbar-brand"
                            onClick={() => goToPage("/transports/vigenciasMovilizacion")}
                        >
                            Vigencias
                        </Menu.Item>

                    </>
                )
            }
        </Menu>
    );
};

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="mobile-menu">
            <Button
                type="primary"
                icon={<MenuOutlined />}
                onClick={() => setIsOpen(true)}
            />
            <Modal open={isOpen} footer={null} onCancel={() => setIsOpen(false)}>
                <div style={{ marginTop: 20 }}>
                    <MenuOptions theme="light" closeModal={() => setIsOpen(false)} />
                </div>
            </Modal>
        </div>
    );
};


const MyDrop = ({ user, logout }: any) => {
    const navigate = useNavigate()

    const fullLogout = () => {
        logout()
        localStorage.clear();
        navigate('/')
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a rel="noopener noreferrer" onClick={fullLogout}>
                    Cerrar sesión
                </a>
            ),
        },
    ];

    return (
        <Dropdown
            menu={{ items }}
        >
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <UserOutlined />
                    {user.email}
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    )
}




export const SideBar = ({ children }: any) => {
    const { Content, Footer, Sider } = Layout;
    const [collapsed, setCollapsedt] = useState(false);
    const onCollapse = (collapsed: boolean) => setCollapsedt(collapsed);

    const { user, logout }: any = useContext(AuthContext);

    console.log('user', user)

    const isAdmin = user.role.id !== 2 ? true : false

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={onCollapse}
                    className="desktop-sidebar"
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                    }}
                >
                    <div className="logo" />
                    <MenuOptions />
                </Sider>

                <Layout className="custom-right"
                    style={{ marginLeft: !collapsed ? 200 : 80 }}>
                    <Layout.Header style={{ padding: 0, background: 'white' }}>
                        <Row>
                            <Col xxl={20} xl={20} lg={20} md={20} sm={14} xs={14} style={{ paddingLeft: 28, paddingTop: 4 }}>
                                <img src="./trLogin.png" alt="" style={{ height: 60 }} />
                            </Col>
                            <Col xxl={4} xl={4} lg={4} md={4} sm={10} xs={10}>
                                <span style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }} >
                                    {isAdmin ? <Tag color="green">Administrador</Tag> : <Tag color="blue">Cliente</Tag>}
                                    <MyDrop user={user} logout={logout} />
                                </span>
                            </Col>
                        </Row>
                    </Layout.Header>
                    <Content style={{ background: 'white' }}>
                        <div style={{ padding: 24, minHeight: 360 }}>
                            {children}
                        </div>
                        <MobileMenu />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};
