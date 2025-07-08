import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema({
sender: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
receiver: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
amount:{
    type:Number,
    required:true
},
status:{
    type:String,
    required:true,
     enum: ['success', 'failed'] 
},
type:{
  type:String,
  required:true,
  enum:['transfer','withdraw','deposit','sending money','receiving money']
}

},
{timestamps: true});

export default mongoose.model("Transaction",TransactionSchema);