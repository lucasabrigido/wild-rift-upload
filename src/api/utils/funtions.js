export async function createPromises(array, callback, len = 100) {
    let promises = [];
    for (const item of array) {
        promises.push(callback(item));

        if (promises.length > len) {
            await Promise.all(promises);
            promises = [];
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }
}
