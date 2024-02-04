import { useEffect, useState } from "react"
import { getData } from "../../../../services/common/getData"
import { Button, Card, Form, Input, Modal, Row, Select, Table, message } from "antd"
import { postData } from "../../../../services/common/postData"
import { putData } from "../../../../services/common/putData"






function VehicleForm({handleModal, handleRefresh, form, selectedRecord}: any){

    const handleFinish = async (values: any) => {

        const cleanData = {
            ...values,
            status: 'USO'
        }

        if(selectedRecord!==null){
            const request = await putData('api/vehicles/' + selectedRecord.id, cleanData)
            if('plate' in request){
                message.success("Vehículo actualizado exitosamente")
                handleModal()
                handleRefresh()
                return
            }
            return
        }
        const request = await postData('api/vehicles', cleanData)
        if('plate' in request){
            message.success("Vehículo agregado exitosamente")
            handleModal()
            handleRefresh()
            return
        }

        if ('error' in request) {
            message.error(request.error)
            return;
        }

        message.error("Algo salió mal")
    }

    return(
        <Form form={form} onFinish={handleFinish}>
            <Form.Item label="Placa" name="plate" rules={[{ required: true, message: 'Informació requerida' }]} >
                <Input />
            </Form.Item>
            <Form.Item label="Marca" name="brand" rules={[{ required: true, message: 'Informació requerida' }]} >
                <Input />
            </Form.Item>
            <Form.Item label="Modelo" name="model" rules={[{ required: true, message: 'Informació requerida' }]} >
                <Input />
            </Form.Item>
            <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Informació requerida' }]} >
                <Input />
            </Form.Item>
            <Form.Item label="Motor" name="engine" rules={[{ required: true, message: 'Informació requerida' }]} >
                <Input />
            </Form.Item>

            <Form.Item label="No. Matrícula" name="enrollment" rules={[{ required: true, message: 'Informació requerida' }]} >
                <Input />
            </Form.Item>


            <Row justify="end" >
                <Button htmlType="submit" type="primary">Guardar</Button>
            </Row>
        </Form>
    )
}





function VehiclesPage(){



const [form] = Form.useForm()


const columns: any = [
    {
        title: "Placa",
        dataIndex: "plate",
        key: "plate",
    },
    {
        title: "Marca",
        dataIndex: "brand",
        key: "brand",
    },
    {
        title: "Modelo",
        dataIndex: "model",
        key: "model",
    },
    {
        title: "Color",
        dataIndex: "color",
        key: "color",
    },

    {
        title: "Motor",
        dataIndex: "engine",
        key: "engine",
    },

    {
        title: "No. matrícula",
        dataIndex: "enrollment",
        key: "enrollment",
    },
    {
        title: "Acciones",
        key: "x",
        render: (record: any) => (
            <Button onClick={() => 
                handleOpenModal(record)}>
                    Editar
            </Button>
        )
    }
];

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false)

    const [refresh, setRefresh] = useState(false)

    const [selectedRecord, setSelectedRecord] = useState(null)


    const initialRequest = async () => {
        setLoading(true)
        const request = await getData('api/vehicles')
        if(Array.isArray(request)){
            setData(request)
            setLoading(false)
        }
    }


    useEffect(() => {
        initialRequest()
    }, [refresh])

    const handleModal = () => {
        setOpenModal(!openModal)
    }

    
    const handleOpenModal = (record: any = null) => {
        if(record!==null){
            const {name, plate, brand, model, color, engine, enrollment } = record;

            form.setFieldValue('name', name)
            form.setFieldValue('plate', plate)
            form.setFieldValue('brand', brand)
            form.setFieldValue('model', model)
            form.setFieldValue('color', color)
            form.setFieldValue('engine', engine)

            form.setFieldValue('enrollment', enrollment)

            setSelectedRecord(record)
       
        }
   
        setOpenModal(true)
        
    }

    const handleRefresh = () => setRefresh(!refresh)

    
    return(
        <Card title="Máster de Vehículos" extra={<Button type="primary" onClick={handleModal}>Nuevo vehículo</Button> } >
            <Table  loading={loading} dataSource={data} columns={columns} />

            <Modal title="Vehículo" open={openModal} footer={null} onCancel={handleModal}>
                <VehicleForm form={form} handleModal={handleModal} handleRefresh={handleRefresh} selectedRecord={selectedRecord} />
            </Modal>

        </Card>
    )
}

export default VehiclesPage