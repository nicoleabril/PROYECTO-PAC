/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useState, useEffect } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Progress,
  Upload,
  message,
  Button,
  Timeline,
  Radio,
} from "antd";
import {
  ToTopOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Axios from 'axios';
import Paragraph from "antd/lib/typography/Paragraph";
import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
import { FaUserTie } from "react-icons/fa6";
import { DollarOutlined, NumberOutlined } from "@ant-design/icons";
import {
  Container,
} from "reactstrap";
import { parse } from "@fortawesome/fontawesome-svg-core";
function Home() {
  const { Title, Text } = Typography;
  const [presupuesto, setPresupuesto] = useState([]);
  const [numProcesos, setNumProcesos] = useState([]);
  const formatPresupuesto = (cantidad) => {
    return cantidad.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const count = [
    {
      today: "Nº Procesos",
      title: numProcesos,
      icon: <NumberOutlined />,
      bnb: "bnb2",
    },
    {
      today: "Presupuesto Total",
      title: '$'+formatPresupuesto(parseFloat(presupuesto)),
      icon: <DollarOutlined />,
      bnb: "bnb2",
    },
  ];



  useEffect(() => {
    const obtenerPresupuesto = async (regimen) => {
      try {
          const response = await Axios.get(`http://localhost:5000/obtener_presupuesto_total/`);
          const numero = parseFloat(response.data.sum);
          setPresupuesto(numero);
      } catch (error) {
          console.error('Error al obtener presupuesto', error);
      }
    };

    const obtenerNumProcesos = async (regimen) => {
      try {
          const response = await Axios.get(`http://localhost:5000/obtener_numero_procesos/`);
          const numero = parseFloat(response.data.count);
          setNumProcesos(numero);
      } catch (error) {
          console.error('Error al obtener presupuesto', error);
      }
    };
  
    obtenerPresupuesto();
    obtenerNumProcesos();
  
  }, []);

  return (
    <>
   <div className="contenedorHome">
      <div className="layout-content">
      <div className="statistics">
        <Row className="rowgap-vbox" gutter={[28, 0]}>
          {count.map((c, index) => (
            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
              <Card bordered={false} className="criclebox">
                <div className="number">
                  <Row align="middle" gutter={[28, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3}>
                        {c.title} 
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
        <Row gutter={[28, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Echart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>

      </div>
      </div>
    </>
  );
}

export default Home;
