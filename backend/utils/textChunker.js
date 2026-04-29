/**
 * Split large text into overlapping chunks
 *
 * @param {string} text
 * @param {number} chunkSize
 * @param {number} overlap
 * @returns {Array<Object>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text) return [];

    const chunks = [];
    let start = 0;
    let chunkIndex = 0;

    while (start < text.length) {
        const end = start + chunkSize;

        chunks.push({
            content: text.slice(start, end).trim(),
            chunkIndex,
            pageNumber: null   // optional (update later if you support page-wise parsing)
        });

        start += chunkSize - overlap;
        chunkIndex++;
    }

    return chunks;
};


/**
 * Find most relevant chunks for a query
 *
 * @param {Array<Object>} chunks
 * @param {string} query
 * @param {number} maxChunks
 * @returns {Array<Object>}
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
    if (!chunks || chunks.length === 0 || !query) {
        return [];
    }

    const stopWords = new Set([
        'the','is','in','and','to','of','a','that','it','with',
        'as','for','was','on','are','by','this','be'
    ]);

    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w && !stopWords.has(w));

    if (queryWords.length === 0) {
        return chunks.slice(0, maxChunks);
    }

    const scoredChunks = chunks.map((chunk, index) => {

        // 🔥 Convert mongoose doc to plain object
        const plainChunk = chunk.toObject ? chunk.toObject() : chunk;

        const content = plainChunk.content?.toLowerCase() || "";
        const contentWords = content.split(/\s+/);

        let score = 0;
        let matchedWords = 0;

        for (const qWord of queryWords) {
            const exactRegex = new RegExp(`\\b${qWord}\\b`, 'g');
            const exactMatches = content.match(exactRegex)?.length || 0;

            const partialMatches = contentWords.filter(w => w.includes(qWord)).length;

            if (exactMatches > 0) matchedWords++;

            score += exactMatches * 3;
            score += (partialMatches - exactMatches) * 1.5;
        }

        const normalizedScore = score / Math.sqrt(contentWords.length || 1);
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        return {
            ...plainChunk,   // ✅ now safe
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords
        };
    });

    return scoredChunks
        .filter(c => c.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.matchedWords !== a.matchedWords)
                return b.matchedWords - a.matchedWords;
            return (a.chunkIndex ?? 0) - (b.chunkIndex ?? 0);
        })
        .slice(0, maxChunks);
};


    // Normalize newlines
