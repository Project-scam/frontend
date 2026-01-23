import React, { useMemo } from "react";

const COLORS = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#009688",
  "#4CAF50",
  "#FF9800",
  "#795548",
  "#607D8B",
];

function getColorFromName(name) {
  if (!name) return COLORS[0];
  const charCode = name.charCodeAt(0);
  return COLORS[charCode % COLORS.length];
}

const UserAvatar = ({ name = "", size = 40 }) => {
  const letter = name.charAt(0).toUpperCase();
  const bgColor = useMemo(() => getColorFromName(name), [name]);

  return (
    <div
      className="profile-avatar"
      style={{
        height: size,
        backgroundColor: bgColor,
      }}
    >
      <div
        className="avatar-circle"
        style={{
          width: size,
          height: size,
          fontSize: size / 2,
        }}
      >
        {letter}
      </div>

      <span className="avatar-name">{name}</span>
    </div>
  );
};

export default UserAvatar;
