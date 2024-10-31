const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: "search",
    description: "Search a song",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('你想找什么歌呀 宝贝'),
            type: ApplicationCommandOptionType.String,
            requried: true,
        }
    ],

    async execute({ client, inter }) {
        const player = useMainPlayer();
        const song = inter.options.getString('song');

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        
    }
}