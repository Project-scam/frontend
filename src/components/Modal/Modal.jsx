import Btn from "../Btn/Btn";

const Modal = ({
    children,
    title="Inserisci Titolo",
    subtitle="sottotitolo",
    onClose,
    onX,
    onOk,
    onCancel,
    backgroundModal = "white"
}) => {

  const styleModal = { // Mappo lo Stile per la finestra Modale
    modalContainer: { 
        position: "fixed", top:0, left:0, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", background:" rgba(0,0,0,0.5)"
    },
    windowsModal: {
        borderRadius: "8px", backgroundColor: backgroundModal, padding: "1.5rem", width: "30rem"
    },
    modalHeader: {
        display: "flex", justifyContent: "flex-end", fontSize: "30px", fontWeight: 500
    },
    modalContent: {
        padding: "8px"
    },
    modalFooter: {
        display: "flex", justifyContent: "flex-end", gap: "8px"
    }

  }

  return(
    <div style={styleModal.modalContainer} onClick={()=>onClose() }>

        <div style={styleModal.windowsModal}>
            <div style={styleModal.modalHeader}>
                <Btn variant="bubbleGrey" onClick={()=> onX()}>&times;</Btn> {/* "&times;" -> sarebbe la nostra "x" solo piu strecciata */}
            </div>
            <div style={styleModal.modalContent}>
                <h1>{title}</h1>
                <h3>{subtitle}</h3>
                {children}
            </div>
            <div style={styleModal.modalFooter}>
                {onOk && (<Btn variant="bubbleGreen" className="modal-confirm" onClick={()=> onOk()}>Conferma</Btn>)}
                {onCancel &&(<Btn variant="bubbleRed" className="modal-cancel" onClick={()=> onCancel()} >Annulla </Btn>)}
                {onClose &&(<Btn variant="bubbleGrey" className="modal-cancel" onClick={()=> onClose()} >Chiudi </Btn>)}
            </div>
        </div>
    </div>
  ) 
}

export default Modal;