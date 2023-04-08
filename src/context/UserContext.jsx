import { AuthContext } from "../AuthContext";
import { useContext } from "react";

const { user } = useContext(AuthContext);

export default user;
