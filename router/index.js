const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../Model/user_schema");
const Wallet = require("../Model/wallet_schema");
const Passbook = require("../Model/passbook_schema");

//manual transaction
router.post("/register", async (req, res) => {
  const session = await mongoose.startSession();
  const transactionoption = {
    readPreference: "primary",
    readConcern: { level: "majority" },
    writeConcern: { w: "majority" },
  };
  session.startTransaction(transactionoption);
  try {
    const user = await User.create([req.body], { session });
    // console.log(user1);

    const wallet = await Wallet.create(
      [{ nBalanace: 500, iUserId: user[0]._id }],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return res
      .status(200)
      .send({ message: "Sucessfully registerd", user, wallet });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({ error: error.message });
  }
});

//automatic transaction

// router.post('/register',async(req,res)=>{
//     const session = await mongoose.startSession();

//     try {
//         await session.withTransaction(async()=>{
//             const user=await User.create([req.body],{session})
//             const wallet=await Wallet.create([{nBalanace:0,user:user[0]._id}],{session})

//             return res.status(200).send({message:"Sucessfully registerd",user,wallet})
//         })
//     } catch (error) {
//         return res.status(500).send({error:error.message})
//     }
// })

//manual transaction
router.post("/transaction1", async (req, res) => {
  const session = await mongoose.startSession();
  const transactionoption = {
    readPreference: "primary",
    readConcern: { level: "majority" },
    writeConcern: { w: "majority" },
  };
  session.startTransaction(transactionoption);
  try {
    await Wallet.updateOne(
      { iUserId: req.body.iUserId },
      { $inc: { nBalanace: -100 } },
      { session }
    );

    await Wallet.updateOne(
      { iUserId: req.body.reciverId },
      { $inc: { nBalanace: 100 } },
      { session }
    );
    const walletdata = await Wallet.findOne({ iUserId: req.body.iUserId });
  
    await Passbook.create([
      {
        iUserId: req.body.iUserId,
        iTransactionId: req.body.walletId,
        imoneyrecieverId: req.body.recieverId,
        nBalanace: walletdata.nBalanace,
      },
    ]);
    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({ message: "Transaction Sucessfull" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({ error: error.message });
  }
});

// automatic transaction
router.post("/transaction2", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await Wallet.updateOne(
        { iUserId: req.body.iUserId },
        { $inc: { nBalanace: -100 } },
        { session }
      );

      await Wallet.updateOne(
        { iUserId: req.body.reciverId },
        { $inc: { nBalanace: 100 } },
        { session }
      );

      return res.status(200).send({ message: "Transaction Sucessfull" });
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// create two session and try to update data in collection
router.post("/transaction3", async (req, res) => {
  const session1 = await mongoose.startSession();
  const session2 = await mongoose.startSession();
  const transactionoption = {
    readPreference: "primary",
    readConcern: { level: "majority" },
    writeConcern: { w: "majority" },
  };
  session1.startTransaction(transactionoption);
  session2.startTransaction(transactionoption);
  try {
    await Wallet.updateOne(
      { iUserId: req.body.iUserId },
      { $inc: { nBalanace: 100 } },
      { session: session1 }
    );

    await Wallet.updateOne(
      { iUserId: req.body.iUserId },
      { $inc: { nBalanace: 200 } },
      { session: session2 }
    );

    // await Passbook.create([{iUserId,iTransactionId:req.body.walletId,imoneyrecieverId:req.body.recieverId,nbalance:}])
    await session1.commitTransaction();
    await session2.commitTransaction();
    session1.endSession();
    session2.endSession();
    return res.status(200).send({ message: "Transaction Sucessfull" });
  } catch (error) {
    await session1.abortTransaction();
    await session2.abortTransaction();
    session1.endSession();
    session2.endSession();
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
