export class TopWinningsService {
    getTopWinnings() {
        return fetch('/demo/data/top-winnings.json', { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }
}
