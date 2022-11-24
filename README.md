#WIP: Star Fox Cosmos Snap

## TODO:
- IBC cross chain transfers and test
- Staking and unstaking 
- redelegation of stakes to a different validator
- solve webpack issue with snap when importing classes from the sdk
- refactor governance calls
- create nx tasks for all packages


## Prerequisite

| Package        | Ver   |
| -------------- | ----- |
| Node           | 16.\* |

## Folder Structure
```
|-- ./packages/junoswap-interface
|-- ./packages/sdk
|-- ./packages/frontend
|-- ./packages/frontend-e2e
|-- ./packages/snap
```


## Run Locally

### Build SDK
```bash
yarn nx build sdk
```

### Install SDK into Junoswap Frontend
```bash
cd packages/junoswap-interface
yarn install
```

### Run Snap
```bash
cd packages/snap
yarn build && yarn serve
```

### Run Frontend
```bash
yarn nx serve frontend 
```

### Run Junoswap

Junoswap is a live project that serves as a proof of concept to test the metamask snap acting as a alternative provider. 

Run this frontend interface to test out the adapter in the sdk.


```bash
cd packages/junoswap-interface
yarn dev
```

### Run Forward Proxy
This is needed because alot of cosmos ecosystems' rpcs currently do not support cors. This is a temporary workaround until own nodes are live.


```bash
cd packages/forward-proxy
yarn start
```

