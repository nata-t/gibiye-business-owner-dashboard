export class SearchDropDownOptionsService {
    getSearchDropDownOptions() {
        return fetch('/demo/data/search-dropdown-options.json', { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }
}
