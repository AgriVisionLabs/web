import React, { useContext } from 'react';
import { PinInput } from 'react-input-pin-code';
// import { AllContext } from '../../Context/All.context';

const Check = (children) => {
    // const {valuesForget, setValuesForget} = useContext(AllContext)
    return (
        <PinInput
        values={children.otpValue}
        onChange={(value, index, values) => children.setOtpValue(values)}
        onFocus={"text-red-600"}
        autoFocus={"true"}
        validBorderColor={"rgb(30,105,48)"}
        focusBorderColor={"rgb(30,105,48)"}
        errorBorderColor={"rgb(255,51,58)"}
        placeholder={"*"}
        inputClassName='mx-2 !border-2 border-red-600'
        />
    );
}

export default Check;
