export const catchAsyncErrors=(thefunction)=>{
    return (err,req,res,next)=>{
       Promise.resolve(thefunction(req,res,next)).catch(next);
    }
}