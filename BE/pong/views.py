from django.shortcuts import render
from .models import Tournament
from web3 import Web3
from django.conf import settings

# Create your views here.
def tournament_list(request):
	tournaments = Tournament.objects.all()
	return render(request, 'pong/tournament_list.html', {'tournaments': tournaments})

# Connect to Ethereum network
w3 = Web3(Web3.HTTPProvider('<YOUR_INFURA_OR_LOCAL_ETHEREUM_NODE_URL>')) #get from infura or other service provider website

contract_address = '<DEPLOYED_CONTRACT_ADDRESS>' #use remix
abi = <ABI_JSON> #also use remix

tournament_contract = w3.eth.contract(address=contract_address, abi=abi)

def store_score(tournament_id, player_name, score):
    tx_hash = tournament_contract.functions.storeScore(tournament_id, player_name, score).transact({
        'from': w3.eth.accounts[0]
    })
    w3.eth.waitForTransactionReceipt(tx_hash)