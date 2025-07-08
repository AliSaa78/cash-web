import {} from 'dotenv/config';
import User from '../model/userModel.js';
import  TransactionModel  from '../model/transactionModel.js';

const transController={

    transfer:async(req,res)=>{
    //const session= await mongoose.startSession();
    //session.startTransaction();
    try{
        const receiverUser=await User.findById(req.body.receiverId);
        const senderUser = await User.findById(req.user._id);
        if(!receiverUser || !senderUser){
            return res.status(400).send({message:"User not found"});
        }
        if(receiverUser._id.toString() === senderUser._id.toString()){
            return res.status(400).send({message:"You can not send yourself money"});
        };
        const amount = Number(req.body.amount);
         
        if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Please enter a valid amount." });
    }
        if(amount > senderUser.balance){
           return  res.status(400).send("There is no enough money in your budget");
        }
       senderUser.balance-=amount;
       receiverUser.balance+=amount;
      await senderUser.save(/*{session}*/);
      await receiverUser.save(/*{session}*/);

     await TransactionModel.create({
       sender:senderUser._id,
       receiver:receiverUser._id,
       amount,
       status: "success",
       type:'transfer'
     },);
     //await session.commitTransaction();
     //await session.endSession();
     res.status(200).send(`Money sent succefully from ${senderUser.name} to ${receiverUser.name}`);
    }catch(err){
        //await session.abortTransaction();
        //await session.endSession();
        console.log(err);
        res.status(500).send("Server error");
    }
},
transactions:async(req,res)=>{
  try{
    const filter={
  $or: [
    { sender: req.user._id },
    { receiver: req.user._id }
  ]
};
   const totalCount=await TransactionModel.countDocuments(filter).exec();
    const transactions = await TransactionModel
      .find(filter)
      .skip(req.pagination.skip)
      .limit(req.pagination.limit)
      .populate('sender receiver', 'name email');
   if(transactions.length === 0){
    return res.status(400).send("There is no transactions here");
   }
  
   res.status(200).json({ 
    total:totalCount,
    page:req.pagination.page,
    hasNextPage:req.pagination.page * req.pagination.limit < totalCount ? true:false,
    hasPreviousPage: req.pagination.skip>0 ? true:false,
    perPage:req.pagination.limit,
    nextPage:(req.pagination.page * req.pagination.limit) < totalCount ? req.pagination.page + 1 : null,
    previousPage:req.pagination.page>1 ? req.pagination.page - 1 : null ,
    transactions
  });
  }
  catch(err){
    console.log(err);
    res.status(500).send("server error");
  }

},
sendingTransactions:async(req,res)=>{
    try{
        const filter={
            sender:req.user._id
        }
        const totalCount=await TransactionModel.countDocuments(filter).exec();
    const sendTransactions = await TransactionModel.find(filter)
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .populate('sender receiver', 'name email');
if(sendTransactions.length === 0){
    return res.status(400).send("There is no transactions here");
   }  
   res.status(200).json({
     total:totalCount,
    page:req.pagination.page,
    hasNextPage:req.pagination.page * req.pagination.limit < totalCount ? true:false,
    hasPreviousPage: req.pagination.skip>0 ? true:false,
    perPage:req.pagination.limit,
    nextPage:(req.pagination.page * req.pagination.limit) < totalCount ? req.pagination.page + 1 : null,
    previousPage:req.pagination.page>1 ? req.pagination.page - 1 : null ,
    sendTransactions
   });
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }

},
receivingTransactions:async(req,res)=>{
    try{
     const filter={
            receiver:req.user._id
        }
    const totalCount=await TransactionModel.countDocuments(filter).exec();
    const receiveTransactions = await TransactionModel.find(filter)
    .skip(req.pagination.skip)
    .limit(req.pagination.limit)
    .populate('sender receiver', 'name email');
if(receiveTransactions.length === 0){
    return res.status(400).send("There is no transactions here");
   }  
   res.status(200).json({
     total:totalCount,
    page:req.pagination.page,
    hasNextPage:req.pagination.page * req.pagination.limit < totalCount ? true:false,
    hasPreviousPage: req.pagination.skip>0 ? true:false,
    perPage:req.pagination.limit,
    nextPage:(req.pagination.page * req.pagination.limit) < totalCount ? req.pagination.page + 1 : null,
    previousPage:req.pagination.page>1 ? req.pagination.page - 1 : null ,
    receiveTransactions
   });
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }

},
withdraw:async(req,res)=>{
    //const session= await mongoose.startSession();
    //session.startTransaction();
  try{
    let todayStart= new Date();
    todayStart.setHours(0,0,0,0);
    let tomorrowStart =new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate()+1)
    const withdrawLimit= await TransactionModel.find({
      type:'withdraw',
      receiver: req.user._id,
      sender:req.user._id,
      status:'success',
      createdAt: { $gte: todayStart, $lt: tomorrowStart }
    });
    if(withdrawLimit.length>=3){
      return res.status(403).json('You have reached your limit of daily withdrawal');
    }
    const user=await User.findById(req.user._id);
    const amount = Number(req.body.amount);
    if(amount <= 0 || amount > user.balance){
        return res.status(400).json({ message: "Please enter a valid amount." });
    }
    user.balance -= amount;
    await user.save({/*session*/});
    await TransactionModel.create({
       sender:user._id,
       receiver:user._id,
       status: "success",
       amount,
       type:'withdraw'
     },/*{session}*/);
     //await session.commitTransaction();
     //await session.endSession();
   res.status(200).json(`You Withdrawaled ${amount} from your account`);
  }catch(err){
    //await session.abortTransaction();
    //await session.endSession();
    console.log(err);
    res.status(500).json(err);
  }

},
deposit:async(req,res)=>{
  try{
    const user = await User.findById(req.user._id);
    const amount = Number(req.body.amount);
    if(!amount || amount<=0){
      return res.status(400).json({message:"enter a valid amount"});
    }
    user.balance +=amount;
    await user.save();
    await TransactionModel.create({
       sender:user._id,
       receiver:user._id,
       status: "success deposit",
       amount
     });
     res.status(200).json(
      {
  message: "Deposit successful",
  amount ,
  newBalance: user.balance
}      )
  }catch(err){
    console.log(err);
    res.status(500).json(err);
  }
}

};

export default transController;