// Modal/Arrow/CurvedArrow.jsx
const CurvedArrow = ({
  justify,
  margin,
  color= "orange",  // arrow color
  direction, // arrow rotation (of the container)
  size= 120, // represents the width and height of the square (120 as default value)
  reverse= false, // boolean if passed to parent becomes "true"
  selectAngle
}) => {
  
  // PROPORTION TO CONNECT THE ARROW WITH THE BODY DIMENSIONS
  const baseSize= 120 // normal arrow dimensions values that also correspond to the default tip size
  const scale= size / baseSize // formula to use in the arrow tip when changing size to maintain the same proportions

  // PARAMETERS FOR ARROW ROTATION IN DEGREES
  const rotationMap = {
    right: "0deg",
    down: "90deg",
    left: "180deg",
    up: "270deg"
  }

  const angle = rotationMap[direction] || selectAngle || "0deg" // rotates based on the direction prop
  const container = {
    width: size,          // horizontal size depends on the passed size parameter
    height: size,         // vertical size depends on the passed size parameter
    position: "relative",
    transform: `rotate( ${angle} )`       
  };

  // curved part (a quarter circle with only one colored border)
  const curve = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",                 // circle
    border: "20px solid transparent",     // all transparent
    borderLeftColor: "transparent",            // only the left border visible
    borderBottomColor: color,          // and the bottom border -> creates the curve
    transform: `rotate(${reverse ? -45 : 45}deg)`,          // rotate it a bit to give movement
    boxSizing: "border-box",
  };

  // arrow tip
  const head = {
    position: "absolute",
    left: reverse ? 30 * scale : 60 * scale, // reposition the tip with the size variation given by scale
    bottom: -10 * scale, // reposition the tip with the size variation given by scale
    width: 0,
    height: 0,
    borderTop: `${20 * scale}px solid transparent`,
    borderBottom: `${20* scale}px solid transparent`,
    borderLeft: reverse ? `0` :`${30 * scale}px solid ${color}`, // showing it we see the shape of a triangle to the right
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
