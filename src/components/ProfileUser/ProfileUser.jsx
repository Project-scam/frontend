const ProfileUser = ({
    user = "G", display ="flex", position, margin , justify= "center", align= "center",
    backgroundColor= "red", width="20px", height= "20px"
})=> {

    return(
        <div style={{
            display: display, position: position, margin: margin, justifyContent: justify,
            alignItems: align, backgroundColor: backgroundColor, width: width, 
            height: height, border: "none", borderRadius: "50%"
        }}>
            <strong>{user}</strong>
        </div>
    )
}

export default ProfileUser 