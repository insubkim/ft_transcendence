from django.shortcuts import render
from web3 import Web3
from django.http import JsonResponse

# Connect to Ganache (local Ethereum node)
web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

# Replace with your actual contract address and ABI from Remix
contract_address = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'
contract_abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "winner",
				"type": "string"
			}
		],
		"name": "ScoreUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "TournamentCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "createTournament",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getTournament",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tournamentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tournaments",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "winner",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_score",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_winner",
				"type": "string"
			}
		],
		"name": "updateScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]  # Copy ABI from Remix

# Connect to the deployed contract
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def create_tournament(request):
    name = request.POST.get('name')
    tx_hash = contract.functions.createTournament(name).transact({'from': web3.eth.accounts[0]})
    web3.eth.waitForTransactionReceipt(tx_hash)
    return JsonResponse({'status': 'Tournament created'})

def update_score(request, tournament_id):
    score = request.POST.get('score')
    winner = request.POST.get('winner')
    tx_hash = contract.functions.updateScore(tournament_id, int(score), winner).transact({'from': web3.eth.accounts[0]})
    web3.eth.waitForTransactionReceipt(tx_hash)
    return JsonResponse({'status': 'Score updated'})

