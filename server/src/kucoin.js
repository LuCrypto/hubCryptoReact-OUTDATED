const { roundMe } = require('./utilitaire.js');

// Kucoin
class KucoinClass {
    constructor() {
        const _config = {
            apiKey: '619aba9457fddc0001b57956',
            secretKey: '50518f25-c728-44ca-b796-6bc22a2154b8',
            passphrase: 'jeSuisUnePhrase07',
            environment: 'live'
        }

        this.kucoinApi = require('kucoin-node-api')
        this.kucoinApi.init(_config)
        this.prefix = '===Kucoin | '
    }

    // Get fiat price currencies
    // Take an array of string crypto currencies and return an array of object with the price in USD
    getFiatCurrencies = async (arrayCurrencies) => {
        let params = {
            base: 'USD',
            currencies: arrayCurrencies
        }

        try {
            let r = await this.kucoinApi.getFiatPrice(params)
            // console.log(r.data)
            return r.data
        }
        catch (error) {
            console.log(error)
            return -1
        }
    }

    // Get all my balances in my account
    getBalanceAccounts = async () => {
        let arrayWalletUserMain = []
        let arrayWalletUserTrade = []

        try {
            let r = await this.kucoinApi.getAccounts()

            r.data.map((element) => {
                if (element.balance != 0) {
                    if (element.type == 'main')
                        arrayWalletUserMain.push({
                            asset: element.currency,
                            amount: element.balance,
                            type: element.type
                        })
                    else
                        arrayWalletUserTrade.push({
                            asset: element.currency,
                            amount: element.balance,
                            type: element.type
                        })
                }
            })

            return { arrayWalletUserMain, arrayWalletUserTrade }
        } catch (error) {
            console.log(error)
            return -1
        }
    }

    // Get wallet balance of kucoin with fiat price of each crypto currency
    kucoinWallet = async () => {
        let arrayFinal = []
        const { arrayWalletUserMain, arrayWalletUserTrade } = await this.getBalanceAccounts()
        if (arrayWalletUserMain == -1)
            return -1
        const arrayWalletUserMainFiat = await this.getFiatCurrencies(arrayWalletUserMain.map((element) => {
            return element.asset
        }))
        if (arrayWalletUserMainFiat == -1)
            return -1

        let somme = 0
        arrayWalletUserMain.map((element) => {
            let result = roundMe(arrayWalletUserMainFiat[element.asset] * element.amount, 2)
            arrayFinal.push({
                asset: element.asset,
                amount: element.amount,
                type: element.type,
                price: arrayWalletUserMainFiat[element.asset],
                total: result
            })

            somme += result
        })

        const arrayWalletUserTradeFiat = await this.getFiatCurrencies(arrayWalletUserTrade.map((element) => {
            return element.asset
        }))
        if (arrayWalletUserTradeFiat == -1)
            return -1

        arrayWalletUserTrade.map((element) => {
            let result = roundMe(arrayWalletUserTradeFiat[element.asset] * element.amount, 2)
            arrayFinal.push({
                asset: element.asset,
                amount: element.amount,
                type: element.type,
                price: arrayWalletUserTradeFiat[element.asset],
                total: result
            })

            somme += result
        })

        // console.log('arrayFinal : ', arrayFinal)
        console.log(this.prefix + 'Somme finale : ', somme)

        return roundMe(somme, 2)
    }
}

module.exports = KucoinClass;