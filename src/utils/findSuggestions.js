function normalize(str = "") {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "");
}

export function similarity(a, b) {
    a = normalize(a);
    b = normalize(b);

    const alen = a.length;
    const blen = b.length;
    const maxLen = Math.max(alen, blen);

    if (!maxLen) {
        return 100;
    }

    const matrix = Array.from({ length: alen + 1 }, () => Array(blen + 1).fill(0));

    for (let i = 0; i <= alen; i++) matrix[i][0] = i;
    for (let j = 0; j <= blen; j++) matrix[0][j] = j;
    for (let i = 1; i <= alen; i++) {
        for (let j = 1; j <= blen; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;

            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }

    let score = (1 - matrix[alen][blen] / maxLen) * 100;

    if (a.startsWith(b) || b.startsWith(a)) {
        score += 10;
    }

    return Math.max(0, Math.min(100, score));
}

export function findSuggestions(input, plugins) {
    return [...plugins.values()]
        .map(plugin => ({
            ...plugin,
            percent: Math.round(similarity(input, plugin.name)),
        }))
        .filter(item => item.percent > 40)
        .sort(
            (a, b) =>
                b.percent - a.percent
        );
}