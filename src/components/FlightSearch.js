import React, {PureComponent} from 'react';
import './FlightSearch.css';
import {FormGroup, FormControl, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class extends PureComponent {
   

    render() {
        return (
            <form className="fs-container" method="post" action="#">
                <FormGroup controlId="departureLocation" bsSize="large">
                    <FormControl
                        type="text"
                        name="departureLocation"
                        placeholder="departureLocation"
                                       />
                </FormGroup>
                <FormGroup controlId=" arrivalLocation" bsSize="large">
                    <FormControl
                        type="text"
                        name="arrivalLocation"
                        placeholder=" arrivalLocation"

                    />
                </FormGroup>
                <FormGroup controlId="departure" bsSize="large">
                <FormControl
                                        type="date"
                                        name="departure"
                    placeholder="Departure date"
                  
                />
                                </FormGroup>
                <FormGroup controlId="arrival" bsSize="large">
                <FormControl
                                                        type="date"
                                                        name="arrival"
                    placeholder="Arrival date"
                  
                />
                                                </FormGroup>
                  <FormGroup controlId="numberOfPepole" bsSize="large">
                <FormControl
                                                        type="text"
                                                        name="numberOfPepole"
                    placeholder="numberOfPepole"
                                 />
                                                </FormGroup>
                                                                           
                  <FormGroup controlId=" numberOfSeats" bsSize="large">
                <FormControl
                                                        type="text"
                                                        name="numberOfSeats"
                    placeholder=" numberOfSeats"
                    />
                                 </FormGroup>
               <FormGroup controlId="flightNumber" bsSize="large">
                <FormControl
                                                        type="text"
                                                        name="flightNumber"
                    placeholder="flightNumber"
                    />
                                 </FormGroup>
               
                <Button
                    type="submit"
                    bsStyle="primary"
                    style={{height: '46px'}}
                    bsSize="large"
                >
                  {'Search'}
                </Button>
            </form>
        );
    }
}
