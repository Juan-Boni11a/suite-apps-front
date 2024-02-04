import { Button, Radio, DatePicker, Form, Input, InputNumber, Modal, Select, Typography, message, Row } from "antd";
import { useEffect, useState } from "react";
import FuncionariosSelector from "../../Modals/FuncionariosSelector";
import TextArea from "antd/es/input/TextArea";
import { postData } from "../../../../services/common/postData";
import { getData } from "../../../../services/common/getData";
import { transformDate, transformTime } from "../../../../utils/general";


/*const users = [
    { label: 'Admin', key: 1, value: 1 },
    { label: 'Juan Pérez', key: 1, value: 2 }
]*/

const activities = [
    { label: 'Solicitar transporte', key: 1, value: 'Solicitar transporte' },
    { label: 'Cancelar transporte', key: 2, value: 'Cancelar transporte' }
]



/*
const actions = [
    {  label: 'Cerrar', value: 1},
    {  label: 'Guardar y Cerrar', value: 2},
    {  label: 'Guardar y Actualizar', value: 3},
    {  label: 'Guardar y Procesar', value: 4},
    {  label: 'Imprimir', value: 5},
]
*/

function SolicitudTransportForm({handleModal, handleRefresh}: any) {
    const [form] = Form.useForm()

    const [showFuncionariosModal, setshowFuncionariosModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [users, setUsers] = useState<any>([])


    function handleFuncionariosModal() {
        setshowFuncionariosModal(!showFuncionariosModal)
    }    

    function setSomeValues(key: string, value: any) {
        form.setFieldsValue({ [key]: value });
    }


    useEffect(() => {
        initialRequest()
    }, [])

    const initialRequest = async () => {
        const usersRequest = await getData('api/users?includeInactive=' + true)
        console.log('ur', usersRequest)
        if (Array.isArray(usersRequest)) {
            const usersToSelect = usersRequest.map((user: any) => {
                return {
                    ...user,
                    label: user.name + " " + user.lastname,
                    value: user.id,
                    fullName: user.name + " " + user.lastname
                }
            })
            setUsers(usersToSelect)
        }
    }

    const handleSubmit = async (values: any) => {
        setSubmitting(true)
        console.log('values', values)
        const { initiatorId, currentActivity, currentResponsible, officerId, departureDate, departureHour, returnDate, returnHour, companionsNumber, destiny, aproxDuration, activity, allTime } = values;

        //const selectedUser = users.filter((us: any) => officer.includes(us.name))

        const cleanValues = {
            initiatorId: { id: initiatorId },
            currentActivity,
            currentResponsible: { id: currentResponsible },
            departureDate: transformDate(departureDate) ,
            departureHour: transformTime(departureHour),
            returnDate: transformDate(returnDate),
            returnHour: transformTime(returnHour),
            //officer: { id: selectedUser.length > 0 ? selectedUser[0].id : 1 },
            officer: { id: officerId },
            companionsNumber: companionsNumber || 1, 
            destiny,
            aproxDuration,
            activity,
            allTime
        }

        console.log('clean values', cleanValues)

        const request = await postData('api/transportationRequests', cleanValues)
        if('initiatorId' in request){
            message.success("Solicitud creada exitosamente")
            setSubmitting(false)
            handleModal()
            handleRefresh()
            return
        }

        message.error("Ha ocurrido un error :(")
        setSubmitting(false)

    }

    return (
        <Form form={form} onFinish={handleSubmit}>
            <Form.Item label="Iniciador" name="initiatorId">
                <Select options={users} />
            </Form.Item>

            <Form.Item label="Actividad actual" name="currentActivity" >
                <Select options={activities} />
            </Form.Item>


            <Form.Item label="Responsable actual" name="currentResponsible">
                <Select options={users} />
            </Form.Item>


            <Form.Item label="Fecha de salida" name="departureDate">
                <DatePicker />
            </Form.Item>
            
            <Form.Item label="Hora de salida" name="departureHour">
                <DatePicker picker="time" />
            </Form.Item>

            <Form.Item label="Fecha de retorno" name="returnDate">
                <DatePicker />
            </Form.Item>
            
            <Form.Item label="Hora de retorno" name="returnHour">
                <DatePicker picker="time" />
            </Form.Item>

            <Form.Item label="Funcionario" name="officer">
                <Input onClick={handleFuncionariosModal} />
            </Form.Item>

            <Form.Item style={{ display: 'none' }} label="" name="officerId">
                <Input />
            </Form.Item>

            <Form.Item label="Número de acompañantes" name="companionsNumber">
                <InputNumber min={1}  defaultValue={1}/>
            </Form.Item>

            <Form.Item label="Destino" name="destiny">
                <Input />
            </Form.Item>

            <Form.Item label="Duración aproximada" name="aproxDuration">
                <Input />
            </Form.Item>
            
            <Form.Item label="Actividad" name="activity">
                <TextArea />
            </Form.Item>

            <Form.Item label="Ocupa todo el tiempo" name="allTime">
                <Radio.Group >
                    <Radio value={true}>Si</Radio>
                    <Radio value={false}>No</Radio>
                </Radio.Group>
            </Form.Item>
            
            <Form.Item label="Acciones a tomar">
                <Select options={activities} />
            </Form.Item>

            <Modal open={showFuncionariosModal} footer={null} title="Funcionarios" onCancel={handleFuncionariosModal}>
                <FuncionariosSelector users={users} setSomeValues={setSomeValues} handleFuncionariosModal={handleFuncionariosModal} />
            </Modal>

            <Row justify="end">
                <Button htmlType="submit" type="primary" loading={submitting}>Guardar</Button>
            </Row>
        </Form>
    )
}

export default SolicitudTransportForm;