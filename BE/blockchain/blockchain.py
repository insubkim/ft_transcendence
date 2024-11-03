from web3 import Web3
from web3 import Account
import os
import json


class send:
    ganache_http = os.environ['GANACHE_HTTP']
    ganache_account = os.environ['GANACHE_ACCOUNT']
    ganache_key = os.environ['GANACHE_KEY']
    w3 = Web3(Web3.HTTPProvider(ganache_http))
    gas_pay = 2000000

    @classmethod
    def code(cls):
        if not cls.ganache_http or not cls.ganache_account or not cls.ganache_key:
            raise EnvironmentError("필수 환경변수가 설정되지 않았습니다.")

        cls.w3.is_connected()

        '''
        json_path = os.path.join(os.path.dirname(__file__), '../TTest.json')
        with open(json_path) as f:
            json_data = json.load(f)
        abi = json_data['abi']
        bytecode = json_data['bytecode']
        '''

        from solcx import compile_standard, install_solc, compile_solc, exceptions

        try:
            install_solc('0.8.0')
        except exceptions.SolcInstallationError:
            # Fallback to compiling solc from source if binary installation fails
            compile_solc('0.8.0')

        with open("/app/blockchain/TTest.sol", "r") as f:
            solidity_code = f.read()

        compiled_sol = compile_standard(
            {
                "language": "Solidity",
                "sources": {
                    "TTest.sol": {
                        "content": solidity_code
                    }
                },
                "settings": {
                    "outputSelection": {
                        "*": {
                            "*": ["*"],
                            "": ["*"]
                        }
                    }
                }
            },
            solc_version='0.8.0'
        )

        contract_name = "TTest"
        abi = compiled_sol['contracts']['TTest.sol'][contract_name]['abi']
        bytecode = compiled_sol['contracts']['TTest.sol'][contract_name]['evm']['bytecode']['object']

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

        with open("/app/blockchain/TTest_addr", "w") as f:
            f.write(cls.ganache_addr)
        with open("/app/blockchain/TTest.abi", "w") as f:
            f.write(json.dumps(abi))

    @classmethod
    def contract(cls):
        with open('/app/blockchain/TTest.abi', 'r') as f:
            abi = json.load(f)
        with open('/app/blockchain/TTest_addr', 'r') as f:
            con_add = f.read()
        checksum_add = Web3.to_checksum_address(con_add)
        contract = cls.w3.eth.contract(address=checksum_add, abi=abi)
        return contract

    @classmethod
    def see(cls):
        """
        with open('/app/blockchain/TTest.abi', 'r') as f:
            abi = json.load(f)
        with open('/app/blockchain/TTest_addr', 'r') as f:
            con_add = f.read()
        checksum_add = Web3.to_checksum_address(con_add)
        contract = cls.w3.eth.contract(address=checksum_add, abi=abi)
        """
        contract = cls.contract()

        speak = contract.functions.speak().call()
        print(speak)

    @classmethod
    def log(cls, mode, play, win):
        '''
        with open('/app/blockchain/TTest.abi', 'r') as f:
            abi = json.load(f)
        with open('/app/blockchain/TTest_addr', 'r') as f:
            con_add = f.read()
        checksum_add = Web3.to_checksum_address(con_add)
        contract = cls.w3.eth.contract(address=checksum_add, abi=abi)
        '''
        contract = cls.contract()

        account = Account.from_key(cls.ganache_key)

        cls.w3.eth.default_account = account.address

        trans = contract.functions.write(mode, play, win).build_transaction({
            'from': account.address,
            'nonce': cls.w3.eth.get_transaction_count(account.address),
            'gas': cls.gas_pay,
            'gasPrice': cls.w3.to_wei('50', 'gwei'),
        })

        signed_txn = cls.w3.eth.account.sign_transaction(trans, cls.ganache_key)
        txn_hash = cls.w3.eth.send_raw_transaction(signed_txn.raw_transaction)

if __name__ == "__main__":
    send.code()
