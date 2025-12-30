import Btn from "../Btn/Btn"

const Modal = ({
    children,
    title= "Inserisci Titolo",
    classNameTitle,
    subtitle,
    onClose,
    onX,
    onConfirm,
    onCancel,
    backgroundModal= "white",
    maxHeight,
    textAlign= "left",
    textColor= "white"
}) => {

  const styleModal = { // Mappo lo Stile per la finestra Modale
    modalContainer: { 
        position: "fixed", top:0, left:0, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", background:" rgba(0,0,0,0.5)", 
        fontFamily: "Orbitron, monospace", textAlign: textAlign, zIndex: "999"
    },
    windowsModal: {
        borderRadius: "8px", backgroundColor: backgroundModal, padding: "1.5rem", 
        width: "30rem", maxHeight: maxHeight, overflow: "auto", overflowX: "hidden"
    },
    modalHeader: {
        display: "flex", justifyContent: "flex-end", fontSize: "30px", fontWeight: 500
    },
    modalContent: {
        display: "flex", padding: "8px", flexDirection: "column", justifyContent: "start",
         color: textColor
        
    },
    modalFooter: {
        display: "flex", justifyContent: "flex-end", gap: "8px"
    }

  }

  return(
    <div style={styleModal.modalContainer} onClick={(event)=>{
         if (event.target === event.currentTarget && onClose) { // controlla se clicco effettivamente fuori dalla modal
        onClose();
        }
    } }>

        <div style={styleModal.windowsModal}>
            <div style={styleModal.modalHeader}>
                {onX && <Btn variant="bubbleGrey" onClick={()=> onX()}>&times;</Btn>} {/* "&times;" -> sarebbe la nostra "x" solo piu strecciata */}
            </div>
            <div style={styleModal.modalContent}>
                <h1 className={classNameTitle}>{title}</h1>
                {subtitle && (<h3>{subtitle}</h3>)}
                {children}
            </div>
            <div style={styleModal.modalFooter}>
                {onConfirm && (<Btn variant="bubbleGreen" className="modal-confirm" onClick={()=> onConfirm()}>Conferma</Btn>)}
                {onCancel &&(<Btn variant="bubbleRed" className="modal-cancel" onClick={()=> onCancel()} >Annulla </Btn>)}
                {onClose &&(<Btn variant="bubbleGrey" className="modal-cancel" onClick={()=> onClose()} >Chiudi </Btn>)}
            </div>
        </div>
    </div>
  ) 
}

export default Modal