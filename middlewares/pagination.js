const pagination =  async(req,res,next)=>{
  try{
      const page=parseInt(req.query.page) || 1;
      const limit=parseInt(req.query.limit) || 10;

      const skip = (page-1)*limit;
      req.pagination={
        page,
        limit,
        skip
      }
    next();
  }catch(err){
  console.log(err);
  res.status(500).json("Server Error");
  }
};

export default pagination;