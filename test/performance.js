const pederson = new (require('./.js'))(
    '925f15d93a513b441a78826069b4580e3ee37fc5',
    '959144013c88c9782d5edd2d12f54885aa4ba687'
)
const message = '2'
const secret = pederson.newSecret()
let startTime = Date.now()
const sigs = []
let i = 0
while (i < 1000) {
    i++
    //   sigs.push(pederson.commit(message, key))
    sigs.push(pederson.commit(message, secret))
}
console.log((Date.now() - startTime)/1000)

startTime = Date.now()
for (const sig of sigs) {
    // console.log(message, sig, secret)
    if (!pederson.verify(message, [sig], secret)) {
        throw 'error'
    }
}
console.log((Date.now() - startTime)/1000)