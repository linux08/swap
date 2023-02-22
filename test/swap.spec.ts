import { expect } from 'chai';
import { ChainId, Token, WETH, Fetcher, Route, Trade, TokenAmount, TradeType } from '@uniswap/sdk';
import { getAmountOut, getPath, provider } from '../index';
import { COMP_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS } from '../constants';


const chainId = ChainId.MAINNET;
const compToken = new Token(chainId, COMP_TOKEN_ADDRESS, 18, 'COMP', 'Compound');
const usdcToken = new Token(chainId, USDC_TOKEN_ADDRESS, 6, 'USDC', 'USD Coin');


describe('getPath', () => {
    it('should return the correct path array', () => {
        const expectedPath = [usdcToken.address, WETH[chainId].address, compToken.address];
        const path = getPath();
        expect(path).to.deep.equal(expectedPath);
    });
});


describe('getAmountOut', () => {

    it('should return a TokenAmount', async function () {
        const result = await getAmountOut(1);
        expect(result.toExact()).to.not.eql('0');
        expect(result).instanceOf(TokenAmount)
    });

    it('should return the minimum token amount out for the given input token amount', async () => {
        const expectedAmountOut = new TokenAmount(compToken, '100');
        const amountOut = await getAmountOut(100);
        expect(amountOut.equalTo(expectedAmountOut)).to.be.true;
    });


    it('should throw an error when the input token amount is zero', async () => {
        const usdcAmount = new TokenAmount(usdcToken, '0');
        const pair = await Fetcher.fetchPairData(usdcToken, compToken, provider);
        const route = new Route([pair], WETH[chainId]);
        const trade = new Trade(route, usdcAmount, TradeType.EXACT_INPUT);
        await expect(trade.minimumAmountOut(new TokenAmount(compToken, '0'))).to.be.throw('INSUFFICIENT_INPUT_AMOUNT');
    });

    it('should return the same value for the same input token amount', async () => {
        const usdcAmount = new TokenAmount(usdcToken, '2000');
        const pair = await Fetcher.fetchPairData(usdcToken, compToken, provider);
        const route = new Route([pair], WETH[chainId]);
        const trade1 = new Trade(route, usdcAmount, TradeType.EXACT_INPUT);
        const amountOut1 = await trade1.minimumAmountOut(new TokenAmount(compToken, '0'));
        const trade2 = new Trade(route, usdcAmount, TradeType.EXACT_INPUT);
        const amountOut2 = await trade2.minimumAmountOut(new TokenAmount(compToken, '0'));
        expect(amountOut1.equalTo(amountOut2)).to.be.true;
    });
});
