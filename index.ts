import  erc721 from './erc721.json';
import  erc1155 from './erc1155.json';

import {providers, Contract} from 'ethers';
import dotenv from 'dotenv';
import axios from 'axios';
import {ipfsGW} from './ipfs';

dotenv.config();

const loadMetadata = (tokenUri: string) => {

}

const main = async (type: "721"|"1155", addr: string, tokenId: string) => {

  const provider = new providers.JsonRpcProvider(process.env.RPC as string, "any");
//  const bal = await provider.getBalance("0x70631b7376f4956185DaC1B9cb4E9F83CcBC2764")
  const abi = type === "1155" ? erc1155 : erc721;

  const nftContract = new Contract(addr, abi, provider);
  let tokenUri;
  if (type === "721") {
    tokenUri = await nftContract.tokenURI(tokenId);
  } else {
    tokenUri = await nftContract.uri(tokenId) as string;
    if (tokenUri.includes("{id}")) {
      tokenUri = tokenUri.replace("{id}", tokenId);
    }
  }

  console.log("tokenUri", tokenUri);
  const gatewayUrl = ipfsGW(tokenUri);

  console.log("getting data from", gatewayUrl);
  try {
    const res = await axios.get(gatewayUrl);
    console.log("metadata", JSON.stringify(res.data, null, 2));

  } catch(e: any) {
    console.log("failed getting metadata.", e.message);
  }
} 

(async () =>  {
  const erc = process.argv[2] as "721"|"1155";
  const addr = process.argv[3];
  const tokenId = process.argv[4];
  await main(erc, addr, tokenId)
})();