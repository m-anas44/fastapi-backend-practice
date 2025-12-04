// Auth code goes here

import axios from "axios";

// export const login= (data:any) => {
//     try {
//         const resp = await axios.post('/api/login', data);
//         return resp.data;
//     } catch (error) {
//         return {
//             message:error.response.data.message,
//             status: error.status
//         }
//     }
// }
interface signupTypes {
  name: string;
  email: string;
  password: string;
  phone: string;
}
interface loginTypes {
  email: string;
  password: string;
}

export async function signupHandler(payload: signupTypes) {
  try {
    const res = await axios.post("/api/signup", payload);
    return res.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Signup Failed",
      status: error.status,
    };
  }
}

export async function loginHandler(payload: loginTypes) {
  try {
    const res = await axios.post("/api/login", payload);
    console.log("response login handler: ", res.data)
    return res.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Login Failed",
      status: error.status,
    };
  }
}
