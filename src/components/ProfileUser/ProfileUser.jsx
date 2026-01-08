const ProfileUser = ({
    user = "G", display, position
})=> {

    return(
        <div style={{
            display: display, position: position,
            width: "width", height: "height", border: "none", borderRadius: "50%"
        }}>
            {user}
        </div>
    )
}

export default ProfileUser 