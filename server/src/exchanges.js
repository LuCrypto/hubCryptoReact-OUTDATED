const BinanceClass = require('./exchange/binance');
const KucoinClass = require('./exchange/kucoin');
const BybitClass = require('./exchange/bybit');
const { fs } = require('./utilitaire/utilitaire');

// Init data exchanges in json files
const initDataExchange = async () => {
    // EXCHANGE
    // ==================================

    // Update data exchanges
    const instanceBinance = new BinanceClass()
    const promesseBinance = instanceBinance.update()

    // const instanceKucoin = new KucoinClass()
    // const promesseKucoin = instanceKucoin.update()

    const totalBybit = new BybitClass()
    const promesseBybit = totalBybit.update()

    const arrayData = [promesseBinance, promesseBybit]
    return Promise.all(arrayData).then(async (values) => {
        return readDataExchange()
    })
}

// Read data exchanges in json files
const readDataExchange = () => {
    const arrayExchange = ['binance', 'bybit']

    const arrayData = arrayExchange.map(async (exchange) => {
        const json = JSON.parse(await fs.readFile(`./server/src/data/${exchange}.json`, 'utf8'));

        return {
            name: exchange,
            json: json
        }
    })

    return Promise.all(arrayData).then((values) => {
        // console.log('values', values)
        return values
    })
}

module.exports = {
    initDataExchange,
    readDataExchange
}