import jwtDecode from "jwt-decode";

const isAdmin = (token) => {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    return (
      decodedToken['https://hasura.io/jwt/claims']?.["x-hasura-role"] === "admin"
    );
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

export { isAdmin };
