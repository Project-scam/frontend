// components/Modal/ModalSection/JustifySection
const JustifySection = ({
    children,
    justify = "space-between",
    align = "center",
    gap = 20
})=> {
    return (
        <span style={{display: "flex", justifyContent: justify, alignItems: align, gap: gap, width:"100%"}}>
            {children}
        </span>
    )
}

export default JustifySection