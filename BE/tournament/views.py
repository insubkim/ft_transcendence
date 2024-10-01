from django.shortcuts import render
from web3 import Web3
from django.http import JsonResponse

# Connect to Ganache (local Ethereum node)
web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

# Replace with your actual contract address and ABI from Remix
contract_address = '0xYourContractAddressHere'
contract_abi = [ ... ]  # Copy ABI from Remix

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

