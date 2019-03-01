# simple-pedersen-commitment

this project is intended to make easier usage of commitment technologies for cryto/blockchain type projects. it is intended to be very lightweight and thus will not have many dependencies.

to create a new secret to later reveal:
```
secret = pederson.newSecret()
```

to create a sharable commitment:
```
commitment = pederson.commit(message, secret)
```

to verify if a commitment is valid:
```
pederson.verify(message, [commitment, ...], secret)
```

# contribute

bitcoin address: 1KKiniL7QnMPZZLjgGB2Kq1d7zsjUr6TnS 
