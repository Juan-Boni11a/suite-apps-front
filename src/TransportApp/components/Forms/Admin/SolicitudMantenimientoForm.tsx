import { Button, Radio, DatePicker, Form, Input, Modal, Select, Typography, message } from "antd";
import DriversSelector from "../../Modals/DriversSelector";
import { useContext, useEffect, useState } from "react";
import CarsSelector from "../../Modals/CarsSelector";
import MantenimientoSelector from "../../Modals/MantenimientoSelector";
// import Barcode from "react-barcode";
import { getData } from "../../../../services/common/getData";
import { AuthContext } from "../../../../context/AuthContext";
import { transformDate, transformTime } from "../../../../utils/general";
import { putData } from "../../../../services/common/putData";
import { postData } from "../../../../services/common/postData";
import MaintenanceLogs from "../../Logs/Maintenances";
import * as dayjs from 'dayjs'



const currentActivities = [
    { label: 'Ingreso de datos', key: 1, value: 'Ingreso de datos' }
]

const actions = [
    { label: 'Aprobar', key: 1, value: 'ACEPTADA' },
    { label: 'Aprobar y Enviar a Taller', key: 2, value: 'TALLER' },
    { label: 'Rechazar', key: 3, value: 'RECHAZADA' },
    { label: 'Pendiente', key: 3, value: 'PENDIENTE' }
]




function SolicitudMantenimientoForm({ selectedRequest, handleModal, handleRefresh, form }: any) {

    const { user }: any = useContext(AuthContext)

    const [showDriversModal, setShowDriversModal] = useState(false)

    const [showCarsModal, setShowCarsModal] = useState(false)

    const [showMantenimientoModal, setShowMantenimientoModal] = useState(false)

    const [drivers, setDrivers] = useState<any>([])


    const [vehicles, setVehicles] = useState<any>([])
    const [users, setUsers] = useState<any>([])

    const [stations, setStations] = useState<any>([])


    const [submitting, setSubmitting] = useState(false)

    const [activities, setActivities] = useState<any>([])




    function handleDriversModal() {
        setShowDriversModal(!showDriversModal)
    }

    function handleCarsModal() {
        setShowCarsModal(!showCarsModal)
    }

    function handleMantenimientoModal() {
        setShowMantenimientoModal(!showMantenimientoModal)
    }



    function setSomeValues(key: string, value: any) {
        form.setFieldsValue({ [key]: value });
    }

    /*const onChangeWorkType = (e: any) => {
        console.log('radio checked', e.target.value);
    };
    */

    const [barCodeValue, setBarCodeValue] = useState<any>('')


    function handleGenerateBarCode() {
        const randomValue = Math.floor(Math.random() * 1000000000);
        setBarCodeValue(randomValue)
    }


    async function initialRequest() {
        const usersRequest = await getData('api/users?includeInactive=' + true)
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

        const vehiclesRequest = await getData('api/vehicles/busy')
        if ('freeVehicles' in vehiclesRequest) {
            setVehicles(vehiclesRequest.freeVehicles)
        }




        const stationsRequest = await getData('api/serviceStations')
        if (Array.isArray(stationsRequest)) {
            const mStations = stationsRequest.filter((st: any) => st.type === "MAINTENANCE")
            setStations(mStations)
        }

        const activitiesRequest = await getData('api/activities')
        console.log('ur', activitiesRequest)
        if (Array.isArray(activitiesRequest)) {

            const activitiesToSelect = activitiesRequest.map((activity: any) => {
                return {
                    ...activity,
                    label: activity.name,
                    value: activity.id
                }
            })

            setActivities(activitiesToSelect)
        }
    }

    useEffect(() => {
        initialRequest()
    }, [])


    useEffect(() => {
        if (selectedRequest) {
            setBarCodeValue('barCode' in selectedRequest ? selectedRequest.barCode : '')

        }
    }, [selectedRequest])

    const handleSubmit = async (values: any) => {
        console.log('values', values)
        setSubmitting(true)

        const { currentActivity, currentResponsible, date, hour, driver, plate, serviceStation, workType, status } = values;

        const driverId = drivers.filter((dr: any) => dr.fullName === driver)
        const vehicleId = vehicles.filter((ve: any) => ve.plate === plate)

        const stationId = stations.filter((st: any) => st.name === serviceStation)

        const cleanValues: any = {
            initiatorId: { id: selectedRequest ? selectedRequest.initiatorId?.id : user.id },
            requester: { id: selectedRequest ? selectedRequest.requester?.id : user.id },
            currentActivity,
            currentResponsible: { id: user && user.id },
            date: transformDate(date),
            hour: transformTime(hour),
            driver: { id: driverId.length > 0 ? driverId[0].id : 1 },
            vehicle: { id: vehicleId.length > 0 ? vehicleId[0].id : 1 },
            serviceStation: { id: stationId.length > 0 ? stationId[0].id : 1 },
            workType,
            barCode: barCodeValue,
            status
        }

        if (selectedRequest) {
            const request = await putData('api/maintenanceRequests/' + selectedRequest.id, cleanValues)
            if ('requester' in request) {

                values.activities.map(async (a: any) => {
                    await postData('api/maintenanceRequests/' + request.id + "/activity/" + a, {})
                })

                const buildPdf = await postData('api/maintenanceRequests/' + request.id + "/buildPdf", {})


                message.success("Orden editada exitosamente")

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
            cleanValues['status'] = 'PENDIENTE'

            const request = await postData('api/maintenanceRequests', cleanValues)
            if ('requester' in request) {

                values.activities.map(async (a: any) => {
                    await postData('api/maintenanceRequests/' + request.id + "/activity/" + a, {})
                })

                const buildPdf = await postData('api/maintenanceRequests/' + request.id + "/buildPdf", {})

                message.success("Solicitud creada exitosamente")
                setSubmitting(false)
                handleModal()
                handleRefresh()
                return



            } else {
                message.error("Ha ocurrido un error :(")
                setSubmitting(false)
                return
            }






        }

    }


    const disabledDate = (current: any) => {
        return current && dayjs(current).isBefore(dayjs(), 'day');
    };

    const disabledHours = () => {
        const currentHour = dayjs().hour();
        // Deshabilitar todas las horas antes de la actual, antes de las 8am y después de las 6pm
        return [...Array(currentHour).keys(), ...Array(8).keys(), ...Array.from({ length: 18 }, (_, index) => index + 19)];
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


    return (
        <Form form={form} onFinish={handleSubmit}>
            <Form.Item label="Iniciador" name="initiatorId">
                <Input disabled defaultValue={user && (user.name + " " + user.lastname)} />

            </Form.Item>

            <Form.Item label="Actividad actual" name="currentActivity">
                <Select options={currentActivities} />
            </Form.Item>

            <Form.Item label="Responsable actual" name="currentResponsible">
                <Select options={users} defaultValue={user && user.id} />
            </Form.Item>

            <Form.Item label="Fecha de mantenimiento" name="date">
                <DatePicker disabledDate={disabledDate} />
            </Form.Item>

            <Form.Item label="Hora de mantenimiento" name="hour">
                <DatePicker picker="time"
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    disabledSeconds={disabledSeconds}
                />
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
            <Form.Item label="Kilometraje" name="enrollment">
                <Input disabled />
            </Form.Item>


            <Typography.Text>Conductor</Typography.Text>
            <Form.Item label="Nombre completo" name="driver">
                <Input onClick={handleDriversModal} />
            </Form.Item>

            <Form.Item label="Cedula" name="ci">
                <Input disabled />
            </Form.Item>

            <Form.Item label="Estacion de servicio" name="serviceStation">
                <Input onClick={handleMantenimientoModal} />
            </Form.Item>

            <Form.Item label="Tipo de trabajo" name="workType">
                <Radio.Group /*onChange={onChangeWorkType}*/ >
                    <Radio value={"PREVENTIVO"}>Preventivo</Radio>
                    <Radio value={"CORRECTIVO"}>Correctivo</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item label="Actividades" name="activities">
                <Select options={activities} mode="multiple" />
            </Form.Item>

            {
                /*
                <Typography.Text>Código de barra</Typography.Text>
                <br />
                <Button onClick={handleGenerateBarCode} type="primary">Generar código</Button>
                <br />
                <Barcode value={barCodeValue} />
                <br />
                */
            }
            <Form.Item label="Acciones a tomar" name="status">
                <Select options={actions} />
            </Form.Item>

            {selectedRequest && (
                <MaintenanceLogs requestId={selectedRequest.id} />
            )}


            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', marginTop: 12 }}>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting}>
                        Guardar
                    </Button>
                </Form.Item>

            </div>
            <Modal open={showDriversModal} footer={null} title="Máster de Conductores" onCancel={handleDriversModal}>
                <DriversSelector setSomeValues={setSomeValues} handleDriversModal={handleDriversModal} drivers={drivers} />
            </Modal>

            <Modal open={showCarsModal} footer={null} title="Vehículos" onCancel={handleCarsModal}>
                <CarsSelector setSomeValues={setSomeValues} handleCarsModal={handleCarsModal} vehicles={vehicles} />
            </Modal>

            <Modal open={showMantenimientoModal} footer={null} title="Estacion de servicio de Mantenimiento" onCancel={handleMantenimientoModal}>
                <MantenimientoSelector setSomeValues={setSomeValues} handleMantenimientoModal={handleMantenimientoModal} stations={stations} />
            </Modal>
        </Form>
    )
}

export default SolicitudMantenimientoForm;