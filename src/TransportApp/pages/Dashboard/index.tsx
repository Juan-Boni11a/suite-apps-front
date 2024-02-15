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
        }

    ];
    
    const maColumns = [
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
            title: 'Fecha de mantenimiento',
            key: "y",
            render: (record: any) => <>
                {'date' in record && <span>{record.date + "-" + record.hour}</span>}
            </>
        },
        {
            title: 'Lugar de mantenimiento',
            key: "k",
            render: (record: any) => <>
                {'serviceStation' in record && <span>{record.serviceStation.name}</span>}
            </>
        },

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

        const requestTodayMovilizationRequests = await getData('api/movilizationRequests')
        if (Array.isArray(requestTodayMovilizationRequests)) {

            if (requestTodayMovilizationRequests.length > 0) {
                const now = new Date();
                const filteredRequests = requestTodayMovilizationRequests.filter((request) => {
                    const emitDateTime = new Date(request.emitDate + ' ' + request.emitHour)
                    const expiryDateTime = new Date(request.expiryDate + ' ' + request.expiryHour)
                    return now >= emitDateTime && now <= expiryDateTime && request.status === 'ACCEPTED'
                });
                setTodayMovilizations(filteredRequests)
                setLoadingTodayMovilizations(false)
            }
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
                    <Card title="Conductores en Movilización">
                        <Table columns={columns} dataSource={todayMovilizations} loading={loadingTodayMovilizations} />
                    </Card>
                </Col>

                <Col span={24}>
                    <Card title="Conductores en Mantenimiento">
                        <Table columns={maColumns} dataSource={todayMaintenances} loading={loadingTodayMaintenances} />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="Conductores">
                        {loadingDdata ? <Spin /> :
                            <PieChart data={driversData} />
                        }
                    </Card>

                </Col>
                <Col span={8}>
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