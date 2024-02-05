import { useEffect, useState } from "react"
import { getData } from "../../../../services/common/getData"
import { Button, Card, Form, Input, Modal, Row, Table, message } from "antd"
import { postData } from "../../../../services/common/postData"
import { putData } from "../../../../services/common/putData"




function ActivityForm({handleModal, handleRefresh, form, selectedRecord}: any){


    const handleFinish = async (values: any) => {
        if(selectedRecord!==null){
            const request = await putData('api/activities/' + selectedRecord.id, values)
            if('name' in request){
                message.success("Actividad actualizada exitosamente")
                handleModal()
                handleRefresh()
                return
            }
            return
        }
        const request = await postData('api/activities', values)
        if('name' in request){
            message.success("Actividad agregada exitosamente")
            handleModal()
            handleRefresh()
        }
    }

    return(
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




function ActivitiesPage(){

    const [form] = Form.useForm()
    const [selectedRecord, setSelectedRecord] = useState(null)


    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false)

    const [refresh, setRefresh] = useState(false)


    const initialRequest = async () => {
        setLoading(true)
        const request = await getData('api/activities')
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
        form.resetFields()
    }

    const handleRefresh = () => setRefresh(!refresh)


    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
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
    ]

    const handleOpenModal = (record: any = null) => {
        if(record!==null){
            const {name } = record;

            form.setFieldValue('name', name)

            setSelectedRecord(record)
       
        }
   
        setOpenModal(true)
    } 
    

    
    return(
        <Card title="Actividades" extra={<Button onClick={handleModal} type="primary">Nueva actividad</Button> } >
            <Table  loading={loading} dataSource={data} columns={columns} />

            <Modal title="Actividad" open={openModal} onCancel={handleModal} footer={null}>
                <ActivityForm handleModal={handleModal} handleRefresh={handleRefresh} form={form} selectedRecord={selectedRecord} />
            </Modal>

        </Card>
    )
}

export default ActivitiesPage 