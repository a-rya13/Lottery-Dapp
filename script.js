let web3;
let contract;
let accounts;

const contractAddress = "0x87150A6fEA3c939a528400928797c56b9E4d12dC"; // Replace with your contract address
const contractABI = [
  {
    inputs: [],
    name: "selectWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

async function init() {
  if (window.ethereum) {
    web3 = new web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(contractABI, contractAddress);

    const manager = await contract.methods.manager().call();
    document.getElementById("manager").innerText = manager;
    updateBalance();
  } else {
    alert("Please install MetaMask!");
  }
}

async function updateBalance() {
  if (!contract) return;
  const balanceWei = await contract.methods.getBalance().call();
  const balanceEth = web3.utils.fromWei(balanceWei, "ether");
  document.getElementById("balance").innerText = balanceEth;
}

async function enterLottery() {
  if (!web3 || !contract) {
    document.getElementById("status").innerText = "Web3 is not initialized!";
    return;
  }

  try {
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: contractAddress,
      value: web3.utils.toWei("0.01", "ether"),
    });
    document.getElementById("status").innerText =
      "Successfully entered the lottery!";
    updateBalance();
  } catch (error) {
    console.error(error);
    document.getElementById("status").innerText = "Transaction failed!";
  }
}

async function pickWinner() {
  if (!web3 || !contract) {
    document.getElementById("status").innerText = "Web3 is not initialized!";
    return;
  }

  try {
    await contract.methods.selectWinner().send({ from: accounts[0] });
    document.getElementById("status").innerText = "Winner has been selected!";
    updateBalance();
  } catch (error) {
    console.error(error);
    document.getElementById("status").innerText =
      "Only manager can pick a winner!";
  }
}

window.onload = init;
