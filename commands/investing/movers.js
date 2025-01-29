const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const yahooFinance = require('yahoo-finance2').default;

module.exports = {
    name: "movers",
    description: 'Show top gaining and losing stocks',


    async execute( {inter} ) {
        try {
            // List of major stocks to track
            const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'BAC', 'WMT'];
            const quotes = await Promise.all(
                symbols.map(async (symbol) => {
                    try {
                        const quote = await yahooFinance.quote(symbol);
                        return {
                            symbol: symbol,
                            change: quote.regularMarketChangePercent
                        };
                    } catch (error) {
                        console.error(`Error fetching data for ${symbol}:`, error);
                        return null;
                    }
                })
            );
            // Filter out null values (failed fetches) and sort the quotes
            const validQuotes = quotes.filter(q => q !== null);
            const gainers = [...validQuotes].sort((a, b) => b.change - a.change).slice(0, 5);
            const losers = [...validQuotes].sort((a, b) => a.change - b.change).slice(0, 5);

            const embed = new EmbedBuilder()
                .setTitle('Market Movers')
                .setColor('#0099ff')
                .addFields(
                    {
                        name: 'Top Gainers',
                        value: gainers.map(stock => 
                            `${stock.symbol}: ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%`
                        ).join('\n') || 'No data available'
                    },
                    {
                        name: 'Top Losers',
                        value: losers.map(stock => 
                            `${stock.symbol}: ${stock.change.toFixed(2)}%`
                        ).join('\n') || 'No data available'
                    }
                )
                .setTimestamp();

            return inter.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching stock data:', error);
            return inter.editReply('Failed to retrieve stock data. Please try again later.');
        }
    },

    options: []
};