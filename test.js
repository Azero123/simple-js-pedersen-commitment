try {
    const Pedersen = require('./.js')

    const pederson = new Pedersen(
        '925f15d93a513b441a78826069b4580e3ee37fc5',
        '959144013c88c9782d5edd2d12f54885aa4ba687'
    )

    const secrets = {}
    let i = 0
    while (i < 100) {
        const secret = pederson.newSecret()
        if (secret.length !== 40) {
            throw 'generated invalid key'
        }
        secrets[secret] = true
        i++
    }

    if (Object.keys(secrets).length !== 100) {
        throw 'basic secret collision test failed'
    }

    let secret = '1184c47884aeead9816654a63d4209d6e8e906e29'

    const testA = pederson.commit('1', secret, 'e93c58e6f7f3f4b6f6f0e55f3a4191b87d58b7b1')
    const assertionA = [ '4b7680d6262cea707175d55e862a09ba71b55655', 'e93c58e6f7f3f4b6f6f0e55f3a4191b87d58b7b1' ]
    if (testA.toString() !== assertionA.toString()) {
        throw 'arbitrary signature test 1 failed'
    }

    const testB = pederson.commit('2', secret, 'ba1303c4f29bd959f585dc0dcfb3dbd0cebecd48')
    const assertionB = [ 'ff5ad287a51bffddedaf342dfa685b0cf82286ce', 'ba1303c4f29bd959f585dc0dcfb3dbd0cebecd48' ]
    if (testB.toString() !== assertionB.toString()) {
        throw 'arbitrary signature test 2 failed'
    }

    const assertionC = [ '71e6ef28ea611f23d2240e4a786edc14611c96a3', '1a34f5cabea8fce10ec76c16d09f56d894c1784f9' ]
    if (pederson.combine([testA, testB]).toString() !== assertionC.toString()) {
        throw 'arbitrary signature combination failed'
    }

    if (!pederson.verify('1', [testA], secret)) {
        throw 'arbitrary verification test 1 failed'
    }
    if (!pederson.verify('2', [testB], secret)) {
        throw 'arbitrary verification test 2 failed'
    }
    if (!pederson.verify('3', [pederson.combine([testA, testB])], secret)) {
        throw 'combined verifcation test failed'
    }

    const message = 'aaaaaaaaaa'
    const testD = pederson.commit(message, secret, 'ba1303c4f29bd959f585dc0dcfb3dbd0cebecd48')
    if (!pederson.verify(message, [testD], secret)) {
        throw 'random verification test 1 failed'
    }

    secret = pederson.newSecret()
    const testE = pederson.commit(message, secret)
    if (!pederson.verify(message, [testE], secret)) {
        throw 'end-to-end test failed'
    }
}
catch (error) {
    console.error('⚠️ failed to test pedersen commitments ', error)
    throw error
} 
