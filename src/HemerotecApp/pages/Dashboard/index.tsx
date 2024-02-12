import { Card, Col, Row, Spin, Table } from "antd";
import { getData } from "../../../services/common/getData";
import { useEffect, useState } from "react";
import PieChart from "../../../TransportApp/components/Charts/Piechart";

function Dashboard() {

 

    const [loadingData, setLoadingData] = useState<any>(true)

    const [newsData, setNewsData] = useState<any>(null)


    async function initialRequest() {

        const requestCount = await getData('api/news/countByTendence', true)
        console.log('count', requestCount)
        if (Array.isArray(requestCount)) {
            console.log('AAA')

            let positivePair = requestCount.find(e => e.includes("Positiva"))
            
            let negativePair = requestCount.find(e => e.includes("Negativa"))
            let neutronPair = requestCount.find(e => e.includes("Neutro"))


            
            let totalNews = 0;

            if(positivePair){
                totalNews+=positivePair[0]
            }

            if(negativePair){
                totalNews+=negativePair[0]
            }

            if(neutronPair){
                totalNews+=neutronPair[0]
            }

            let positiveAverage =  positivePair ? (positivePair[0]/totalNews)*100 : 0
            let negativeAverage = negativePair ? (negativePair[0]/totalNews)*100 : 0
            let neutronAverage = neutronPair ? (neutronPair[0]/totalNews)*100 : 0;
            
            
            setNewsData({
                labels: ['Positivas', 'Negativas', 'Neutras'],
                datasets: [
                    {
                        data: [positiveAverage, negativeAverage, neutronAverage],
                        backgroundColor: ['#36A2EB', '#FF6384', '#088F8F'],
                        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#088F8F'],
                    }
                ]
            })
            setLoadingData(false)
        }

   
    }

    useEffect(() => {
        initialRequest()
    }, [])

    return (
        <div>
            <h3>Dashboard</h3>
            <Row>

                <Col span={8}>
                    <Card title="Noticias">
                        {loadingData ? <Spin /> :
                           <PieChart data={newsData} />
                        }
                    </Card>

                </Col>
            </Row>

        </div>
    );
}

export default Dashboard;