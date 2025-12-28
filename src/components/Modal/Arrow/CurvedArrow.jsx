// Modal/Arrow/CurvedArrow.jsx
const CurvedArrow = ({
  justify,
  margin,
  color= "orange",  // colore della freccia
  direction, // rotazione della freccia (del contenitore)
  size= 120, // rappresenta la larghezza e l'altezzza del quadrato (120 come valore default)
  reverse= false, // booleano se passato al padre diventa "true"
  selectAngle
}) => {
  
  // PROPORZIONE PER COLLEGARE LA FRECCIA CON LE DIMENSIONI DEL CORPO
  const baseSize= 120 // valori normali dimensioni freccia che corrispondono anche alla grandezza della punta di default
  const scale= size / baseSize // formula da utilizzare nella punta della freccia alla modifica di size per tenere le stesse proporzioni

  // PARAMETRI PER LA ROTAZIONE DELLA FRECCIA IN GRADI 
  const rotationMap = {
    right: "0deg",
    down: "90deg",
    left: "180deg",
    up: "270deg"
  }

  const angle = rotationMap[direction] || selectAngle || "0deg" // rota in base alla prop direction
  const container = {
    width: size,          // grandezza orrizzontale dipende dal parametro size passato
    height: size,         // grandezza verticale dipende dal parametro size passato
    position: "relative",
    transform: `rotate( ${angle} )`       
  };

  // parte curva (un quarto di cerchio con solo un bordo colorato)
  const curve = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",                 // cerchio
    border: "20px solid transparent",     // tutti trasparenti
    borderLeftColor: "transparent",            // solo il bordo sinistro visibile
    borderBottomColor: color,          // e il bordo sotto -> crea la curva
    transform: `rotate(${reverse ? -45 : 45}deg)`,          // lo ruoto un po' per dare movimento
    boxSizing: "border-box",
  };

  // punta della freccia
  const head = {
    position: "absolute",
    left: reverse ? 30 * scale : 60 * scale, // riposiono la punta con la variazione di grandezza data da scale
    bottom: -10 * scale, // riposiono la punta con la variazione di grandezza data da scale
    width: 0,
    height: 0,
    borderTop: `${20 * scale}px solid transparent`,
    borderBottom: `${20* scale}px solid transparent`,
    borderLeft: reverse ? `0` :`${30 * scale}px solid ${color}`, // mostrandolo vediamo la forma di un triangolo verso destra
    borderRight: reverse ? `${30 * scale}px solid ${color}` : "0"
  };

  return (
    <div style={{display:"flex", justifyContent: justify, margin}}>
      <div style={container}>
        <div style={curve}></div>
        <div style={head}></div>
      </div>
    </div>
  );
};

export default CurvedArrow;
