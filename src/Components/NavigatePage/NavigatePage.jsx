import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllContext } from '../../Context/All.context';

const NavigatePage = () => {
    const navigate = useNavigate();
    let {onOpenPage}=useContext(AllContext);
    useEffect(() => {
        switch (onOpenPage) {
            case 0:
            navigate("/dashboard");
            break;
            case 3:
            navigate("/irrigation");
            break;
            case 4:
            navigate("/home-disease-detection");
            break;
            case 5:
            navigate("/sensors-and-devices");
            break;
            default:
            break;
        }
        }, [onOpenPage]);
    return null; 
    };

export default NavigatePage;
