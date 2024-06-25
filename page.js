"use client";
import maggiapi from "../artifacts/contracts/Maggi.sol/Maggi.json"

import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
  const [ethWindow, setEthWindow] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [personName, setPersonName] = useState();
  const [personMessage, setPersonMessage] = useState();
  const [details, setDetails] = useState();
  const [clicked, setClicked] = useState();

  const [value, setValue] = useState();

  const contractAddress = "0xd865205398cA766bE685DBa99868e71c97dB6754";

  const initialize = async () => {
    if (window.ethereum) {
      console.log("Metamask is installed");
      setEthWindow(window.ethereum);
    }

    if (ethWindow) {
      const accountsArray = await ethWindow.request({ method: "eth_accounts" });
      setAccounts(accountsArray);
    }
    ConnectToMetamask();
  };

  const ConnectToMetamask = async () => {
    if (ethWindow) {
      const accounts = ethWindow.request({ method: "eth_requestAccounts" });
      setAccounts(accounts);
    }
    // setAddFriend(true);
    // ConnectToContract();
  };

  const ConnectToContract = () => {
    try {
      console.log(contractAddress);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const socialContract = new ethers.Contract(
        contractAddress,
        maggiapi.abi,
        signer
      );
      console.log("social contract is : " + socialContract);
      console.log(socialContract);
      setContractInstance(socialContract);
      console.log(contractInstance);
    } catch (error) {
      console.log("can't connect with the contract");
    }
  };

  const getMaggie = async () => {
    try {
      await contractInstance.buyMaggi(personName, personMessage, {
        value: parseInt(value),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getMomoDetails = async () => {
    try {
      const res = await contractInstance.getMemos();
      console.log(res);
      setDetails(res);
      setClicked(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ConnectToContract();
    initialize();
  }, []);

  return (
    <div>
      <h1>Home Page </h1>

      <button onClick={() => ConnectToMetamask()}>Connect to Metamask </button>

      <label>Enter the Name</label>
      <input
        className="text-black"
        placeholder="Enter the Name"
        onChange={(e) => setPersonName(e.target.value)}
      />
      <label>Enter the Message</label>
      <input
        className="text-black"
        placeholder="Enter the message"
        onChange={(e) => setPersonMessage(e.target.value)}
      />
      <label>Enter the Amount to pay for maggie</label>
      <input
        className="text-black"
        placeholder="Enter the amount"
        onChange={(e) => setValue(e.target.value)}
      />

      <button onClick={() => getMaggie()}>Buy Maggie</button>
      <button onClick={() => getMomoDetails()}>Get all Maggie Buyer</button>

      {clicked &&
        details.map((eachInfo, index) => (
          <table
            key={index}
            className=" bg-slate-900 text-white w-full text-center rounded-xl my-5"
          >
            <tbody>
              <tr>
                <td className=" w-1/4 ">{eachInfo.name}</td>
                <td className=" w-1/4 ">{eachInfo.message}</td>
                <td className=" w-1/4 ">{parseInt(eachInfo.timestamp)}</td>
                <td className=" w-1/4 ">{eachInfo.from}</td>
              </tr>
            </tbody>
          </table>
        ))}
    </div>
  );
}