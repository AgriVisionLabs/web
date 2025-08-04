import { PinInput } from "react-input-pin-code";
// import { AllContext } from '../../Context/All.context';

const Check = (children) => {
  // const {valuesForget, setValuesForget} = useContext(AllContext)
  const { hasError } = children;

  return (
    <PinInput
      values={children.otpValue}
      onChange={(value, index, values) => children.setOtpValue(values)}
      onFocus={"text-red-600"}
      autoFocus={"true"}
      validBorderColor={hasError ? "rgb(239,68,68)" : "rgb(30,105,48)"}
      focusBorderColor={hasError ? "rgb(239,68,68)" : "rgb(30,105,48)"}
      errorBorderColor={"rgb(239,68,68)"}
      placeholder={""}
      inputClassName={`mx-2 !border-2 ${
        hasError
          ? "!border-red-500 !text-red-500 !bg-red-50"
          : "!border-gray-300 !text-mainColor"
      }`}
    />
  );
};

export default Check;
