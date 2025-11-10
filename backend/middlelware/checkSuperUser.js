export const checkSuperUser = (req, res, next) =>{
    try {
        if(req.user.globalRole !== "super_admin"){  
            return res.status(401).json({ 
                message: "You are not authorise to access this route" 
            });
        }
    
        return next()
        
    } catch (error) {
        console.log("Error in checkSuperUser middleware:", error.message);
        res.status(500).json({ 
            message: "internal server error" 
        });
    }
}