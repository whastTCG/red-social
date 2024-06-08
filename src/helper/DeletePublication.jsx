import axios from "axios"
import { Global } from "./Global"

export const deletePublication = async(idPublication) => {

    try {
        const  request = await axios.delete(Global.url + "publication/remove-publication?id="+ idPublication,
            {
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            }
         )
         
         const data = request.data
         return data;


    } catch (error) {
        console.error("error al ejecutar la funcion de borrar publicacion: ", error)
    }
}