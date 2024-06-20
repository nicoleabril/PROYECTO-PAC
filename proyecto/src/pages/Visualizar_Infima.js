import React, {useEffect} from "react";
import {
    
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
  } from "reactstrap";
  // core components
  import View_Inf_Form from '../components/VIEW_INF_FORM';

  const Visualizar_Infima = () => {
    
    return (
      <>
          <Container className="mt--90 mb-4" fluid>
            <Row>
              <Col className="order-xl-15" xl="15">
                <Card className="bg-secondary shadow">
                  <CardHeader className="headerReforma">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">Detalle Ínfima</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <View_Inf_Form />
                  </CardBody>
                </Card>
              </Col>
            </Row>
      </Container>
      </>
    );
  };
  
  export default Visualizar_Infima;