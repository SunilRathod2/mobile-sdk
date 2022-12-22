// import * as gariSdk from "gari";

// const gariClientId = "d8817deb-dceb-40a4-a890-21f0286c8fba";
// const gariSecretKey = "1e02b6da-3681-4a09-b271-f559ed23d0cc";

// export default async function handler(req, res) {
//   const partialSignedEncodedTransaction =
//     req.body.partialSignedEncodedTransaction;
//   const token = req.headers.token;
  
//   gariSdk.sdkInitialize(gariClientId, gariSecretKey);
//   const transactionResponse = await gariSdk.initiateTransaction(
//     partialSignedEncodedTransaction,
//     token,
//     gariClientId
//   );

//   res.json(transactionResponse);
// }