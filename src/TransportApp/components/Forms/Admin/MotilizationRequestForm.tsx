import { Button, DatePicker, Form, Input, Modal, Row, Select, Typography, message } from "antd";
import DriversSelector from "../../Modals/DriversSelector";
import { useContext, useEffect, useState } from "react";
import CarsSelector from "../../Modals/CarsSelector";
import { getData } from "../../../services/common/getData";
import { putData } from "../../../../services/common/putData";
import { transformDate, transformTime } from "../../../../utils/general";
import { AuthContext } from "../../../../context/AuthContext";
import { postData } from "../../../../services/common/postData";
import MovilizationLogs from "../../Logs/Movilizations";
import * as dayjs from 'dayjs'



const activities = [
    { label: 'Ingreso de datos', key: 1, value: 'Ingreso de datos' },
    { label: 'Asignación de conductor', key: 2, value: 'Asignación de conductor' }
]

const places = [
    { label: 'Quito', key: 1, value: 'Quito' },
    { label: 'Guayaquil', key: 1, value: 'Guayaquil' },
    { label: 'Cuenca', key: 1, value: 'Cuenca' }
]


const actions = [
    { label: 'Cerrar', value: 1 },
    { label: 'Guardar y Cerrar', value: 2 },
    { label: 'Guardar y Actualizar', value: 3 },
    { label: 'Guardar y Procesar', value: 4 },
    { label: 'Imprimir', value: 5 },
]

const statusList = [
    { label: 'Aceptar', value: 'ACCEPTED' },
    { label: 'Rechazar', value: 'REJECTED' },
]


function MovilizationRequestForm({ selectedRequest, handleModal, handleRefresh, form }: any) {


    const { user }: any = useContext(AuthContext)


    const statusValue = Form.useWatch('status', form);

    const [showDriversModal, setShowDriversModal] = useState(false)

    const [showCarsModal, setShowCarsModal] = useState(false)

    const [users, setUsers] = useState<any>([])

    const [movilizationTypes, setMovilizationTypes] = useState<any>([])

    const [movilizationTos, setMovilizationTos] = useState<any>([])

    const [movilizationValidities, setMovilizationValidities] = useState<any>([])

    const [drivers, setDrivers] = useState<any>([])


    const [vehicles, setVehicles] = useState<any>([])

    const [submitting, setSubmitting] = useState(false)

    function handleDriversModal() {
        setShowDriversModal(!showDriversModal)
    }

    function handleCarsModal() {
        setShowCarsModal(!showCarsModal)
    }

    function setSomeValues(key: string, value: any) {
        form.setFieldsValue({ [key]: value });
    }

    useEffect(() => {
        initialRequest()
    }, [])

    const initialRequest = async () => {
        const usersRequest = await getData('api/users')
        console.log('ur', usersRequest)
        if (Array.isArray(usersRequest)) {
            const usersToSelect = usersRequest.map((user: any) => {
                return {
                    ...user,
                    label: user.name + " " + user.lastname,
                    value: user.id
                }
            })
            setUsers(usersToSelect)
        }

        const driversRequest = await getData('api/users/busyDrivers')
        if ('freeDrivers' in driversRequest) {
            const driversToModal = driversRequest.freeDrivers.map((driver: any) => {
                return {
                    ...driver,
                    fullName: driver.name + " " + driver.lastname,
                    status: 'Disponible',
                    ciExpiry: '15/02/2024'
                }
            })
            setDrivers(driversToModal)
        }

        const typesRequest = await getData('api/movilizationTypes')
        console.log('ur', typesRequest)
        if (Array.isArray(typesRequest)) {
            const typesToSelect = typesRequest.map((mt: any) => {
                return {
                    ...mt,
                    label: mt.name,
                    value: mt.id
                }
            })
            setMovilizationTypes(typesToSelect)
        }

        const toRequest = await getData('api/movilizationTo')
        console.log('ur', toRequest)
        if (Array.isArray(toRequest)) {
            const toSelect = toRequest.map((mto: any) => {
                return {
                    ...mto,
                    label: mto.name,
                    value: mto.id
                }
            })
            setMovilizationTos(toSelect)
        }

        const validitiesRequest = await getData('api/movilizationValidities')
        console.log('ur', validitiesRequest)
        if (Array.isArray(validitiesRequest)) {
            const validitiesToSelect = validitiesRequest.map((vd: any) => {
                return {
                    ...vd,
                    label: vd.name,
                    value: vd.id
                }
            })
            setMovilizationValidities(validitiesToSelect)
        }


        const vehiclesRequest = await getData('api/vehicles/busy')
        if ('freeVehicles' in vehiclesRequest) {
            setVehicles(vehiclesRequest.freeVehicles)
        }
    }


    const handleSubmit = async (values: any) => {

        setSubmitting(true)

        if (selectedRequest && isAdmin) {

            let cleanValues: any = {
                status: values.status
            }
            console.log('aaaa', values.status)
            if (values.status === "ACCEPTED") {

                const { currentActivity, currentResponsible, driver, plate } = values
                const driverId = drivers.filter((dr: any) => dr.fullName === driver)
                const vehicleId = vehicles.filter((ve: any) => ve.plate === plate)

                cleanValues = {
                    ...cleanValues,
                    currentActivity,
                    currentResponsible: { id: user && user.id },
                    driver: { id: driverId.length > 0 ? driverId[0].id : 1 },
                    vehicle: { id: vehicleId.length > 0 ? vehicleId[0].id : 1 }
                }
            }



            const request = await putData('api/movilizationRequests/' + selectedRequest.id, cleanValues)
            if ('initiatorId' in request) {
                message.success("Orden creada exitosamente")
                setSubmitting(false)
                handleModal()
                handleRefresh()
                return
            }

            message.error("Ha ocurrido un error :(")
            setSubmitting(false)
            return


        }




        const { movilizationType, to, validity, emitPlace, emitDate, emitHour, expiryPlace, expiryDate, expiryHour } = values;


        const cleanValues: any = {
            movilizationType: { id: movilizationType },
            to: { id: to },
            validity: { id: validity },
            emitPlace,
            emitDate: transformDate(emitDate),
            emitHour: transformTime(emitHour),
            expiryPlace,
            expiryDate: transformDate(expiryDate),
            expiryHour: transformTime(expiryHour),
        }

        if (selectedRequest) {
            const request = await putData('api/movilizationRequests/' + selectedRequest.id, cleanValues)
            if ('emitPlace' in request) {
                message.success("Orden creada exitosamente")
                setSubmitting(false)
                handleModal()
                handleRefresh()
                return
            }

            message.error("Ha ocurrido un error :(")
            setSubmitting(false)
            return

        } else {
            cleanValues['initiatorId'] = { id: user.id }
            cleanValues['requester'] = { id: user.id }
            cleanValues['status'] = 'PENDING'

            const request = await postData('api/movilizationRequests', cleanValues)
            if ('emitPlace' in request) {
                message.success("Solicitud creada exitosamente")
                setSubmitting(false)
                handleModal()
                handleRefresh()
                return
            }
            message.error("Ha ocurrido un error :(")
            setSubmitting(false)
            return
        }

    }

    const isAdmin = user.roles[0].name !== "CLIENTE" ? true : false

    console.log('s', selectedRequest)


    const disabledDate = (current: any) => {
        return current && dayjs(current).isBefore(dayjs(), 'day');
    };

    const disabledHours = () => {
        const currentHour = dayjs().hour();
        return Array.from({ length: currentHour }, (_, index) => index);
    };

    const disabledMinutes = (selectedHour: any) => {
        if (selectedHour === dayjs().hour()) {
            const currentMinute = dayjs().minute();
            return Array.from({ length: currentMinute }, (_, index) => index);
        }
        return [];
    };

    const disabledSeconds = (selectedHour: any, selectedMinute: any) => {
        if (selectedHour === dayjs().hour() && selectedMinute === dayjs().minute()) {
            const currentSecond = dayjs().second();
            return Array.from({ length: currentSecond }, (_, index) => index);
        }
        return [];
    };

    const [startDate, setStartDate] = useState<any>(null);

    const handleStartDateChange = (date: any, dateString: any) => {
        // Actualizar el estado con la fecha seleccionada en el primer DatePicker
        setStartDate(dayjs(dateString));
      };

      const disabledEndDate = (current: any) => {
        // Si no se ha seleccionado ninguna fecha de inicio, deshabilitar todas las fechas
        if (!startDate) {
          return false;
        }
    
        // Solo permitir fechas a partir de la fecha seleccionada en el primer DatePicker
        return current && current.isBefore(startDate, 'day');
      };


    return (
        <Form form={form} onFinish={handleSubmit} >
            {isAdmin && (
                <>
                    <Form.Item label="Estado" name="status">
                        <Select options={statusList} />
                    </Form.Item>

                    {statusValue !== "REJECTED" && (
                        <>
                            <Form.Item label="Iniciador" name="initiatorId">
                                <Input disabled defaultValue={user && (user.name + " " + user.lastname)} />
                            </Form.Item>

                            <Form.Item label="Actividad actual" name="currentActivity" >
                                <Select options={activities} />
                            </Form.Item>


                            <Form.Item label="Responsable actual" name="currentResponsible">
                                <Select options={users} defaultValue={user && user.id} />
                            </Form.Item>

                            <Form.Item label="Conductor" name="driver">
                                <Input onClick={handleDriversModal} />
                            </Form.Item>

                            <Typography.Text>Vehículo</Typography.Text>
                            <Form.Item label="No. Placa" name="plate">
                                <Input onClick={handleCarsModal} />
                            </Form.Item>
                            <Form.Item label="Marca" name="brand">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="Modelo" name="model">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="Color" name="color">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="Motor" name="engine">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item label="No. Matrícula" name="enrollment">
                                <Input disabled />
                            </Form.Item>
                        </>
                    )}


                    {selectedRequest && (
                        <MovilizationLogs requestId={selectedRequest.id} />
                    )}
                </>
            )}



            {!isAdmin && (
                <>
                    <Form.Item label="Tipo de movilización" name="movilizationType" >
                        <Select options={movilizationTypes} />
                    </Form.Item>


                    <Form.Item label="Para" name="to">
                        <Select options={movilizationTos} />
                    </Form.Item>


                    <Form.Item label="Vigente de" name="validity">
                        <Select options={movilizationValidities} />
                    </Form.Item>
                    <Typography.Text>Datos de Origen</Typography.Text>

                    <Form.Item label="Lugar" name="emitPlace">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Fecha" name="emitDate">
                        <DatePicker 
                            onChange={handleStartDateChange}
                            disabledDate={disabledDate} 
                        />
                    </Form.Item>

                    <Form.Item label="Hora" name="emitHour">
                        <DatePicker 
                            picker="time"
                            disabledHours={disabledHours}
                            disabledMinutes={disabledMinutes}
                            disabledSeconds={disabledSeconds} 
                        />
                    </Form.Item>


                    <Typography.Text>Datos de Destino</Typography.Text>

                    <Form.Item label="Lugar" name="expiryPlace">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Fecha" name="expiryDate">
                        <DatePicker disabledDate={disabledEndDate}  />
                    </Form.Item>

                    <Form.Item label="Hora" name="expiryHour">
                        <DatePicker 
                            picker="time" 
                            disabledHours={disabledHours}
                            disabledMinutes={disabledMinutes}
                            disabledSeconds={disabledSeconds} 
                        />
                    </Form.Item>



                </>
            )}



            <Modal open={showDriversModal} footer={null} title="Máster de Conductores" onCancel={handleDriversModal}>
                <DriversSelector setSomeValues={setSomeValues} handleDriversModal={handleDriversModal} drivers={drivers} />
            </Modal>

            <Modal open={showCarsModal} footer={null} title="Vehículos" onCancel={handleCarsModal}>
                <CarsSelector setSomeValues={setSomeValues} handleCarsModal={handleCarsModal} vehicles={vehicles} />
            </Modal>

            <Row justify="end">
                <Button htmlType="submit" type="primary" loading={submitting}>Guardar</Button>
            </Row>
        </Form>
    )
}

export default MovilizationRequestForm;