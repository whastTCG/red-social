import axios from "axios"
import { Global } from "./Global"
export const getProfileUser = async(id) =>{

    try {
        
        const request = await axios.get(Global.url +"user/profile/"+id,
            {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:localStorage.getItem("token")
                }
            }
        );

        if (request.data.status === "success") {
            return request.data
        }else{
            throw new Error("Failed to fetch user profile");
        }

        
    } catch (error) {
        console.error("error al solicitar informacion del perfil usuario:", error)
    }finally{
        console.log("Peticion de perfil de usuario finalizada");
    }

}