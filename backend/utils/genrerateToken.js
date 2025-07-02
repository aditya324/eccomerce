// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  console.log("userid",userId)
  const idString = userId.toString();
  const token= jwt.sign({ id: idString }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  console.log(token)

  return token
};

export default generateToken;
