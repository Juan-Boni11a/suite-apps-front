import { Card, Col, Row, Spin, Table } from "antd";
import PieChart from "../../components/Charts/Piechart";
import { getData } from "../../../services/common/getData";
import { useEffect, useState } from "react";

function Dashboard() {

    const [vehiclesData, setVehiclesData] = useState<any>(null)
    const [driversData, setDriversData] = useState<any>(null)


    const [busyDrivers, setBusyDrivers] = useState<any>([])
    const [loadingVdata, setLoadingVdata] = useState<any>(true)

    const [loadingDdata, setLoadingDdata] = useState<any>(true)

    const [loadingBusyDrivers, setLoadingBusyDrivers] = useState<any>(true)


    const [driversInMovilization, setDriversInMovilization] = useState<any>([])
    const [loadingDriversInMovilization, setLoadingDriversInMovilization] = useState(true)

    const [todayMovilizations, setTodayMovilizations] = useState<any>([])
    const [loadingTodayMovilizations, setLoadingTodayMovilizations] = useState(true)

    const [todayMaintenances, setTodayMaintenances] = useState<any>([])
    const [loadingTodayMaintenances, setLoadingTodayMaintenances] = useState(true)

    const columns = [
        {
            title: "Nombre",
            key: "a",
            render: (record: any) => <>
                {'driver' in record && <span>{record.driver.name}</span>}
            </>
        },
        {
            title: "Apellido",
            key: "b",
            render: (record: any) => <>
                {'driver' in record && <span>{record.driver.lastname}</span>}
            </>
        },
        {
            title: "Número de teléfono",
            key: 'c',
            render: (record: any) => <>
                {'driver' in record && <span>{record.driver.phone_number}</span>}
            </>
        },
        {
            title: "Ruta",
            key: "x",
            render: (record: any) => <>
                {'emitPlace' in record && <span>{record.emitPlace + "-" + record.expiryPlace}</span>}
            </>
        },
        {
            title: "Fecha de salida",
            key: "x",
            render: (record: any) => <>
                {'emitDate' in record && <span>{record.emitDate + "-" + record.emitHour}</span>}
            </>
        },
        {
            title: "Fecha de llegada",
            key: "x",
            render: (record: any) => <>
                {'expiryDate' in record && <span>{record.expiryDate + "-" + record.expiryHour}</span>}
            </>
        },
        {
            title: 'Fecha de mantenimiento',
            key: "y",
            render: (record: any) => <>
                {'date' in record && <span>{record.date + "-" + record.hour}</span>}
            </>
        }

    ];


    async function initialRequest() {



        const requestAllVehicles = await getData('api/vehicles/busy')

        if ('freeVehicles' in requestAllVehicles) {
            const { busyVehicles, freeVehicles } = requestAllVehicles
            const totalVehicles = busyVehicles.length + freeVehicles.length

            let busyVehiclesAverage = (busyVehicles.length / totalVehicles) * 100

            let freeVehiclesAverage = (freeVehicles.length / totalVehicles) * 100

            setVehiclesData({
                labels: ['Disponibles', 'Ocupados'],
                datasets: [
                    {
                        data: [freeVehiclesAverage, busyVehiclesAverage],
                        backgroundColor: ['#36A2EB', '#FF6384'],
                        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                    }
                ]
            })

            setLoadingVdata(false)
        }



        const requestAllDrivers = await getData('api/users/busyDrivers')
        console.log('request all', requestAllDrivers)
        if ('freeDrivers' in requestAllDrivers) {
            const { busyDrivers, freeDrivers } = requestAllDrivers
            const totalDrivers = busyDrivers.length + freeDrivers.length
            let busyDriversAverage = (busyDrivers.length / totalDrivers) * 100

            let freeDriversAverage = (freeDrivers.length / totalDrivers) * 100

            setDriversData({
                labels: ['Disponibles', 'Ocupados'],
                datasets: [
                    {
                        data: [freeDriversAverage, busyDriversAverage],
                        backgroundColor: ['#36A2EB', '#FF6384'],
                        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                    }
                ]
            })

            setLoadingDdata(false)
        }

        /*
        const requestDriversInMovilization = await getData('api/users/driversInMovilization')
        console.log('request dim', requestDriversInMovilization)
        if (Array.isArray(requestDriversInMovilization) && requestDriversInMovilization.length > 0) {

            requestDriversInMovilization.map((r) => {
                if (Array.isArray(r)) {

                    let objetosCombinados = [];
    
                    for (let i = 0; i < r.length; i += 2) {
                        if (i + 1 < r.length) {
                            let objetoCombinado = { ...r[i], ...r[i + 1] };
                            objetosCombinados.push(objetoCombinado);
                        } else {
                            // Si hay un número impar de objetos, el último objeto se agrega sin combinar
                            objetosCombinados.push(r[i]);
                        }
                    }
    
                    console.log('objetos combinados', objetosCombinados)
                    setDriversInMovilization(objetosCombinados)
                    setLoadingDriversInMovilization(false)
                } else {
                    setLoadingDriversInMovilization(false)
                }
            })
        } else {
            setLoadingDriversInMovilization(false)
        }


        setLoadingDriversInMovilization(true)
        const requestDriversInMaintenance = await getData('api/users/driversInMaintenance')
        console.log('request man', requestDriversInMaintenance)
        if (Array.isArray(requestDriversInMaintenance) && requestDriversInMaintenance.length > 0) {

            requestDriversInMaintenance.map((r) => {
                if (Array.isArray(r)) {

                    let objetosCombinados: any = [];

                    for (let i = 0; i < r.length; i += 2) {
                        if (i + 1 < r.length) {
                            let objetoCombinado = { ...r[i], ...r[i + 1] };
                            objetosCombinados.push(objetoCombinado);
                        } else {
                            // Si hay un número impar de objetos, el último objeto se agrega sin combinar
                            objetosCombinados.push(r[i]);
                        }
                    }

                    console.log('objetos combinados', objetosCombinados)
                    setDriversInMovilization((prevState: any) => [...prevState, ...objetosCombinados])
                    setLoadingDriversInMovilization(false)
                } else {
                    setLoadingDriversInMovilization(false)
                }
            })



        } else {
            setLoadingDriversInMovilization(false)
        }
        */

        const requestTodayMovilizationRequests = await getData('api/movilizationRequests/today')
        if (Array.isArray(requestTodayMovilizationRequests)) {
            setTodayMovilizations(requestTodayMovilizationRequests)
            setLoadingTodayMovilizations(false)
        }

        const requestTodayMaintenances = await getData('api/maintenanceRequests/today')
        if (Array.isArray(requestTodayMaintenances)) {
            setTodayMaintenances(requestTodayMaintenances)
            setLoadingTodayMaintenances(false)
        }
    }

    useEffect(() => {
        initialRequest()
    }, [])

    return (
        <div>
            <h3>Dashboard</h3>
            <Row>
                <Col span={24}>
                    <Card title="Conductores en servicio">
                        <Table columns={columns} dataSource={[...todayMovilizations, ...todayMaintenances]} loading={loadingTodayMovilizations && loadingTodayMaintenances} />
                    </Card>

                </Col>

                <Col span={12}>
                    <Card title="Conductores">
                        {loadingDdata ? <Spin /> :
                            <PieChart data={driversData} />
                        }
                    </Card>

                </Col>
                <Col span={12}>
                    <Card title="Vehículos">

                        {loadingVdata ? <Spin /> :
                            <PieChart data={vehiclesData} />}
                    </Card>

                </Col>
            </Row>

        </div>
    );
}

export default Dashboard;