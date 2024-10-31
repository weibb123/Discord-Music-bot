const { EmbedBuilder } = require('discord.js');

module.exports = (queue) => {
    if (queue.metadata.lyricsThread) {
        queue.metadata.lyricsThread.delete();
        queue.setMetadata({
            channel: queue.metadata.channel
        });
    }

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await (`我退出频道了，别太想我! <❌>`)})
        .setColor('#2f3136');

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}