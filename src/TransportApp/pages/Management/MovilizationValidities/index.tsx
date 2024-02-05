import { useEffect, useState } from "react"
import { getData } from "../../../../services/common/getData"
import { Button, Card, Form, Input, Modal, Row, Table, message } from "antd"
import { postData } from "../../../../services/common/postData"


const columns = [
    {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name'
    }
]


function MovilizationValidityForm({ handleModal, handleRefresh, form }: any) {

    const handleFinish = async (values: any) => {
        const request = await postData('api/movilizationValidities', values)
        if ('name' in request) {
            message.success("Agregado exitosamente")
            handleModal()
            handleRefresh()
            return
        }
        message.error("Ya existe un registro con ese nombre!")
    }

    return (
        <Form form={form} onFinish={handleFinish}>
            <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Informació requerida' }]} >
                <Input />
            </Form.Item>
            <Row justify="end" >
                <Button htmlType="submit" type="primary">Guardar</Button>
            </Row>
        </Form>
    )
}




function MovilizationValiditiesPage() {

    const [form] = Form.useForm()


    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false)

    const [refresh, setRefresh] = useState(false)


    const initialRequest = async () => {
        setLoading(true)
        const request = await getData('api/movilizationValidities')
        if (Array.isArray(request)) {
            setData(request)
            setLoading(false)
        }
    }


    useEffect(() => {
        initialRequest()
    }, [refresh])

    const handleModal = () => {
        setOpenModal(!openModal)
        form.resetFields()
    }

    const handleRefresh = () => setRefresh(!refresh)


    return (
        <Card title="Vigencias" extra={<Button onClick={handleModal} type="primary">Nueva vigencia</Button>} >
            <Table loading={loading} dataSource={data} columns={columns} />

            <Modal title="Vigencia" open={openModal} onCancel={handleModal} footer={null}>
                <MovilizationValidityForm handleModal={handleModal} handleRefresh={handleRefresh} form={form} />
            </Modal>

        </Card>
    )
}

export default MovilizationValiditiesPage