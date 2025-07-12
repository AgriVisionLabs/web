import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import mainImage from "../../assets/logo/AgrivisionLogo.svg";
import { AllContext } from "../../Context/All.context";
import { userContext } from "../../Context/User.context";

const AcceptInvitation = () => {
  const { baseUrl } = useContext(AllContext);
  const { token } = useContext(userContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const invitationToken = params.get("token");

  useEffect(() => {
    // If no auth token, redirect to login preserving redirect URL
    if (!token) {
      const redirectUrl = encodeURIComponent(`/invite/accept?token=${invitationToken}`);
      navigate(`/login?redirect=${redirectUrl}`);
      return;
    }

    const accept = async () => {
      if (!invitationToken) {
        setStatus("error");
        return;
      }
      try {
        const response = await axios({
          url: `${baseUrl}/InvitationActions/accept`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            token: invitationToken,
          },
        });
        if (response.status >= 200 && response.status < 300) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (e) {
        if (e.response && e.response.status === 401) {
          const redirectUrl = encodeURIComponent(`/invite/accept?token=${invitationToken}`);
          navigate(`/login?redirect=${redirectUrl}`);
        } else {
          setStatus("error");
        }
      }
    };
    accept();
  }, [invitationToken, baseUrl, token, navigate]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
          <p className="text-[#808080] mt-4">Accepting invitation...</p>
        </>
      );
    }
    if (status === "success") {
      return (
        <>
          <div className="flex  justify-center items-center mt-8 mb-5">
            <div className="w-[55px] h-[55px] bg-[#1e693029] rounded-full flex justify-center items-center">
              <i className="fa-solid fa-check text-2xl text-mainColor"></i>
            </div>
          </div>
          <h1 className="text-[20px] font-bold ">Invitation Accepted!</h1>
          <p className="text-[16px] font-medium text-[#616161] w-[390px] text-center py-4">
            You have successfully joined the farm. Go to dashboard to explore.
          </p>
          <button
            className=" px-10  py-3 rounded-full  bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium  mt-9"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </>
      );
    }
    return (
      <>
        <div className="flex  justify-center items-center mt-8 mb-5">
          <div className="w-[55px] h-[55px] bg-red-100 rounded-full flex justify-center items-center">
            <i className="fa-solid fa-xmark text-2xl text-red-600"></i>
          </div>
        </div>
        <h1 className="text-[20px] font-bold ">Accept Invitation Failed</h1>
        <p className="text-[16px] font-medium text-[#616161] w-[390px] text-center py-4">
          Unable to accept the invitation. It may be expired or invalid.
        </p>
        <button
          className=" px-10  py-3 rounded-full  bg-mainColor text-white hover:bg-transparent hover:border-mainColor border-2 hover:text-mainColor font-medium  mt-9"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
      </>
    );
  };

  return (
    <section>
      <main className="flex  w-screen h-screen justify-center items-center">
        <div className=" flex flex-col justify-center items-center">
          <img src={mainImage} alt="logo" className="w-[150px]" />
          {renderContent()}
        </div>
      </main>
    </section>
  );
};

export default AcceptInvitation; 