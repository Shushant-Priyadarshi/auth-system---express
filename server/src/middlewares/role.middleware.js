import { ApiResponse } from "../utils/ApiResponse";

export const authorizeRole = (...allowedRoles) =>{
    return (req,_,next) =>{
        if(!allowedRoles.includes(req.user.role)){
            return new ApiResponse(200,_,"Access Denied");
        }
        next();
    }
   
}

/*
 when applying this middleware pass it like :
 authorizeRole("admin","user")
*/