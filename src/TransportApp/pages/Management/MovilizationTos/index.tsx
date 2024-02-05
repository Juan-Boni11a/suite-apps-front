import { useEffect, useState } from "react"
import { getData } from "../../../../services/common/getData"
import { Button, Card, Form, Input, Modal, Row, Table, message } from "antd"
import { postData } from "../../../../services/common/postData"
import { putData } from "../../../../services/common/putData"


const columns = [
    {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name'
    }
]


function MovilizationToForm({handleModal, handleRefresh, selectedRecord, form}: any){



    const handleFinish = async (values: any) => {
        if(selectedRecord!==null){
            const request = await putData('api/movilizationTo/' + selectedRecord.id, values)
            if('name' in request){
                message.success("Registro actualizado exitosamente")
                handleModal()
                handleRefresh()
                return
            }
            message.error("Ya existe un registro con ese nombre!")
            return
        }
        const request = await postData('api/movilizationTo', values)
        if('name' in request){
            message.success("Registro agregado exitosamente")
            handleModal()
            handleRefresh()
            return
        }
        message.error("Ya existe un registro con ese nombre!")
 
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




function MovilizationTosPage(){


    const [form] = Form.useForm()
    const [selectedRecord, setSelectedRecord] = useState(null)


    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const [openModal, setOpenModal] = useState(false)

    const [refresh, setRefresh] = useState(false)


    const initialRequest = async () => {
        setLoading(true)
        const request = await getData('api/movilizationTo')
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
        <Card title="Valores de para" extra={<Button onClick={handleModal} type="primary">Nuevo {"para"}</Button> } >
            <Table  loading={loading} dataSource={data} columns={columns} />

            <Modal title="Para" open={openModal} onCancel={handleModal} footer={null}>
                <MovilizationToForm handleModal={handleModal} handleRefresh={handleRefresh} form={form} selectedRecord={selectedRecord} />
            </Modal>

        </Card>
    )
}

export default MovilizationTosPage