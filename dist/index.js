"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = exports.getAmountOut = exports.provider = void 0;
var tslib_1 = require("tslib");
var sdk_1 = require("@uniswap/sdk");
var providers_1 = require("@ethersproject/providers");
var constants_1 = require("./constants");
var mainNetChainId = sdk_1.ChainId.MAINNET;
// define the tokens you want to swap between
var USDC = new sdk_1.Token(mainNetChainId, constants_1.USDC_TOKEN_ADDRESS, 6, "USDC", "USD Coin");
var COMP = new sdk_1.Token(mainNetChainId, constants_1.COMP_TOKEN_ADDRESS, 18, "COMP", "Compound");
// create a provider object for the Ethereum network you want to use
exports.provider = new providers_1.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/".concat(constants_1.INFRURA_PROJECT_ID));
// function to get the amount of COMP received for a given amount of USDC
function getAmountOut(amountIn) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var usdcCompPair, trade, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, sdk_1.Fetcher.fetchPairData(USDC, COMP, exports.provider)];
                case 1:
                    usdcCompPair = _a.sent();
                    return [4 /*yield*/, sdk_1.Trade.bestTradeExactIn([usdcCompPair], new sdk_1.TokenAmount(USDC, BigInt(amountIn)), COMP, {
                            maxNumResults: 1,
                            maxHops: 3,
                        })];
                case 2:
                    trade = _a.sent();
                    // return the amount of COMP received for the trade
                    return [2 /*return*/, parseFloat(trade[0].outputAmount.toExact()) * 1e6];
                case 3:
                    err_1 = _a.sent();
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getAmountOut = getAmountOut;
// function to get the optimal swap path for the trade
function getPath(amountIn) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var usdcCompPair, trade;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sdk_1.Fetcher.fetchPairData(USDC, COMP)];
                case 1:
                    usdcCompPair = _a.sent();
                    return [4 /*yield*/, sdk_1.Trade.bestTradeExactIn([usdcCompPair], new sdk_1.TokenAmount(USDC, BigInt(amountIn)), COMP, { maxNumResults: 1 })];
                case 2:
                    trade = (_a.sent())[0];
                    // return the route path as an array of token addresses
                    return [2 /*return*/, trade.route.path.map(function (token) { return token.address; })];
            }
        });
    });
}
exports.getPath = getPath;
