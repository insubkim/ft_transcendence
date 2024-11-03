from web3 import Web3
from web3 import Account
import os
import json

'''
# Connect to a local Ethereum blockchain
web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

# Solidity smart contract details (simplified)
CONTRACT_ADDRESS = '0xYourContractAddress'
ABI = [...]  # Smart contract ABI

contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

def store_tournament_score(winner_name, score):
    tx_hash = contract.functions.storeScore(winner_name, score).transact({'from': web3.eth.accounts[0]})
    web3.eth.wait_for_transaction_receipt(tx_hash)
'''

class send:
    ganache_addr = ""
    ganache_http = os.environ['GANACHE_HTTP']
    ganache_account = os.environ['GANACHE_ACCOUNT']
    ganache_key = os.environ['GANACHE_KEY']
    w3 = Web3(Web3.HTTPProvider(ganache_http))
    gas_pay = 2000000

    @classmethod
    def code(cls):
        if not cls.ganache_http or not cls.ganache_account or not cls.ganache_key:
            raise EnvironmentError("필수 환경변수가 설정되지 않았습니다.")

        if not cls.w3.is_connected():
            print("prodl")
        else:
            print("ok")

        # Update the path to TTest.json using a relative path
        json_path = os.path.join(os.path.dirname(__file__), '../TTest.json')
        with open(json_path) as f:
            json_data = json.load(f)
        abi = json_data['abi']
        bytecode = json_data['bytecode']

        con = cls.w3.eth.contract(abi=abi, bytecode=bytecode)

        transaction = con.constructor().build_transaction({
            'from': cls.ganache_account,
            'nonce': cls.w3.eth.get_transaction_count(cls.ganache_account),
            'gas': cls.gas_pay,
            'gasPrice': cls.w3.to_wei('20', 'gwei')
        })

        signed = cls.w3.eth.account.sign_transaction(transaction, cls.ganache_key)
        tx_hash = cls.w3.eth.send_raw_transaction(signed.raw_transaction)

        tx_receipt = cls.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        cls.ganache_addr = tx_receipt.contractAddress

    @classmethod
    def log(cls, mode, play, win):
        with open('/app/TTest.json') as f:
            json_data = json.load(f)

        abi = json_data['abi']
        checksum_add = Web3.to_checksum_address(cls.ganache_addr)
        contract = cls.w3.eth.contract(address=checksum_add, abi=abi)

        account = Account.from_key(cls.ganache_key)

        # 기본 계정 설정
        cls.w3.eth.default_account = account.address

        # 트랜잭션 생성
        trans = contract.functions.write(mode, play, win).build_transaction({
            'from': account.address,
            'nonce': cls.w3.eth.get_transaction_count(account.address),
            'gas': cls.gas_pay,
            'gasPrice': cls.w3.to_wei('50', 'gwei'),
        })

        signed_txn = cls.w3.eth.account.sign_transaction(trans, cls.ganache_key)
        txn_hash = cls.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
