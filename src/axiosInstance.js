import axios from "axios";

// ✅ إنشاء نسخة مخصصة من axios
const axiosInstance = axios.create({
  baseURL: "https://api.agrivisionlabs.tech", // عدّل حسب API
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔄 التحكم في حالة التحديث
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ إضافة access token لكل طلب تلقائيًا
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// ✅ التعامل مع انتهاء صلاحية التوكن
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        localStorage.getItem("refreshToken")
        ) {
        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
            })
            .then(token => {
                originalRequest.headers.Authorization = "Bearer " + token;
                return axiosInstance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        isRefreshing = true;

        try {
        const res = await axios.post("https://api.agrivisionlabs.tech/Auth/refresh", {
            token: localStorage.getItem("token"),
            refreshToken: localStorage.getItem("refreshToken"),
        });

        const newToken = res.data.token;
        const newRefreshToken = res.data.refreshToken;
        const newExpiresIn = res.data.expiresIn;
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("expiresIn", newExpiresIn);

        axiosInstance.defaults.headers.Authorization = "Bearer " + newToken;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = "Bearer " + newToken;
        return axiosInstance(originalRequest);
        } catch (err) {
            console.log(err)
            processQueue(err, null);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("expiresIn");
            window.location.href = "/login"; 
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
}
);

export default axiosInstance;

console.log("✅ axiosInstance تم تحميله بنجاح");
