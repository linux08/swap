import { ethers } from 'ethers';
import { ChainId, Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType } from '@uniswap/sdk';
import { USDC_TOKEN_ADDRESS,INFRURA_PROJECT_ID, COMP_TOKEN_ADDRESS } from './constants';


export const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFRURA_PROJECT_ID}`);


const chainId = ChainId.MAINNET;
const usdcToken = new Token(chainId, USDC_TOKEN_ADDRESS, 6, 'USDC', 'USD Coin');
const compToken = new Token(chainId, COMP_TOKEN_ADDRESS, 18, 'COMP', 'Compound');


// Amount is $2000
async function getAmountOut(amount: number): Promise<TokenAmount<TradeType>> {
    const usdcAmount = new TokenAmount(usdcToken, BigInt(amount));
    const pair = await Fetcher.fetchPairData(usdcToken, compToken, provider);
    const route = new Route([pair], WETH[chainId]);
    const trade = new Trade(route, usdcAmount, TradeType.EXACT_INPUT);
    return trade.minimumAmountOut(new TokenAmount(compToken, '0'));
}

// Function to get the optimal swap path
function getPath(): string[] {
    const usdcAddress = usdcToken.address;
    const compAddress = compToken.address;
    return [usdcAddress, WETH[chainId].address, compAddress];
}

export { getAmountOut, getPath };
