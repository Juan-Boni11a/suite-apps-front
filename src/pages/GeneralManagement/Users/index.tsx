import { Button, Card, Form, Image, Modal, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getData } from "../../../services/common/getData";
import UserForm from "../../../components/Forms/UserForm";
import RoleAssignmentForm from "../../../components/Forms/RoleAssignmentForm";
import * as dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useNavigate } from "react-router-dom";
import { putData } from "../../../services/common/putData";

dayjs.locale('es')



function UsersPage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false)

    const [refresh, setRefresh] = useState(false)

    const [openRoleAssignmentModal, setOpenRoleAssigmentModal] = useState(false)

    const [selectedUser, setSelectedUser] = useState<any>(null)

    async function initialRequest() {
        setLoading(true)
        const request = await getData('api/users?includeInactive=' + true)
        console.log('r', request)
        if (request.length > 0) {
            setUsers(request)
            setLoading(false)
        }else{
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

        if('name' in request){
            setRefresh(!refresh)
        }

    }

    const handleModal = () => setOpenModal(!openModal)

    const handleRefresh = () => setRefresh(!refresh)


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
            title: 'Rol',
            key: 'A',
            render: (record: any) => (
                'role' in record && record.role !== null ? (
                    <>

                        {record.role.id === 1 && <Tag color="blue">ADMINISTRADOR</Tag>}

                        {record.role.id === 2 && <Tag color="green">CLIENTE</Tag>}

                        {record.role.id === 3 && <Tag color="orange">CONDUCTOR</Tag>}
                    </>

                ) : (
                    <Tag color="green">CLIENTE</Tag>
                )

            ),
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
                    <Button style={{ display: 'block', marginBottom: 12}} type="primary" onClick={() => {
                        console.log('r', record)
                        setSelectedUser(record)
                        handleRoleModal(record)
                    }}>
                        Asignar rol
                    </Button>
                    <Button type="primary" onClick={() => {
                        console.log('r', record)
                        handleChangeState(record)
                    }}>
                        {record.active ? 'Desactivar usuario' : 'Activar usuario' }
                    </Button>
                </>
            )
        }
    ];

    const [roleForm] = Form.useForm()

    const handleRoleModal = (record: any) => {

        if (openRoleAssignmentModal) {
            roleForm.resetFields()
        }

        if (typeof record !== "undefined") {
            console.log('record', record)
            if ('role' in record) {
                const roleValue = record.role !== null ? record.role.id : undefined
                roleForm.setFieldValue('roles', roleValue)

                if (roleValue === 3) {
                    roleForm.setFieldValue('licenceExpiryDate', dayjs(record.licenceExpiryDate))
                    roleForm.setFieldValue('licenseType', record.licenceExpiryDate)
                }
            }
        }

        setOpenRoleAssigmentModal(!openRoleAssignmentModal)
    }

    return (
        <>
            <Button onClick={() => navigate("/selection")} type="primary" style={{ marginBottom: 12 }}>Volver</Button>
            <Card title="Usuarios" extra={<Button onClick={handleModal} type="primary">Agregar</Button>} >
                <Table columns={columns} dataSource={users} loading={loading} pagination={{ pageSize: 20 }} />
                <Modal open={openModal} title="Usuario" onCancel={handleModal} footer={null}>
                    <UserForm handleModal={handleModal} handleRefresh={handleRefresh} />
                </Modal>

                <Modal width={800} open={openRoleAssignmentModal} title="Asignación de roles" onCancel={handleRoleModal} footer={null}>
                    <RoleAssignmentForm roleForm={roleForm} selectedUser={selectedUser} handleModal={handleRoleModal} handleRefresh={handleRefresh} />
                </Modal>

            </Card>
        </>
    )

}

export default UsersPage;