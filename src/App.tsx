import { useEffect, useState } from "react";
import { ConnectButton, setStyles } from "tech-web3-connector";
import styled from "styled-components";
import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import { useWeb3React } from '@web3-react/core';

import ABI from './ABI.json'

const customStyles = {
  // styled modal
  modalBackdrop: {},
  modalContainer: {},
  modalBtnClose: {},
  modalConnectorsContainer: { "background-color": '#A739FE' }, // example code
  modalConnectorsItem: {},
  modalBtnProvider: {},
  modalNameWallet: { color: "color" }, // example code

  // styled Button
  BtnBase: {
    'width': '158px',
    'height': '42px',
    'background-color': '#A739FE',
    'background': '#A739FE',
    'border': '1px solid #A739FE',
    'border-radius': '21px',
    'margin': '40px 0 0 30px'
  },
  BtnContainer: {},
  BtnAdress: {},
  SpanBalance: {},
  BtnLogout: {},

  // hover Button
  "BtnBase:hover": {
    'background-color': '#A739FE',
    'background': '#A739FE'
  },
};

const RPC = {
  1: "https://mainnet.infura.io/v3/8ca77c4631f14dccb88318200cfca61d",
  3: "https://ropsten.infura.io/v3/8ca77c4631f14dccb88318200cfca61d",
  4: "https://rinkeby.infura.io/v3/8ca77c4631f14dccb88318200cfca61d",
  5: "https://goerly.infura.io/v3/8ca77c4631f14dccb88318200cfca61d",
  42: "https://kovan.infura.io/v3/8ca77c4631f14dccb88318200cfca61d",
};


const App = () => {
  setStyles(customStyles);

  const { account } = useWeb3React();

  const [step, setStep] = useState(0);
  const [count, setCount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [maxMintAmountPerTx, setMaxMintAmountPerTx] = useState<number>(0);

  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(ABI as AbiItem[], '0xf57B26B7f4F0eB812e7584aE8760caDc39247456');

  const getInitData = async () => {
    const price = await contract.methods.cost().call();
    setPrice(price);

    const balanceUser = await contract.methods.balanceOf(account).call();
    const totalSupply = await contract.methods.totalSupply().call();
    const maxMintAmountPerTx = await contract.methods.maxMintAmountPerTx().call();

    setMaxMintAmountPerTx(maxMintAmountPerTx);
    setBalance(+balanceUser);
    setTotal(+totalSupply);
  };

  const callFreeMint = async () => {
    if (total >= maxMintAmountPerTx) {
      await contract.methods.mint(count).send({ from: account }).then(() => setStep(1));
    } else {
      await contract.methods.freeMint(count).send({ from: account }).then(() => setStep(1));
    }
  };

  useEffect(() => {
    if (account) getInitData();
  }, [account, step])

  const First = () => {
    return (
      <Content>
        <Span><Input value={count === 0 ? '' : count} placeholder="Quantity" type='number' autoFocus={true} onChange={(e) => setCount(+e.target.value)} /></Span>
        <Span>Price: {(((count * price) / (10 ** 18)).toLocaleString('fullwide', { useGrouping: false, minimumFractionDigits: 13 }))} eth</Span>
        <Span>Total minted: {balance}/{total}</Span>
        <Button onClick={() => callFreeMint()} disabled={total > count ? false : true}>Mint</Button>

      </Content>
    )
  }

  const Second = () => {
    return (
      <Content>
        <span> Mint complete, <Clicking onClick={() => setStep(0)}>click here</Clicking> to mint again</span>
      </Content>
    )
  }

  return (
    <Body>
      <ConnectButton RPC={RPC} portisId={"portisId-key-project"} />
      <H1>OBYC Mint</H1>
      <H6>Mint first 5 OBYC Tokens for free!</H6>
      <Block>
        <BlockHeader >
          <Circle1/>
          <Circle2/>
          <Circle3/>
        </BlockHeader>
        <BlockTitle>MINT OBYC</BlockTitle>
        <Line />
        {step === 0 ? <First /> : <Second />}
      </Block>
    </Body>
  );
};
export default App;

const Body = styled.div`
  background: #060707;
  margin: -8px;
  color: white;
  height: 100vh;
`

const Block = styled.div`
  background: #0C0C0C;
  border-radius: 20px;
  width: 506px;
  height: 445px;
  margin: 0 auto;
`

const BlockHeader = styled.div`
  width: 506px;
  height: 46.6px;
  border-radius: 10px 10px 0 0;
  background: #FF6DD6;
  flex-direction: row;
  align-content: center;
  flex-wrap: wrap;
  display: flex;
`;

const BlockTitle = styled.div`
font-family: 'DM Sans';
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 140%;

margin: 26px 0 15px 60px
`

const Line = styled.div`
width: 441.6px;
height: 1.16px;

background: rgba(240, 242, 249, 0.15);
border-radius: 8px;
transform: matrix(1, 0, 0, -1, 0, 0);
margin: 0 auto;
`;

const Circle1 = styled.div`
  width: 18.4px;
  height: 13.98px;
  border-radius: 100px;
  background: #A739FE;
  margin: 0 15px 0 30px;
`;
const Circle2 = styled.div`
  width: 18.4px;
  height: 13.98px;
  border-radius: 100px;
  background: #FFE344;
`;
const Circle3 = styled.div`
  width: 18.4px;
  height: 13.98px;
  border-radius: 100px;
  background: #FFFFFF;
  margin: 0 15px;
`;

const H1 = styled.h1`
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 120%;
  /* or 58px */

  text-align: center;
  letter-spacing: -0.5px;
  margin-top: 0px;
  color: #FFFFFF;
`;

const H6 = styled.h6`
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 160%;
  /* or 29px */

  text-align: center;
  letter-spacing: 0.004em;

  color: rgba(255, 255, 255, 0.9);
`

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 20px;
`;

const Clicking = styled.button`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #a639fe;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  color: white;
  margin: 20px 0 0 0;
`;

const Button = styled.button`
  border: 1px solid #000;
  font-size: 30px;
  cursor: pointer;
  width: 288px;
  height: 60px;
  background: #A739FE;
  border-radius: 12px;
  color: white;
`;

const Span = styled.span`
  margin: 20px 0;
`

const Input = styled.input`
width: 288px;
height: 60px;
color: white;

background: #141414;
border-radius: 12px;
  font-size: 30px;
  ::placeholder {
  color: white;
}
`