import mongoose from 'mongoose';



interface PaymentsAttrs{
   orderId:string;
   stripeId:string;
}

interface PaymentsDoc extends mongoose.Document {
   orderId:string;
   stripId:string;
   version:number
}

interface PaymentModel extends mongoose.Model<PaymentsDoc>{
   build(attrs:PaymentsAttrs):PaymentsDoc;
}


const paymentSchema = new mongoose.Schema({
    orderId:{
        required:true,
        type:String
    },

    stripeId:{
        required:true,
        type:String
    }
},{
    toJSON:{
        transform(doc,ret){
          ret.id = ret.id;
          delete ret._id;
        }
    }
});

paymentSchema.statics.build = (attrs:PaymentsAttrs) =>{
   return new Payment(attrs);
};

const Payment = mongoose.model<PaymentsDoc,PaymentModel>('Payment',paymentSchema);

export {Payment};