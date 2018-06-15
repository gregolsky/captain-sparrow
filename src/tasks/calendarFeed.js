class CreateCalendarFeed {

    constructor(episodesProvider, episodesExporter) {
        this.episodesProvider = episodesProvider;
        this.episodesExporter = episodesExporter;
    }

    async execute() {
        const episodes = await this.episodesProvider.getEpisodes();
        await this.episodesExporter.export(episodes);
        if (this.onEnd) {
            this.onEnd();
        }
    }

    onTaskEnd(fun) {
        this.onEnd = fun;
    }
}

module.exports = CreateCalendarFeed;
