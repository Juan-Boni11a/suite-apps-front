import { Button, Col, DatePicker, Form, Input, Row, Select, Upload, message } from "antd";
import { postData } from "../../../services/common/postData";
import { useState } from "react";
import { uploadFileToCloudinary } from "../../../HemerotecApp/utils/uploader";
import * as dayjs from 'dayjs'


const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};


const defaultRules = [{ required: true, message: 'Información requerida' }]


function UserForm({ handleModal, handleRefresh, toDriver = false }: any) {

    const handleFinish = async (values: any) => {
        console.log('values', values)

        let fullData = {
            ...values,
            role: toDriver ? { id: 3 } : { id: 2 }
        }

        if (values.imagen) {

            const imageForm = new FormData()
            const uploadPreset = "imagePreset";
            imageForm.append('file', values.imagen.file.originFileObj)
            imageForm.append("upload_preset", uploadPreset);

            const uploadedImage = await uploadFileToCloudinary(imageForm)

            if (!uploadedImage) {
                message.error("Algo ha salido mal procesando la imagen :( , por favor intenta de nuevo")
                return
            }

            fullData['avatarUrl'] = uploadedImage
        }

        console.log('fullData', fullData)

        const request = await postData('api/users', fullData)

        if ('name' in request) {
            message.success("Usuario creado exitosamente")
            handleModal()
            handleRefresh()
            return;
        }

        if ('error' in request) {
            message.error(request.error)
            return;
        }

        message.error("Algo salió mal")
    }



    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const handleChange = (info: any) => {
        console.log('info')
        getBase64(info.file.originFileObj, (url: any) => {
            console.log('url', url)
            setLoading(false);
            setImageUrl(url);
        });

    };
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Subir imagen
            </div>
        </button>
    );


    const disabledDate = (current: any) => {
        return current && dayjs(current).isBefore(dayjs(), 'day');
    };



    return (
        <Form onFinish={handleFinish} >
            <Form.Item label="Imagen de la noticia" name="imagen">
                <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </Form.Item>
            <Form.Item label="Nombre" name="name" rules={defaultRules}>
                <Input />
            </Form.Item>
            <Form.Item label="Apellido" name="lastname" rules={defaultRules} >
                <Input />
            </Form.Item>
            <Form.Item label="Cédula" name="ci" rules={defaultRules}>
                <Input />
            </Form.Item>

            <Form.Item label="No. Teléfono" name="phone_number" rules={defaultRules}>
                <Input />
            </Form.Item>


            <Form.Item label="Correo electrónico" name="email" rules={defaultRules}>
                <Input />
            </Form.Item>


            <Form.Item label="Contraseña" name="password" rules={defaultRules}>
                <Input />
            </Form.Item>


            {
                toDriver && (
                    <>
                        <Form.Item label="Tipo de licencia" name="licenseType" rules={defaultRules} >
                            <Select options={[
                                { label: 'A', value: 'A' },
                                { label: 'B', value: 'B' },
                                { label: 'F', value: 'F' },
                                { label: 'A1', value: 'A1' },
                                { label: 'C', value: 'C' },
                                { label: 'C1', value: 'C1' },
                                { label: 'D', value: 'D' },
                                { label: 'D1', value: 'D1' },
                                { label: 'E', value: 'E' },
                                { label: 'E1', value: 'E1' },
                                { label: 'G', value: 'G' }
                            ]}
                            />
                        </Form.Item>
                        <Form.Item label="Fecha" name="licenceExpiryDate" rules={defaultRules}>
                            <DatePicker disabledDate={disabledDate} />
                        </Form.Item>
                    </>
                )}

            <Row justify="end" >
                <Button htmlType="submit" type="primary">Guardar</Button>
            </Row>

        </Form>
    )
}

export default UserForm