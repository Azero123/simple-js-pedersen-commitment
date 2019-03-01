const crypto = require('crypto')
const bigInt = require('big-integer')
const bitSecurity = 32

const bigMath = {
  add(a, b, c) {
    if (c) {
      return bigInt(a.toString()).add(b.toString()).mod(c)
    }
    return bigInt(a.toString()).add(b.toString())
  },
  subtract(a, b, c) {
    if (c) {
      return bigInt(a.toString()).sub(b.toString()).mod(c)
    }
    return bigInt(a.toString()).sub(b.toString())
  },
  multiply(a, b, c)  {
    if (c) {
      return bigInt(a.toString()).multiply(b.toString()).mod(c)
    }
    return bigInt(a.toString()).multiply(b.toString())
  },
  divide(a, b, c) {
    if (c) {
      return bigInt(a.toString()).divide(b.toString()).mod(c)
    }
    return bigInt(a.toString()).divide(b.toString())
  },
  power(p, s, c)  {
    if (c) {
      return bigInt(p.toString()).modPow(s, c)
    }
    return bigInt(p.toString()).pow(s)
  }
}

class Pedersen {
  constructor(p, g, absctractMath = bigMath) {
    this.absctractMath = absctractMath
    this.p = bigInt(p, 16)
    this.g = bigInt(g, 16)
    this.q = this.absctractMath.add(
      this.absctractMath.multiply(this.p, 2),
      1
    )
  }

  newSecret() {
    return this.newOffset()
  }

  newOffset() {
    let r = bigInt(0)
    while (r.compare(0) !== 1 || r.compare(this.p) !== -1 ) {
      r = bigInt.fromArray([...crypto.randomBytes(bitSecurity)], 256)
      r = r.mod(this.p)
    }
    r = r.mod(this.p)
    return r.toString(16).padStart(40, '0')
  }

  commit(message, secret, r = this.newOffset()){
    r = bigInt(r, 16)
    const m = bigInt(message, 16)
    const h = bigInt(this.g).modPow(bigInt(secret, 16), this.q)

    const c = this.absctractMath.multiply(
      this.absctractMath.power(this.g, m, this.q),
      this.absctractMath.power(h, r, this.q),
      this.q,
    )
    return [c.toString(16), r.toString(16)]
  }

  verify(message, commitments, secret) {
    const commitment = this.combine(commitments)
    const r = commitment[1]
    const c = this.commit(message.toString(16), secret, r)
    
    return c.toString() === commitment.toString()
  }
  
  combine(commitments) {
    let c = bigInt('1')
    let r = bigInt('0')
    for (const commitment of commitments) {
      c = c.multiply(bigInt(commitment[0], 16)).mod(this.q)
      r = r.add(bigInt(commitment[1], 16))
    }
    return [c.toString(16), r.toString(16)]
  }
}

module.exports = Pedersen
