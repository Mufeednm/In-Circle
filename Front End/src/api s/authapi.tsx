import axios from "axios"


const api = axios.create({
    baseURL: 'http://localhost:4500/api',
});

 export const registration = async (  
   name:string,
    email: string,
    password: string,
 )
  : Promise<any> => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });
  
      return response;
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  };

  export const login = async (  

     email: string,
     password: string,
  )
   : Promise<any> => {
     try {
       const response = await api.post("/login", {
         email,
         password,
       });
   
       return response.data;
     } catch (error) {
       console.error("Sign up failed:", error);
       throw error;
     }
   };


   export const googleauth = async (  

   token:string
 )
  : Promise<any> => {
    try {
      const response = await api.post("/google-login", {
     token
      });
  
      return response
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  };