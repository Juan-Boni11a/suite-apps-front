import { Button, Card, Col, Descriptions, Form, Image, Modal, Row, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/es'
import { putData } from "../../../services/common/putData";
import { getData } from "../../../../services/common/getData";
import UserForm from "../../../../components/Forms/UserForm";

dayjs.locale('es')

const labelStyles = { fontWeight: 'bolder', color: 'black' }


function DriversPage() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false)

    const [refresh, setRefresh] = useState(false)


    const [selectedUser, setSelectedUser] = useState<any>(null)

    async function initialRequest() {
        setLoading(true)
        const request = await getData('api/users?includeInactive=' + true)
        console.log('r', request)

        if (request.length > 0) {
            const drivers = request.filter((user: any) => 'role' in user && user.role !== null && user.role.id === 3)
            setUsers(drivers)
            setLoading(false)
        } else {
            setLoading(false)
        }


    }

    useEffect(() => {
        initialRequest()
    }, [refresh])



    async function handleChangeState(user: any) {
        console.log('user', user)

        const request = await putData('api/users/' + user.id + "/change_state", {
            ...user,
            active: !user.active
        })

        if ('name' in request) {
            setRefresh(!refresh)
        }

    }

    const handleModal = () => setOpenModal(!openModal)

    const handleRefresh = () => setRefresh(!refresh)


    const [showDetails, setShowDetails] = useState(false)

    const handleShowDetails = (user: any) => {
        setSelectedUser(user)
        setShowDetails(!showDetails)
    }


    const columns = [
        {
            title: 'Foto',
            key: 'Y',
            render: (record: any) => (
                record.avatarUrl !== null ? (
                    <Image
                        width={75}
                        src={record.avatarUrl}
                    />
                ) : (
                    <Image
                        width={75}
                        src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                    />
                )
            )
        },
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Apellido",
            dataIndex: "lastname",
            key: "lastname",
        },
        {
            title: "No. cédula",
            dataIndex: "ci",
            key: "ci",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Número de teléfono",
            dataIndex: "phone_number",
            key: "phone_number",
        },
        {
            title: 'Estado',
            key: 'B',
            render: (record: any) => (
                'active' in record && (
                    <>
                        {record.active ? <Tag color="blue">ACTIVO</Tag> : <Tag color="red">INACTIVO</Tag>}
                    </>

                )

            ),
        },
        {
            title: 'Acciones',
            key: 'X',
            render: (record: any) => (
                <>
                    <Button type="primary" onClick={() => {
                        console.log('r', record)
                        handleChangeState(record)
                    }}
                    style={{ marginBottom: 12 }}>
                        {record.active ? 'Desactivar conductor' : 'Activar conductor'}
                    </Button>

                    <Button type="primary" onClick={() => {
                        console.log('r', record)
                        handleShowDetails(record)
                    }}>
                        Ver detalles
                    </Button>
                </>
            )
        }
    ];

    return (
        <>
            <Card title="Conductores" extra={<Button onClick={handleModal} type="primary">Agregar</Button>} >
                <Table columns={columns} dataSource={users} loading={loading} pagination={{ pageSize: 20 }} />
                <Modal open={openModal} title="Conductor" onCancel={handleModal} footer={null}>
                    <UserForm handleModal={handleModal} handleRefresh={handleRefresh} toDriver={true} />
                </Modal>

                <Modal open={showDetails} title="Detalles de conductor" onCancel={() => {
                    setSelectedUser(null)
                    setShowDetails(false)

                }} footer={null} width={"40%"}>
                    {selectedUser !== null &&
                        <Row justify="center">
                            <Col span={8}>
                                {selectedUser.avatarUrl !== null ? (
                                    <Image
                                        width={150}
                                        src={selectedUser.avatarUrl}
                                    />
                                ) : (
                                    <Image
                                        width={75}
                                        src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                                    />
                                )}
                            </Col>
                            <Col span={16}>
                                <Descriptions title={selectedUser.name + " " + selectedUser.lastname}>


                                    <Descriptions.Item span={4} labelStyle={labelStyles} label="No. Cédula">{selectedUser.ci}</Descriptions.Item>
                                    <Descriptions.Item span={4} labelStyle={labelStyles} label="Email">{selectedUser.email}</Descriptions.Item>
                                    <Descriptions.Item span={4} labelStyle={labelStyles} label="Número de teléfono">{selectedUser.phone_number}</Descriptions.Item>
                                    <Descriptions.Item span={4} labelStyle={labelStyles} label="Tipo de licencia">{selectedUser.licenseType}</Descriptions.Item>
                                    <Descriptions.Item span={4} labelStyle={labelStyles} label="Fecha de expiración de licencia">{selectedUser.licenceExpiryDate}</Descriptions.Item>

                                </Descriptions>
                            </Col>

                        </Row>
                    }

                </Modal>
            </Card>
        </>
    )

}

export default DriversPage