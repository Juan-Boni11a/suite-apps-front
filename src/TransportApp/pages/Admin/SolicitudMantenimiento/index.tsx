/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Form, Modal, Table, Tag } from 'antd'
import { useEffect, useState, useContext } from 'react'
// import { getData } from '../../services/getData'
import { PlusOutlined } from '@ant-design/icons'
import SolicitudManetenimientoForm from '../../../components/Forms/Admin/SolicitudMantenimientoForm'
import { getData } from '../../../../services/common/getData';
import { AuthContext } from '../../../../context/AuthContext';
import * as dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')





const SolicitudMantenimientoPage = () => {


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
        const request = await getData('api/maintenanceRequests')
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



    function handleCheckRequest(record: any) {
        setSelectedRequest(record)

        form.setFieldValue("currentActivity", record.currentActivity)
        form.setFieldValue("currentResponsible", record.currentResponsible.id)

        
        form.setFieldValue("date", dayjs(record.date))

        
        form.setFieldValue("plate", record.vehicle.plate)
        form.setFieldValue("brand", record.vehicle.brand)

        form.setFieldValue("model", record.vehicle.model)
        form.setFieldValue("color", record.vehicle.color)


        form.setFieldValue("engine", record.vehicle.engine)



        form.setFieldValue("driver", record.driver.name + " " + record.driver.lastname)

        form.setFieldValue("ci", record.driver.ci)


        form.setFieldValue("serviceStation", record.serviceStation.name)


        form.setFieldValue("workType", record.workType)

        form.setFieldValue("status", record.status)

        form.setFieldValue("activities", record.activities.map((ac: any)  => ac.id))


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
            title: "Conductor",
            dataIndex: "",
            key: "driver",
            render: (record: any) => (
                record.driver !== null && (
                    <span>
                        {record.driver.name} {record.driver.lastname}
                    </span>
                )
            ),
        },
        {
            title: "Fecha",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Hora",
            dataIndex: "hour",
            key: "hour",
        },
        {
            title: "Estado",
            dataIndex: "",
            key: "x",
            render: (record: any) => (
                'status' in record && (
                    <>
                        {record.status === "RECHAZADA" && <Tag color="red">{record.status}</Tag>}

                        {record.status === "PENDIENTE" && <Tag color="orange">{record.status}</Tag>}

                        {record.status === "ACEPTADA" && <Tag color="green">{record.status}</Tag>}

                        {record.status === "TALLER" && <Tag color="blue">{record.status}</Tag>}
                    </>
                )

            ),
        },
        {
            title: "Acciones",
            dataIndex: "",
            key: "x",
            render: (record: any) => (
                <Button
                    onClick={() => handleCheckRequest(record)}
                    type="primary"
                    style={{ marginBottom: 16 }}
                >
                    Editar
                </Button>

            ),
        },
    ];

    return (
        <div>
            <Card
                title="Solicitud de mantenimiento"
                extra={
                    isAdmin &&
                    <Button icon={<PlusOutlined />} type="primary" onClick={handleModal}>
                        Nueva solicitud
                    </Button>}
            >
                <Table loading={loading} columns={columns} dataSource={filteredData} />
                <Modal
                    forceRender={true}
                    destroyOnClose={true}	
                    open={showModal}
                    onCancel={handleModal}
                    footer={null}
                    width="60%"
                    title={isAdmin ? "Orden de mantenimiento" : "Solicitud de orden de mantenimiento"}>
                    <SolicitudManetenimientoForm
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

export default SolicitudMantenimientoPage
