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
        .setAuthor({ name: await (`没人在频道，我走了 886 PEACE OUT!  <❌>`)})
        .setColor('#2f3136');

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}