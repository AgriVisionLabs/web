import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="h-[100vh] w-[100vw] relative overflow-hidden">
      <AnimatePresence mode="wait" initial={true}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout; 