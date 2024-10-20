from web3 import Web3

# Connect to a local Ethereum blockchain
web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

# Solidity smart contract details (simplified)
CONTRACT_ADDRESS = '0xYourContractAddress'
ABI = [...]  # Smart contract ABI

contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

def store_tournament_score(winner_name, score):
    tx_hash = contract.functions.storeScore(winner_name, score).transact({'from': web3.eth.accounts[0]})
    web3.eth.wait_for_transaction_receipt(tx_hash)