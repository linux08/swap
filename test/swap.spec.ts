import { expect } from "chai";
import { ChainId, Token } from "@uniswap/sdk";
import { getAmountOut, getPath } from "../index";
import { COMP_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS } from "../constants";

const chainId = ChainId.MAINNET;
const compToken = new Token(chainId, COMP_TOKEN_ADDRESS, 18, "COMP", "Compound");
const usdcToken = new Token(chainId, USDC_TOKEN_ADDRESS, 6, "USDC", "USD Coin");

describe("getPath", () => {
  it("should return the correct path array", async function () {
    this.timeout(5000);
    let amountIn = 2000;
    const expectedPath = [
      usdcToken.address,
      // WETH[chainId].address,
      compToken.address,
    ];
    const path = await getPath(amountIn.toString());
    expect(path).to.deep.equal(expectedPath);
  });
});

describe("getAmountOut", () => {
  it("should return the correct amount of COMP given an input amount of USDC", async function () {
    this.timeout(5000);
    let amountIn = 2000;
    const amountOut = await getAmountOut(amountIn.toString());
    expect(amountOut).to.be.closeTo(35, 0.5); // check that the output is within 0.05 of the expected value
  });

  it("should return the same value for the same input token amount", async function () {
    this.timeout(5000);

    let amountIn = 2000;
    const amountOut1 = await getAmountOut(amountIn.toString());
    const amountOut2 = await getAmountOut(amountIn.toString());
    expect(amountOut1).eql(amountOut2);
  });
});
