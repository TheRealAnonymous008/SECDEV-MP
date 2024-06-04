import jwtDecode from "jwt-decode";

interface token {
    exp: number,
    iat: number,
    id: string,
    iss: string,
    role: string
}

export const isRole = (x : string) => {
    return false;
}