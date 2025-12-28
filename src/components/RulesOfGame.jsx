import CurvedArrow from "./Modal/Arrow/CurvedArrow"
import Modal from "./Modal/Modal"
import JustifySection from "./Modal/ModalSection/JustifySection"
import ModalSection from "./Modal/ModalSection/ModalSection"

const RulesOfGame = ({
    title="Rules of Game", 
    classNameTitle="title", 
    onClose = ()=> {},
    maxHeight = "80vh"
})=> {
    return(
<Modal
    title= {title}
    classNameTitle= {classNameTitle}
    onClose= {onClose}
    maxHeight= {maxHeight}
>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <ModalSection  colorText="red">
        <p style={{ textDecoration: "underline" }}>Modalità SinglePlayer:</p>
      </ModalSection>

      <ModalSection>
        <p>
          Il sistema genera un codice a 4 cifre: indovinalo prima che la bomba
          scoppi.
        </p>
      </ModalSection>

      <ModalSection>
        <img src="src/assets/modalità_normale.png" alt="img modalità normale" width={300}/>
     </ModalSection>

      <CurvedArrow direction="up" size={120} reverse margin={"-45px 25px 0 0"} justify={"flex-end"}/>
      
      <ModalSection align="flex-end" marginBlockStart={"-20px"}>
        <p>
          Hai solo 10 tentativi e il codice nascosto può contenere colori
          ripetuti.
        </p>
      </ModalSection>

      <ModalSection align="flex-end">
          <img  src="src/assets/tentativi.png" alt="img modalità normale" width={300}/>
      </ModalSection>

      <CurvedArrow direction="down" margin={"-40px 0 0 15px"} />
    
      <ModalSection marginBlockStart={"-20"}>
        <p style={{ color: "blue" }}>
          A ogni turno scegli 4 pedine colorate e le disponi in fila, nell’
          ordine che ti sembra giusto. Conferma la combinazione per ricevere
         il feedback del sistema.
        </p>
      </ModalSection>

      <ModalSection>
        <img src="src/assets/colori.png" alt="img scelta dei colori" width={300}/>
      </ModalSection>
    
      <CurvedArrow direction="up" reverse margin={"-45px 25px 0 0"} justify={"flex-end"}/>
    
      <ModalSection align="flex-end" marginBlockStart={"-20px"}>
              Dopo la conferma, compaiono i segnalini di risposta affianco:
      </ModalSection>
      
      <CurvedArrow direction={"down"} margin={"-40px 0 0 25px"}  />

      <ModalSection width={"100%"} marginBlockStart={"-20px"}>
        <JustifySection>
          <p>1. Un segnalino nero indica un colore giusto nel posto giusto.</p>
          <img src="src/assets/peg_nero.png" alt="img con il peg nero" width={100} height={20}/>
        </JustifySection>
      </ModalSection>
            
      <ModalSection width={"100%"} marginBlockStart={"10px"} marginBlockEnd={"-40px"}>
        <JustifySection>
          <p>
             2. Un segnalino bianco indica un colore presente nel codice, ma
             in posizione diversa.
          </p>
          <img style={{marginBlockStart: "10px"}} src="src/assets/peg_bianco.png" alt="img con il peg bianco" width={100} height={20}/>
         </JustifySection>
      </ModalSection>
          
      <CurvedArrow  selectAngle={"-30deg"} reverse justify={"flex-end"} margin={"20px -10px 0 0"}/>  

      <ModalSection align="center" marginBlockStart={"-50px"}>
        <p style={{textAlign: "center"}}>
          PS: L’ordine dei segnalini non corrisponde alla posizione delle
          pedine: ti dice solo quanti sono giusti, non quali.
        </p>
      </ModalSection>
       
      <CurvedArrow selectAngle={"70deg"} margin={"-60px 0 0 0"} />
     
      <ModalSection align="flex-start">
            <p>
              Se dopo il 10º tentativo non hai ancora trovato la combinazione
              corretta, la partita termina e il codice segreto viene rivelato.
            </p>
      </ModalSection>

      <ModalSection>
          <img src="src/assets/winner.png" alt="immagine di vittoria" width={300} />
      </ModalSection>
    </div>
  </Modal>
)}

export default RulesOfGame