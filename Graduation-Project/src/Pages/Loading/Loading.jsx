import styles from "./Loading.module.css"
import mainImage from "../../assets/logo/AgrivisionLogo.svg"
const Loading = () => {
    
    return (
        <>

            <div className="w-screen h-screen flex justify-center items-center bg-[#fcfcfc]">
                <div className="flex flex-col justify-center items-center">
                <img src={mainImage} alt="" className="w-[200px] mb-24" />
                <span className={styles.loader}></span>
                </div>
            </div>
        </>
    );
}

export default Loading;