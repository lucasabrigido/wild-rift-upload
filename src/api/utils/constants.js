export const queryAll = async (dc, params) => {
    let items = [];
    let ExclusiveStartKey = undefined;
    do {
        const {Items, LastEvaluatedKey} = await dc.query(params);
        items.push(...Items);
        ExclusiveStartKey = LastEvaluatedKey;
        // é necessario para evitar loops eternos ao usar query com Limit
        if (params.Limit && items.length === params.Limit) {
            ExclusiveStartKey = undefined;
        }
    } while (ExclusiveStartKey);

    return {Items: items};
};

export const mimes = [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/bmp',
    'image/webp',
    'audio/midi',
    'audio/mpeg',
    'audio/webm',
    'audio/ogg',
    'audio/wav',
    'video/webm',
    'video/ogg',
    'application/octet-stream',
    'application/pkcs12',
    'application/vnd.mspowerpoint',
    'application/xhtml+xml',
    'application/xml',
    'application/pdf',
];
