import React from 'react';
import { useNavigate } from "react-router-dom";
import './SelectPitch.css';

const MAX_LOCATION_LENGTH = 35;
function SelectPitch(props) {
    const navigate = useNavigate();
    const { 
        header, 
        pitch = '??', location='?????', type='astro',
        onChoosePitch = () => {},
    } = props;
    
    const Container = header  ? 'h3' : 'div';
    const h3Styles = { 
        lineHeight: '10px',
        borderRadius: '0',
    }
    return (
        <Container onClick={() => {
            onChoosePitch()
            navigate(`/pitch/${id}`)
        }} style={header ? h3Styles : {}} className='container'>
            <span>{id}</span>
            <span>{
                location.length > MAX_LOCATION_LENGTH ?
                    location.substring(0, MAX_LOCATION_LENGTH) + '...' :
                    location
            }</span>
            <span>{type}</span>
        </Container>
    );
}

export default SelectPitch
