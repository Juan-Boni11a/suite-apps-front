/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Dropdown, Form, MenuProps, Modal, Space, Table, Tag, } from 'antd'
import { useContext, useEffect, useState } from 'react'
// import { getData } from '../../services/getData'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { getData } from '../../../../services/common/getData';
import MovilizationRequestForm from '../../../components/Forms/Admin/MotilizationRequestForm'
import MovRequestClienteForm from '../../../components/Forms/Cliente/MovRequestClienteForm'
import { AuthContext } from '../../../../context/AuthContext';





const Filters = ({ filterBy }: any) => {

    let items: MenuProps['items'] = [];

    items.push(
        {
            key: '1',
            label: (
                <a rel="noopener noreferrer" onClick={() => filterBy('PENDING')}>
                    Pendientes
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a rel="noopener noreferrer" onClick={() => filterBy('ACCEPTED')}>
                    Aprobadas
                </a>
            ),
        },
        {
            key: '4',
            label: (
                <a rel="noopener noreferrer" onClick={() => filterBy('REJECTED')}>
                    Rechazadas
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a rel="noopener noreferrer" onClick={() => filterBy('ALL')}>
                    Todas
                </a>
            ),
        }
    )

    return (
        <Dropdown
            menu={{ items }}
        >
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    Mostrar
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    )
}


const MovilizationOrderPage = () => {

    const [form] = Form.useForm();
  

    const [loading, setLoading] = useState(false)

    const [showModal, setShowModal] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState<any>([])

    const [filteredData, setFilteredData] = useState<any>([])

    const [selectedRequest, setSelectedRequest] = useState(false)

    const { user }: any = useContext(AuthContext)

    const isAdmin = user.role.id !== 2 ? true : false

    async function initialRequest() {
        setLoading(true)
        const request = isAdmin ? await getData('api/movilizationRequests') : await getData('api/movilizationRequestsByRequester/' + user.id)
        console.log('request', request)
        if (Array.isArray(request)) {
            setData(request)
            setFilteredData(request)
            setLoading(false)
        }
    }

    useEffect(() => {
        initialRequest()
    }, [refresh])

    function handleModal() {
        setShowModal(!showModal)
        form.resetFields()
    }

    function handleRefresh() {
        setRefresh(!refresh)
    }


    function handleFilterBy(value: any) {
        if (value !== "ALL") {
            const pending = data.filter((req: any) => req.status === value)
            setFilteredData(pending)
            return
        }

        if (value === "ALL") {
            setFilteredData(data)
            return 
        }
    }


    function handleCheckRequest(record: any) {
        setSelectedRequest(record)
        setShowModal(true)
    }

    const columns = [
        {
            title: "Identificador",
            dataIndex: "",
            key: "identifier",
            render: (record: any) => (
                record.code !== null && (
                    <span>
                        {record.code}
                    </span>
                )

            ),
        },
        {
            title: "Cliente",
            dataIndex: "",
            key: "customer",
            render: (record: any) => (
                record.requester !== null && (
                    <span>
                        {record.requester.name} {record.requester.lastname}
                    </span>
                )

            ),
        },
        {
            title: "Fecha de salida",
            dataIndex: "emitDate",
            key: "emitDate",
        },
        {
            title: "Hora de salida",
            dataIndex: "emitHour",
            key: "emitHour",
        },
        {
            title: "Estado",
            dataIndex: "",
            key: "x",
            render: (record: any) => (
                'status' in record && (
                    <>
                        {record.status === "REJECTED" && <Tag color="red">RECHAZADA</Tag>}

                        {record.status === "PENDING" && <Tag color="orange">PENDIENTE</Tag>}

                        {record.status === "ACCEPTED" && <Tag color="green">ACEPTADA</Tag>}

                    </>
                )

            ),
        },
    ];

    if (isAdmin) {
        columns.push(
            {
                title: "Acciones",
                dataIndex: "",
                key: "x",
                render: (record: any) =>
                (
                    <Button
                        onClick={() => handleCheckRequest(record)}
                        type="primary"
                        style={{ marginBottom: 16 }}
                    >
                        {record.driver === null && record.status !== "REJECTED" ? "Completar" : "Editar"}
                    </Button>

                ),
            }
        )
    }


    return (
        <div>
            <Card
                title="Solicitudes de orden de movilización"
                extra={
                    isAdmin ?
                        <Filters filterBy={handleFilterBy} />
                        :
                        <Button icon={<PlusOutlined />} type="primary" onClick={handleModal}>
                            Nueva solicitud
                        </Button>}
            >
                <Table loading={loading} columns={columns} dataSource={filteredData} />
                <Modal
                    open={showModal}
                    onCancel={handleModal}
                    footer={null}
                    width="60%"
                    title={isAdmin ? "Orden de movilización" : "Solicitud de orden de movilización"}>
                    <MovilizationRequestForm 
                        form={form}
                        handleModal={handleModal} 
                        handleRefresh={handleRefresh} 
                        selectedRequest={selectedRequest} 
                    />
                </Modal>
            </Card>
        </div>
    )
}

export default MovilizationOrderPage
