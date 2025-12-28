// ModalSection.jsx
const ModalSection = ({ 
    align = "flex-start", 
    width = 300, 
    children,
    colorText = "blue",
    marginBlockStart,
    marginBlockEnd
})=> {

  return (
    <div style={{ 
        display: "flex", 
        justifyContent: align, 
        marginBlockStart: marginBlockStart,
        marginBlockEnd: marginBlockEnd
    }}>
      <div
        style={{
          display: "flex",
          width,
          flexDirection: "column",
          alignItems: align,
        }}
      >
        <div style={{ color: colorText }}>{children}</div>
      </div>
    </div>
  );
};

export default ModalSection