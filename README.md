# 运行步骤

## 1. Add MetaMask wallet network: ropsten

Go to link:

https://umbria.network/connect/ethereum-testnet-ropsten

Open your MetaMask plugin and you will get a ropsten network.



Or:

Add the ropsten network like this:

![image-20220512164223254](README.assets/image-20220512164223254.png)

![image-20220513223331649](README.assets/image-20220513223331649.png)

## 2. Install dependencies

在根目录 `Blockchain-MysteryBoxes` 下：

```bash
npm install
```

## 3. Deploy contract

```bash
npx hardhat run src/backend/scripts/deploy.js --network ropsten
```

## 4. Test (option) 

```bash
npx hardhat test
```

## 5. Start the frontend

under root path: `Blockchain-MysteryBoxes` ：

```bash
npm start
```



Or using localhost:

## 1. Add test Metamask wallet account

![image-20220512164223254](hardhat几个命令.assets/image-20220512164223254.png)

![image-20220512164310785](hardhat几个命令.assets/image-20220512164310785.png)

Add configs like this:

![image-20220512164344224](hardhat几个命令.assets/image-20220512164344224.png)

## 2. Install dependencies

under root path: `Blockchain-MysteryBoxes` ：

```bash
npm install
```

## 3. Set up test hardhat nodes:

```bash
npx hardhat node
```

Don't stop the terminal of the code above

## 4. Deploy contract

```bash
npx hardhat run src/backend/scripts/deploy.js --network ropsten
```

## 5. Test (option) 

```bash
npx hardhat test
```

## 6. Start the frontend

under root path: `Blockchain-MysteryBoxes` ：

```bash
npm start
```
