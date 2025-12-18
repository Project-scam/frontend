// src/components/Registration/Registration.jsx

import { useState } from "react";
import Message from "../Message";

const Registration = ({
    inputName = "Username", // defaul cambiabile liv. visivo
    inputPassword = "Password", // defaut cambiabile liv. visivo
    inputPasswordReconfirm = "Rewrite Password", // default cambiabile liv. visivo
    urlFetch,
    isSuccess
}) => {

    const [messageError, setMessageError] = useState(null) // stato per messaggio errore

    const handleSubmit = (event) => {
/*  VERIFICA DEI DATI SE PRESENTI PER ESSERE SPEDITI:
    event.preventDefault() // blocca l’invio “classico” del form
    console.log(event.target.elements.username.value)
    console.log(event.target.elements.password.value) 
*/
    event.preventDefault(); // qui blocco per inviare i dati nel formato json con fetch

    setMessageError(null) // vado così a cancellare possibili errori se c'è ne sono stati a una richiesta di registrazione precedente rimpostanto lo stato a null

    const username = event.target.elements.username.value // prendo i valori dell' username
    const password = event.target.elements.password.value // prendo i valori della password
    const rewritePassword = event.target.elements.passwordReconfirm.value // prendo i valori della seconda password

    // CONTROLLO DATI INSERITI DALL'UTENTE
    const areSpaces = username.includes(" "); // se gli spazi contengono stringhe vuote
    if (areSpaces){
        return setMessageError("Non puoi lasciare spazi vuoti")
    } else if (password !== rewritePassword) { // se le password non coincidono
        setMessageError("Le password non coincidono!")
    }else {
        isSuccess() // esegui la funzione passata dal padre
    }
   

    /* RICHIESTA AL SERVER TRAMITE FECTH */
    fetch(urlFetch, {
        method: 'POST', // il metodo è post
        headers: {'Content-Type':'application/json'}, // gli dico quali dati sta ricevendo in questo caso json
        body: JSON.stringify({username: username, password: password}) // inserico i dati che voglio spedirgli in json trasformati in stringa da stringify
    })
    .then(reply => reply.json()) // ricevo la risposta dal server e converto i dati in json
    .then((dates) => {
        if (dates) { // se esistono i dati
            /* Controllo delle due password: */
            
        } else {
            setMessageError("Registrazione non riuscita")
        }
    }) 



  };

    return (
        <div className="page-wrapper">
            <div className="registration-card">
                <h1 className="title">REGISTRATION</h1>
                
                <form onSubmit={handleSubmit} className="registration-form">

                    <label htmlFor="username">{inputName}:</label>
                    <input id="username" name="username" type="text" placeholder="Write your username" required/>

                    <label htmlFor="password">{inputPassword}:</label>
                    <input id="password" name="password" type="password" placeholder="Write your password" required/>

                    <label htmlFor="passwordReconfirm">{inputPasswordReconfirm}:</label>
                    <input id="passwordReconfirm" name="passwordReconfirm" type="password" placeholder="Rewrite your password " required/>

                    <button type="submit" className="registration-btn">CREATE ACCOUNT</button>

                    <br />
                    <Message textColor="#d83924">{messageError}</Message>

                </form>
            </div>
        </div>
    )
}

export default Registration;