import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SolanaWallet } from "@web3auth/solana-provider";
// import * as gari from "gari";
// import axios from "axios";
import styles from "../styles/Home.module.css";
import {
  InvokeMethodEventNames,
  TriggerInvokeMethodsEvent,
} from "../utils/invokeMethod.helper";

export default function Home() {
  //const [clientId, setClientId] = useState("");
  // const [token, setToken] = useState("");
  // const location = useLocation();
  const parsedToken = async () => {
    try {
      const search = window.location.search;

      const params = new URLSearchParams(search);
      const tokenparams = params.get("token");
      let config = {
        //gariClientId: "",
        secretKey: "",
        GARI_URL: "",
        CLIENT_ID:
          "BAGatRxirFvKTvUNeB_urIsfZsXUEh-JUcWSi432p_5pewX_0wEvYuGQBe1IjKI35lyrqTV5qDgFznmj6N7fdvY", // for pubg-india  // it can also change
        RPCTARGET: "https://api.devnet.solana.com/",
        BLOCKEXPLORER: "https://explorer.solana.com/?cluster=devnet",
        TICKER: "SOL",
        CHAIN_ID: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
        TICKERNAME: "Solana Token",
        NETWORK: "testnet",
        NAME: "Demo React POC",
        VERIFIER_NAME: "pubg-game-verifier", // will be given
        // VERIFIER_DOMAIN: "https://demo-gari-sdk.vercel.app/", // token verifier domain will be provided by that client
        VERIFIER_DOMAIN: "https://get-wallet-webview.vercel.app/", // token verifier domain will be provided by that client
        // VERIFIER_DOMAIN: "http://localhost:3000/", // token verifier domain will be provided by that client
      };
      // setToken(tokenparams);
      // setConfig(config);

      if (tokenparams) {
        let { publicKey, privateKey } = await initialize(tokenparams, config);
        TriggerInvokeMethodsEvent({
          publicKey,
          privateKey,
        });
      } else {
        alert("token is necessary ");
      }
    } catch (error) {
      alert("error " + error.message);
    }
  };

  async function initialize(token, config) {
    console.log("token ", token);
    console.log("config ", config);
    const {
      RPCTARGET,
      BLOCKEXPLORER,
      TICKER,
      TICKERNAME,
      CLIENT_ID,
      CHAIN_ID,
      NETWORK,
      NAME,
      VERIFIER_DOMAIN,
      VERIFIER_NAME,
    } = config;
    // get clientid from https://dashboard.web3auth.io

    try {
      const web3auth = new Web3AuthCore({
        clientId: CLIENT_ID,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: CHAIN_ID,
          rpcTarget: RPCTARGET,
          blockExplorer: BLOCKEXPLORER,
          ticker: TICKER,
          tickerName: TICKERNAME,
        },
      });

      const adapter = new OpenloginAdapter({
        adapterSettings: {
          network: NETWORK,
          loginConfig: {
            jwt: {
              // take this from config
              name: NAME,
              verifier: VERIFIER_NAME,
              typeOfLogin: "jwt",
              clientId: CLIENT_ID,
            },
          },
        },
      });
      web3auth.configureAdapter(adapter);
      await web3auth.init();

      const provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: token,
          verifierIdField: "uid",
          // take this from config
          domain: VERIFIER_DOMAIN,
        },
      });

      // initialize solanwallet form web3auth package
      const solanaWallet = new SolanaWallet(provider);

      // here will get publickey of user
      const accounts = await solanaWallet.requestAccounts();
      let publicKey = accounts[0];

      // const connectionConfig = await solanaWallet.request({
      //     method: "solana_provider_config",
      //     params: [],
      // });

      // here will get balance of user
      // const connection = new Connection(connectionConfig.rpcTarget);
      // const balance = await connection.getBalance(new PublicKey(publicKey));

      // here will get privatekey of user
      let privateKey = await web3auth.provider.request({
        method: "solanaPrivateKey",
      });

      web3auth.clearCache();
      return { publicKey, privateKey };
    } catch (error) {
      console.error("Error Initialization ==> ", error);
      throw error;
    }
  }

  // only setting clientid and jwtToken
  useEffect(() => {
    parsedToken();
  }, []);

  // useEffect(() => {
  //   //console.log("jwt token in second useEffect ", token);
  //   // if (clientId) {
  //   //   gari.sdkInitialize(clientId);
  //   // }
  // }, [clientId]);
  // TriggerInvokeMethodsEvent(InvokeMethodEventNames.walletData, {
  //   data: resp,
  // });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h4>Mobile SDK</h4>
      {/* <button
        onClick={() => {
          web3AuthInitialize();
        }}
      >
        getKeyPair
      </button> */}
    </div>
  );
}
