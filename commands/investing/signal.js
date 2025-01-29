const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const yahooFinance = require('yahoo-finance2').default;
const technicalIndicators = require('technicalindicators');

module.exports = {
    name: 'signal',
    description: 'Get trading signals for a specific stock',
    voiceChannel: false,

    async execute({ inter }) {
        let symbol;
        try {

            // Get the symbol from the interaction options
            symbol = inter.options.getString('symbol').toUpperCase();

            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(today.getMonth() - 6);

            const period1 = sixMonthsAgo.toISOString().split('T')[0];

            // Fetch historical data
            const historicalData = await yahooFinance.historical(symbol, {
                period1: period1,
                interval: '1d'
            });

            if (!historicalData.length) {
                return await inter.editReply(`No historical data found for ${symbol}.`);
            }

            const closePrices = historicalData.map(data => data.close).filter(price => price !== null);

            if (closePrices.length < 26) {
                return await inter.editReply(`Not enough data to calculate indicators for ${symbol}.`);
            }

            // Calculate RSI and MACD
            const rsi = technicalIndicators.RSI.calculate({ values: closePrices, period: 14 });
            const macd = technicalIndicators.MACD.calculate({
                values: closePrices,
                fastPeriod: 12,
                slowPeriod: 26,
                signalPeriod: 9
            });

            const lastRSI = rsi[rsi.length - 1];
            const lastMACD = macd[macd.length - 1];
            const prevMACD = macd[macd.length - 2] || { MACD: 0, signal: 0 }; // Handle undefined prevMACD

            // Determine signals
            const signals = [];
            if (lastRSI < 30) signals.push('RSI indicates oversold conditions');
            if (lastRSI > 70) signals.push('RSI indicates overbought conditions');
            if (lastMACD.MACD > lastMACD.signal && prevMACD.MACD <= prevMACD.signal) {
                signals.push('MACD bullish crossover detected');
            }

            // Create and send the embed
            const embed = new EmbedBuilder()
                .setTitle(`${symbol} Trading Signals`)
                .setColor('#0099ff')
                .addFields(
                    { name: 'Current RSI', value: lastRSI.toFixed(2).toString() },
                    { name: 'Signals', value: signals.join('\n') || 'No clear signals' }
                )
                .setTimestamp();

            return await inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Error analyzing ${symbol || 'unknown symbol'}:`, error);

            // Use inter.editReply() to send the error message
            return await inter.editReply({
                content: `Error analyzing ${symbol ? symbol : 'the symbol'}. Please check the symbol and try again.`,
                ephemeral: true // Optional: Makes the error message visible only to the user
            });
        }
    },

    options: [
        {
            name: 'symbol',
            description: 'The stock symbol to analyze',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
};