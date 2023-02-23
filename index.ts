import { Token, ChainId, Trade, TokenAmount, Fetcher } from "@uniswap/sdk";

import { BaseProvider, JsonRpcProvider } from "@ethersproject/providers";
import { INFRURA_PROJECT_ID, USDC_TOKEN_ADDRESS, COMP_TOKEN_ADDRESS } from "./constants";

const mainNetChainId = ChainId.MAINNET;

// define the tokens you want to swap between
const USDC = new Token(mainNetChainId, USDC_TOKEN_ADDRESS, 6, "USDC", "USD Coin");

const COMP = new Token(mainNetChainId, COMP_TOKEN_ADDRESS, 18, "COMP", "Compound");

// create a provider object for the Ethereum network you want to use
const jsonprovider = new JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${INFRURA_PROJECT_ID}`
);

export const provider = jsonprovider as BaseProvider;

// function to get the amount of COMP received for a given amount of USDC
export async function getAmountOut(amountIn: string): Promise<number | Error> {
  try {
    // Fetch the pair instance for USDC-COMP
    const usdcCompPair = await Fetcher.fetchPairData(USDC, COMP, provider);
    // create a trade object to represent the swap
    const trade = await Trade.bestTradeExactIn(
      [usdcCompPair],
      new TokenAmount(USDC, BigInt(amountIn)),
      COMP,
      {
        maxNumResults: 1,
        maxHops: 3,
      }
    );
    // return the amount of COMP received for the trade
    return parseFloat(trade[0].outputAmount.toExact()) * 1e6;
  } catch (err: any) {
    throw err;
  }
}

// function to get the optimal swap path for the trade
export async function getPath(amountIn: string): Promise<string[]> {
  // Fetch the pair instance for USDC-COMP
  const usdcCompPair = await Fetcher.fetchPairData(USDC, COMP);
  // get the best trade route for the USDC -> COMP trade
  const [trade] = await Trade.bestTradeExactIn(
    [usdcCompPair],
    new TokenAmount(USDC, BigInt(amountIn)),
    COMP,
    { maxNumResults: 1 }
  );

  // return the route path as an array of token addresses
  return trade.route.path.map((token) => token.address);
}
