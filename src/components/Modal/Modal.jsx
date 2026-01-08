import Btn from "../Btn/Btn"

const Modal = ({
    children,
    title= "Please Enter Title",
    classNameTitle,
    subtitle,
    onClose,
    onX,
    onConfirm,
    onCancel,
    backgroundModal= "white",
    maxHeight,
    textAlign= "left",
    textColor= "white",
    textColorSubtitle= "black",
}) => {

  const styleModal = { // Map Style for the Modal window
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
         if (event.target === event.currentTarget && onClose) { // checks if I actually click outside the modal
        onClose();
        }
    } }>

        <div style={styleModal.windowsModal}>
            <div style={styleModal.modalHeader}>
                {onX && <Btn variant="bubbleGrey" onClick={()=> onX()}>&times;</Btn>} {/* "&times;" -> this would be our "x" just more stretched */}
            </div>
            <div style={styleModal.modalContent}>
                <h1 className={classNameTitle}>{title}</h1>
                {subtitle && (<h3 style={{ color: textColorSubtitle, marginBlockStart: "10px" }}>{subtitle}</h3>)}
                <p></p>
                {children}
            </div>
            <div style={styleModal.modalFooter}>
                {onConfirm && (<Btn variant="bubbleGreen" className="modal-confirm" onClick={()=> onConfirm()}>Ok</Btn>)}
                {onCancel &&(<Btn variant="bubbleRed" className="modal-cancel" onClick={()=> onCancel()} >Cancel </Btn>)}
                {onClose &&(<Btn variant="bubbleGrey" className="modal-cancel" onClick={()=> onClose()} >Close </Btn>)}
            </div>
        </div>
    </div>
  ) 
}

export default Modal