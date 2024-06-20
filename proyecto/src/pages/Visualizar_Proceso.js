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
  import View_Form from '../components/VIEW_FORM';

  const Visualizar_Proceso = () => {

    useEffect(() => {
        
        const idParaEditar = localStorage.getItem('id');
        console.log('ID para editar:', idParaEditar);
      }, []); 
    
    
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
                    <View_Form />
                  </CardBody>
                </Card>
              </Col>
            </Row>
      </Container>
      </>
    );
  };
  
  export default Visualizar_Proceso;