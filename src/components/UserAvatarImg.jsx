import React from "react";

const UserAvatarImg = (props) => {
  return (
    <div className={`userImg ${props.lg===true && 'lg'}`}>
      <span className="rounded-circle">
        <img
          src={props.img}
          alt="profile-icon"
        />
      </span>
    </div>
  );
};

export default UserAvatarImg;
