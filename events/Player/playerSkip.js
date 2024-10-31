const { EmbedBuilder } = require('discord.js');


module.exports = (queue, track) => {

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await (`跳过 <**${track.title}**> 有问题! <❌>`)})
        .setColor('#EE4B2B');

        queue.metadata.channel.send({ embeds: [embed], iconURL: track.thumbnail });
    })()
}