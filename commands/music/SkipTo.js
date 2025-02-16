const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'skipto',
    description:("跳至队列中的特定曲目"),
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('您要跳至的曲目的名称/网址'),
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'number',
            description:('歌曲在队列中的位置'),
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const track = inter.options.getString('song');
        const number = inter.options.getNumber('number')
        if (!track && !number) return inter.editReply({ content: await Translate(`You have to use one of the options to jump to a song <${inter.member}>... try again ? <❌>`) });

        let trackName;

        if (track) {
            const skipTo = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track)
            if (!skipTo) return inter.editReply({ content: await Translate(`Could not find <${track}> <${inter.member}>... try using the url or the full name of the song ? <❌>`) });

            trackName = skipTo.title;

            queue.node.skipTo(skipTo);
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index].title;
            if (!name) return inter.editReply({ content: await Translate(`This track does not seem to exist <${inter.member}>... try again ? <❌>`) });

            trackName = name;

            queue.node.skipTo(index);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Skipped to <${trackName}> <✅>`) })
            .setColor('#2f3136')

        inter.editReply({ embeds: [embed] });
    }
}