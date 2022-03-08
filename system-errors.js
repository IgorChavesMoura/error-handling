import timers from 'timers/promises';

const timeoutAsync = timers.setTimeout;

// const results = ['1', '2'].map(async (item) => {
//     console.log('starting process!!');
//     await timeoutAsync(100);
//     console.log(item);
//     console.log(await Promise.resolve('timeout over!'));
//     await timeoutAsync(100);
//     console.count('debug');

//     return parseInt(item) * 2;
// });

// console.log('results', await Promise.all(results));

setTimeout(async () => {
    console.log('starting process!!');
    await timeoutAsync(100);
    console.count('debug');
    console.log(await Promise.resolve('timeout over!'));
    await timeoutAsync(100);
    console.count('debug');

    await Promise.reject('promise rejected on timeout!');
}, 1000);

const throwError = (msg) => {
    throw Error(msg);
};

try {
    console.log('hey');
    console.log('there');
    throwError('error inside try/catch');
} catch (error) {
    console.log('caught on catch', error);
} finally {
    console.log('this runs after all');
}

process.on('unhandledRejection', (error) => {
    console.log('unhandledRejection', error.message || error);
});
process.on('uncaughtException', (error) => {
    console.log('uncaughtException', error.message || error);
});



Promise.reject('promise rejected');

// If Promise.reject is inside an another context, it falls on unhandledRejection
setTimeout(async () => {
    await Promise.reject('promised async/await rejected!');
})

// But if it is in the global context, it falls on the uncaughtException
// await Promise.reject('promise rejected');

throwError('error outside catch');