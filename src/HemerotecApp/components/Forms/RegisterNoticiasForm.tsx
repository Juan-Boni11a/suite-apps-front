import {
    Button, DatePicker, Form, List, Input, InputNumber, Radio, Modal, Row,
    Select, Table, Typography, Upload, message, UploadProps, UploadFile, Card, Col, Divider
} from "antd";
import { useContext, useEffect, useState } from "react";
import { postData } from "../../../services/common/postData";

import { getData } from "../../../services/common/getData";

import { transformDate, transformTime } from "../../../utils/general";
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileToCloudinary } from "../../utils/uploader";
import { deleteData } from "../../../services/deleteData";

import * as dayjs from 'dayjs'
import 'dayjs/locale/es'
import { AuthContext } from "../../../context/AuthContext";

dayjs.locale('es')


const users = [
    { label: 'Eduardo', value: 'Eduardo' },
    { label: 'Sarai', value: 'Sarai' }
]
const subsectores = [
    { label: 'Empresarial', value: "Empresarial" },
    { label: 'Industrial', value: "Industrial" }
]
const tipoInformacion = [
    { label: 'Local', value: "Local" },
    { label: 'Actual', value: "Actual" }
]
const medioComunicacion = [
    { label: 'Digital', value: "Digital" },
    { label: 'Fisico', value: "Fisico" }
]

const RegisterNoticiasForm = () => {
    const [form] = Form.useForm()
    const [submitting, setSubmitting] = useState(false)
    const [opinions, setOpinions] = useState<any>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const [data, setData] = useState<any>([])

    const [refresh, setRefresh] = useState(false)

    const [existOpinions, setExistOpinions] = useState<any>([]);

    const onChangeUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {

        const updatedList = []

        const tr = form.getFieldValue('testResults')

        console.log('tr', tr)

        const dfl = (tr && tr.length > 0) ? tr.map((result: any, index: any) => {
            return {
                uid: index,
                name: result.url,
                status: 'done',
                url: result.url,
            }
        })
            :
            []

        console.log('dfl', dfl)

        console.log('new file list', newFileList)

        const cleanNfl = newFileList.map((file: any) => {
            return {
                ...file,
                status: 'done'
            }
        })

        setFileList(cleanNfl);
    };

    const handleSubmit = async (values: any) => {
        // setSubmitting(true)


        console.log('values', values)
        let finalTestResults: any = []
        // let testResultsToApi = []
        if (values.imagen) {
            const imageForm = new FormData()

            console.log('treee', values.imagen)

            for (let i = 0; i < fileList.length; i++) {
                const fl: any = fileList[i];
                const uploadPreset = "imagePreset";
                imageForm.append('file', fl.originFileObj)
                imageForm.append("upload_preset", uploadPreset);

                const uploadImage = await uploadFileToCloudinary(imageForm)
                console.log('ui', uploadImage)

                if (!uploadImage) {
                    message.error("Algo ha salido mal procesando la imagen :( , por favor intenta de nuevo")
                    setSubmitting(false)
                    return
                }

                finalTestResults.push({
                    url: uploadImage
                })

            }

            console.log('ATR', finalTestResults)
        }

        console.log('AFTER ATR', finalTestResults)

        const { id } = values;
        const cleanValues = {
            id,
            dateRegister: transformDate(values.dateRegister),
            nameResp: user && (user.name + " " + user.lastname),
            emitNoticia: transformDate(values.emitNoticia),
            seccion: values.seccion,
            numPage: values.numPage,
            sectorNoti: values.sectorNoti,
            subsector: values.subsector,
            tipoInfo: values.tipoInfo,
            medioComunicacion: values.medioComunicacion,
            fuente: values.fuente,
            tendencia: typeof values.tendence === "undefined" ? "Positiva" : values.tendence,
            resumen: values.resumen,
            comentario: values.comentario,
            image: finalTestResults[0].url
        }

        console.log('clean values', cleanValues)

        const request = await postData('api/news', cleanValues, true)
        if ('comentario' in request) {

            opinions.map(async (op: any) => {
                await postData(
                    'api/opinions',
                    { ...op, news_id: { id: request.id } },
                    true
                )
            })

            message.success("Documento creado exitosamente")
            form.resetFields()
            setOpinions([])
            setFileList([])
            setRefresh((prevState: any) => !prevState)
            setSubmitting(false)
            handleShowForm()
            return

        }

        message.error("Ha ocurrido un error :(")
        setSubmitting(false)

    }

    const handleAddOpinion = () => {
        const name = form.getFieldValue('name');
        const opinion = form.getFieldValue('opinion');
        const tendencia = form.getFieldValue('tendencia');

        if (name && opinion && tendencia) {
            const newOpinion = {
                name,
                opinion,
                tendencia
            };
            setOpinions([...opinions, newOpinion]);
            form.resetFields(['name', 'opinion', 'tendencia']);
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Opinión',
            dataIndex: 'opinion',
            key: 'opinion',
        },
        {
            title: 'Tendencia',
            dataIndex: 'tendencia',
            key: 'tendencia',
        },
    ];


    async function initialRequest() {

        const requestOpinions = await getData('api/opinions', true)



        const request = await getData('api/news', true)
        console.log('r', request)
        if (Array.isArray(request)) {
            setData(request)

            if (Array.isArray(requestOpinions)) {

                if (requestOpinions.length > 0) {
                    if (request.length > 0) {
                        const fullNews = request.map((n: any) => {
                            const filteredOpinions = requestOpinions.filter((op: any) => op.news_id.id === n.id)
                            n['opinions'] = filteredOpinions
                            return n
                        })
                        setData(fullNews)
                    }
                }
            }
        }


    }

    useEffect(() => {
        initialRequest()
    }, [refresh])


    async function handleDelete(nId: any) {
        await deleteData('api/news/' + nId, true)
        message.success("Documento eliminado exitosamente")
        setRefresh(!refresh)
    }


    const [showDetails, setShowDetails] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<any>({})


    async function handleModalDetails(record: any) {
        setSelectedRecord(record)
        setShowDetails(true)
    }

    const { user }: any = useContext(AuthContext)


    const newsColumns = [
        {
            title: 'Fecha',
            dataIndex: 'dateRegister',
            key: 'dateRegister',
        },
        {
            title: 'Descripción',
            dataIndex: 'resumen',
            key: 'resumen',
        },
        {
            title: 'Sector',
            dataIndex: 'sectorNoti',
            key: 'sectorNoti',
        },
        {
            title: 'Acciones',
            key: 'X',
            render: (record: any) => (
                <Button type="primary" onClick={() => handleModalDetails(record)}>
                    Ver detalle
                </Button>
            )
        }
    ];


    const [showForm, setShowForm] = useState(false)

    const handleShowForm = () => setShowForm((prevState: any) => !prevState)

    return (
        <Card title="" extra={<Button type="primary" onClick={handleShowForm}>Nueva noticia</Button>}>
            <Table dataSource={data} columns={newsColumns} />
            <Modal open={showForm} title="Nueva noticia" footer={null} width={"50%"} onCancel={handleShowForm}>
                <Form form={form} onFinish={handleSubmit} >
                    <Row>
                        <Col span={7}>
                            <Form.Item label="Fecha del registro" name="dateRegister">
                                <DatePicker />
                            </Form.Item>
                        </Col>

                        <Col span={7} offset={1}>
                            <Form.Item label="Nombre Usuario" name="nameResp">
                                <Input disabled defaultValue={user && (user.name + " " + user.lastname)} />
                            </Form.Item>
                        </Col>


                        <Col span={7} offset={1}>
                            <Form.Item label="Fecha de la noticia" name="emitNoticia">
                                <DatePicker />
                            </Form.Item>
                        </Col>

                        <Col span={7}>
                            <Form.Item label="Seccion" name="seccion">
                                <InputNumber style={{ width: '90%' }} />
                            </Form.Item>

                        </Col>

                        <Col span={7} offset={1}>

                            <Form.Item label="No. Pagina" name="numPage">
                                <InputNumber style={{ width: '90%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={7} offset={1}>
                            <Form.Item label="Sector referente de la noticia" name="sectorNoti">
                                <Radio.Group name="sectorNoti">
                                    <Radio value="Hidrocarburos">Hidrocarburos</Radio>
                                    <Radio value="Minas">Minas</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item label="Subsector" name="subsector" >
                                <Select options={subsectores} />
                            </Form.Item>
                        </Col>
                        <Col span={7} offset={1}>
                            <Form.Item label="Tipo de informacion" name="tipoInfo" >
                                <Select options={tipoInformacion} />
                            </Form.Item>

                        </Col>
                        <Col span={7} offset={1}>
                            <Form.Item label="Medio comunicacion" name="medioComunicacion" >
                                <Select options={medioComunicacion} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Fuente / Articulista" name="fuente" >
                        <Input></Input>
                    </Form.Item>

                    <Form.Item label="Tendencia de la noticia" name="tendence">
                        <Radio.Group name="tendencia" defaultValue={"Positiva"}>
                            <Radio value="Positiva">Positiva</Radio>
                            <Radio value="Negativa">Negativa</Radio>
                            <Radio value="Neutra">Neutra</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Resumen" name="resumen">
                        <Input.TextArea rows={6} />
                    </Form.Item>

                    <Form.Item label="Imagen de la noticia" name="imagen">
                        <Upload
                            showUploadList={true}
                            multiple={true}
                            fileList={fileList}
                            onChange={onChangeUpload}
                        >
                            <Button icon={<UploadOutlined />}>Subir imagen</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Generadores de opinion">
                        <Form.Item label="Nombre" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Opinión" name="opinion">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item label="Tendencia" name="tendencia">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleAddOpinion}>
                                Añadir opinión
                            </Button>
                        </Form.Item>
                    </Form.Item>

                    <Table
                        dataSource={opinions}
                        columns={columns}
                        pagination={false}
                        bordered
                        rowKey={(record: any) => record.name}
                    />

                    <Form.Item label="Comentarios" name="comentario" style={{ marginTop: "30px" }}>
                        <Input.TextArea rows={6} />
                    </Form.Item>



                    <Row justify="end">
                        <Button htmlType="submit" type="primary" loading={submitting}>Guardar</Button>
                    </Row>
                </Form>
            </Modal>

            <Modal open={showDetails} title="Noticia" footer={null} width="40%" onCancel={() => {
                setSelectedRecord({})
                setShowDetails(false)
            }}>
                <Row>
                    {'image' in selectedRecord && selectedRecord.image !== null &&
                        <Col span={10}>
                            <img src={selectedRecord.image} width="100%" height={400} />

                        </Col>

                    }

                    <Col span={8} offset={1}>
                        <span style={{ display: 'block', fontSize: 12 }} >Fecha: {dayjs(selectedRecord.dateRegister).format('DD MMMM YYYY hh:mm')}</span>
                        <Divider />
                        <span style={{ display: 'block', fontSize: 16, fontWeight: 'bolder' }} >Sector: {selectedRecord.sectorNoti}</span>
                        <span style={{ display: 'block', fontSize: 16, fontWeight: 'bolder' }}>Subsector: {selectedRecord.subsector}</span>
                        <span style={{ display: 'block', fontSize: 16, fontWeight: 'bolder' }}>Tipo de información: {selectedRecord.tipoInfo}</span>
                        <span style={{ display: 'block', fontSize: 16, fontWeight: 'bolder' }}>Medio de comunicación: {selectedRecord.medioComunicacion}</span>
                        <Divider />


                        <span style={{ display: 'block', fontSize: 14 }}> Descripción de noticia: {selectedRecord.resumen}</span>

                        <Divider />

                        <span style={{ display: 'block', fontSize: 14 }}> Comentario: {selectedRecord.resumen}</span>

                        <Divider />

                        {'opinions' in selectedRecord && (
                            <>
                                <span style={{ display: 'block' }}>Opiniones: </span>
                                {selectedRecord.opinions.length > 0 && selectedRecord.opinions.map((op: any) => (
                                    <span style={{ display: 'block' }}>{op.name}: {op.opinion}</span>
                                ))}
                            </>
                        )}

                        <Divider />
                        <span style={{ display: 'block', fontSize: 10 }} >Fuente: {selectedRecord.fuente}</span>

                    </Col>

                </Row>
                {/*
                <Button style={{ display: 'block' }} type="primary" onClick={() => handleDelete(selectedRecord.id)}>Eliminar</Button>
                */}

            </Modal>
        </Card>
    )
}

export default RegisterNoticiasForm;