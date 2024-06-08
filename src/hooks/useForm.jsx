/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

export const useForm = (initialObj) => {

    const [form, setForm] =useState(initialObj);

    const changed = ({target}) =>{
        //con el target podemos acceder al name y al value del input donde usemos este metodo
       // console.log(target);

       //con esto estamos desestructurando el target ya que es un objeto con el cual podemos sacar directamente el name y value
       const {name, value} = target;

       // el ...form sirve para que al momento de guardar datos los datos anteriores tambien se guarden y no se pierdan 
       // con el name capturamos en name de cada input y le damos como valor el value ya que el target esta desestructurado 
       // sino tendria que ser target.name luego target.value pero con la desestructuracion accedemos a esos valores directamente
       setForm({
        ...form,
        [name]: value
       })

       //console.log(form);
    }

  return {
    form,
    changed
  }
}
