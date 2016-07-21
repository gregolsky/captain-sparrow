export default class CreateCalendarFeed {

    constructor (episodesProvider, episodesExporter) {
        this.episodesProvider = episodesProvider;
        this.episodesExporter = episodesExporter;
    }

    execute () {
        return this.episodesProvider.getEpisodes()
        .then((episodes) => this.episodesExporter.export(episodes))
        .then(() => {
            if (this.onEnd) {
                this.onEnd();
            }
        });
    }

    onTaskEnd (fun) {
        this.onEnd = fun;
    }
}
