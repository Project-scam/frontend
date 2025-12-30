import { useState } from "react";

const Btn = ({
  children,
  onClick,
  isPressed,
  onChange,
  width,
  variant= "default",
}) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);

  const baseDefault = {
    base: {
        marginTop: "16px", 
        padding: "10px", 
        borderRadius: "12px", 
        border: "none", 
        background: "linear-gradient(200deg, #3d3d3dff, #1b1b1bff)", 
        color: "white", 
        fontWeight: 600,
        cursor: "pointer"
    },
    hover: {  boxShadow: "0 5px 20px 0 rgba(67, 49, 40, 0.5)"},
    active: { boxShadow: "none", background: "linear-gradient(200deg, #212121ff, #000000ff)" },
    focus: { outline: "none", boxShadow: "0 3px 0  rgba(0,0,0,0.5)" },
  };


  const variants= {
    default: {}, 
    simple: { 
        base: { margin: 0, padding: "2px", borderRadius: "2px", background: "rgb(15, 15, 35)" , backgroundColor: "transparent", boxShadow: "0 3px 0 0 rgb(255, 255, 255)" },
        hover: { color: "green", boxShadow: "0 3px 0 0 rgb(0, 145, 0)" },
        active: {color: "green"},
        focus: { boxShadow: "0 3px 0  rgba(0,145,0.5)", textDecoration: "none" }
    },  
    bubbleOrange: {
        base: {background: "linear-gradient(200deg, #fd8027, #cd4d0eff)" },
        hover: {  boxShadow: "0 5px 20px 0 rgba(234, 88, 12, 0.5)"},
        active: { boxShadow: "none", background: "linear-gradient(200deg, #d86f24, #744a0aff)" },
        focus: { boxShadow: "0 3px 0  rgba(255, 140, 0, 0.3)" },
    },
    bubbleGreen: {
        base: { background: "linear-gradient(200deg, #27fd27ff, #09c65eff)" },
        hover: {  boxShadow: "0 5px 20px 0 rgba(61, 113, 43, 0.5)"},
        active: { boxShadow: "none", background: "linear-gradient(200deg, #57d824ff, #1d740aff)" },
        focus: { boxShadow: "0 3px 0  rgba(94, 255, 0, 0.3)" },
    },
    bubbleRed: {
        base: { background: "linear-gradient(200deg, #fe3c3cff, #c22929ff)" },
        hover: {  boxShadow: "0 5px 20px 0 rgba(119, 32, 32, 0.5)"},
        active: { boxShadow: "none", background: "linear-gradient(200deg, #d82a24ff, #740a0aff)" },
        focus: { boxShadow: "0 3px 0  rgba(255, 0, 0, 0.3)" },
    },
    bubbleBlue: {
        base: { background: "linear-gradient(200deg, #2743fdff, #2034beff)" },
        hover: {  boxShadow: "0 5px 20px 0 rgba(41, 56, 100, 0.5)"},
        active: { boxShadow: "none", background: "linear-gradient(200deg, #2442d8ff, #0a3474ff)" },
        focus: { boxShadow: "0 3px 0  rgba(0, 60, 255, 0.3)" },
    },
    bubbleGrey: {
        base: {  background: "linear-gradient(200deg, #919294ff, #74778eff)" },
        hover: {  boxShadow: "0 5px 20px 0 rgba(69, 70, 74, 0.5)"},
        active: { boxShadow: "none", background: "linear-gradient(200deg, #707173ff, #74778eff)" },
        focus: { boxShadow: "0 3px 0  rgba(79, 80, 83, 0.41)" },
    },
  };

  // Funzione per unire gli stili (default + variante)  
  const mergeStyles= (variantKey) => {
    const variant= variants[variantKey] || {};
    return {
      base: { ...baseDefault.base, ...variant.base },
      hover: { ...baseDefault.hover, ...variant.hover },
      active: { ...baseDefault.active, ...variant.active },
      focus: { ...baseDefault.focus, ...variant.focus },
    };
  };

  const mergedStyle= mergeStyles(variant);


  const currentStyle= {
    ...mergedStyle.base,
    ...(hover ? mergedStyle.hover : {}),
    ...(active ? mergedStyle.active : {}),
    ...(focus ? mergedStyle.focus : {}),
  };

  return (
    <button
      onClick= {onClick}
      onMouseEnter= {() => setHover(true)}
      onMouseLeave= {() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      aria-pressed= {isPressed}
      onChange= {onChange}
      style= {{...currentStyle, width:width}}
    >
      {children}
    </button>
  );
};

export default Btn;