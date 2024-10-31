const { EmbedBuilder } = require('discord.js');

module.exports = (queue) => {

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: '没有歌让我唱拉 操!  <❌>'})
        .setColor('#2f3136');

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}