const Message = ({
children,
textColor="black", 
as = "p",
margin,
background,
fontSize = "12px",
fontWeight = "600"
}) => {
    const Tag = as
    return (
        <Tag style={{
            color:textColor, 
            margin: margin,
            background: background,
            fontSize: fontSize,
            fontWeight: fontWeight
        }}>{children}</Tag>
    )
}

export default Message;