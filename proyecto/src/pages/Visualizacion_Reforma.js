import React, { Component, useState, useEffect } from "react";
import { Form } from 'antd';
import {
    TextArea,
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Input,
    Container,
    Row,
    Col,
  } from "reactstrap";
  // core components
  import AsyncSelect from 'react-select/async';
  import Select from 'react-select';
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import View_Reform from '../components/VIEW_REFORM';

  const Visualizar_Reforma = () => {
    
    return (
      <>
          <Container className="mt--90 mb-4" fluid>
            <Row>
              <Col className="order-xl-15" xl="15">
                <Card className="bg-secondary shadow">
                  <CardHeader className="headerReforma">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">Detalle Reforma</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <View_Reform />
                  </CardBody>
                </Card>
              </Col>
            </Row>
      </Container>
      </>
    );
  };
  
  export default Visualizar_Reforma;