import { Divider, List } from "antd";
import { useEffect, useState } from "react";
import { getData } from "../../../../services/common/getData";
import dayjs from 'dayjs';
import 'dayjs/locale/es'

dayjs.locale('es')

function MovilizationLogs({requestId}: any){
    const [data, setData] = useState<any>([])

    async function initialRequest() {
        const  request = await getData('api/movilizationRequestLogsByRequest/' + requestId)
        console.log('request', request)

        if(Array.isArray(request)){
            setData(request)
        }
    }

    useEffect(() => {
        initialRequest()
    }, [])

    return(
        <>
        <Divider orientation="left">Historial</Divider>
        <List
          size="small"
          bordered
          dataSource={data}
          renderItem={(item: any) => <List.Item>[{'createdAt' &&  dayjs(item['createdAt']).format("DD MMMM YYYY hh:mm")}] {item.content}</List.Item>}
        />
        </>
    )
}

export default MovilizationLogs