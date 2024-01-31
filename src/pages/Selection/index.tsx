import { Card, Col, Input, Row, Typography } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";




function SelectionPage() {

  const navigate = useNavigate();

  const { user }: any = useContext(AuthContext)

  const isAdmin = user.roles[0].name !== "CLIENTE" ? true : false


  const apps = [
    {
      label: 'Gestión de transporte',
      image: "./trLogin.png",
      onClick: () => {
        if (isAdmin) {
          navigate("/transports")
        } else {
          navigate("/transports/movilizationOrders")
        }
      },
    },
    {
      label: 'Hemeroteca',
      image: './hmLogin.png',
      onClick: () => {
        if (isAdmin) {
          navigate("/hemerotec")
        } else {
          navigate("/hemerotec/noticias")
        }
      }
    }
  ]

  const [searchResults, setSearchResults] = useState(apps)

  const handleChangeInput = (e: any) => {
    const searchText = e.target.value
    const filteredApps = apps.filter((app: any) => app.label.toLowerCase().includes(searchText.toLowerCase()))
    console.log('filtered apps', filteredApps)
    setSearchResults(filteredApps)

  }

  return (
    <div style={{ marginTop: 20, paddingLeft: 24, paddingRight: 24 }}>
      <Typography.Title>Bienvenido</Typography.Title>
      <Input onChange={handleChangeInput} placeholder="Ingrese el nombre de la app que desea usar..." style={{ marginBottom: 16 }} />

      <Row style={{ marginLeft: 20, marginRight: 20 }}>
        {searchResults && searchResults.length > 0 && searchResults.map((app: any) =>
          <Col key={app.label} span={12} style={{ paddingBottom: 36, paddingRight: 12, cursor: 'pointer' }} >
            <Card onClick={app.onClick}>
              <Row style={{ display: 'flex', alignItems: 'center' }} >
                <Col span={8}>
                  <img src={app.image} alt="" style={{ height: 260, width: '100%' }} />

                </Col>
                <Col span={16}>
                  <Typography.Title>{app.label}</Typography.Title>
                </Col>
              </Row>
            </Card>
          </Col>

        )}


        {isAdmin &&
          <Col span={24}>
            <Card onClick={() => navigate("/usersManagement")} >
              <Row style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                <Col span={8}>
                  <img src="./hmLogin.png" alt="" style={{ height: 260, width: '100%' }} />
                </Col>
                <Col span={16}>
                  <Typography.Title>Administración de Usuarios</Typography.Title>
                </Col>
              </Row>
            </Card>
          </Col>
        }

      </Row>
    </div>
  )
}

export default SelectionPage;