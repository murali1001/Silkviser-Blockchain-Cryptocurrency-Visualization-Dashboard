import requests
import re
import sys
import secrets
from flask import Flask, redirect, jsonify, request
from pymongo import MongoClient

# from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_pymongo import PyMongo
from flask_cors import CORS
import json
from datetime import datetime


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
# CORS(app, origins="http://localhost:5173")

token = secrets.token_hex(20)
# app.config["SECRET_KEY"] = token
# app.config["MONGO_URI"] = "mongodb+srv://BitcoinDBUser:BitcoinDBUser@bitcoindb.rw9runa.mongodb.net/?retryWrites=true&w=majority&appName=BitcoinDB"

# mongodb_client = PyMongo(app)
# db = mongodb_client.db
client = MongoClient(
    "mongodb+srv://BitcoinDBUser:BitcoinDBUser@bitcoindatabase.bwvm6y7.mongodb.net/?retryWrites=true&w=majority&appName=BitCoinDatabase"
)
db = client["bitcoin"]

getblockcount_data = db["getblockcount"]
getbestblockhash_data = db["getbestblockhash"]
getblockchaininfo_data = db["getblockchaininfo"]
getblock_data = db["getblock"]
getdualaxis_data = db["DualAxisChart"]
getbptxntable = db["BlockPageTransactionTable"]


@app.route("/")
def index():
    return "Bitcoin APIs try - /getblockcount,/getbestblockhash,/getblockchaininfo,/getblock(Pass Hash)"


# @app.route("/api/get_block_data", methods=["GET", "POST"])
# def get_block_data():

#     responseGetBlock = requests.post(
#         url="https://bitcoin-mainnet-archive.allthatnode.com/rCq1MntkCxY9ladFEmAm4Rardg4vWR83",
#         headers={"Content-Type": "text//plain"},
#         params={},
#         json={
#             "method": "getblock",
#             "params": [
#                 "0000000000000000000090d7ab9e2915f46195fbd4dbec09a088d2e168d667dd",
#                 1,
#             ],
#             "id": 0,
#         },
#     )

#     text_response = responseGetBlock.text
#     print(text_response, file=sys.stderr)

#     json_response = json.loads(text_response)
#     print(json_response["result"]["time"])
#     timestamp = json_response["result"]["time"]

#     getblock_data.insert_one(json_response)

#     return responseGetBlock.text


@app.route("/api/get_dual_axis_blockchain", methods=["GET", "POST"])
def getdual_axis_data():

    blocks = list(
        getdualaxis_data.find()
    )  # Retrieve all documents from the 'getblock_data' collection

    # Modify each document in the list
    modified_blocks = []
    for block in blocks:
        # Remove the 'id' attribute
        del block["_id"]
        # Rename the 'day' attribute to 'month'
        if "day" in block:
            block["month"] = block.pop("day")
        # Append the modified document to the new list
        modified_blocks.append(block)
    print(modified_blocks)
    return jsonify(modified_blocks)


@app.route("/api/get_block_page", methods=["GET", "POST"])
def get_block_page_data():
    blockHash = request.args.get("blockHash")

    # Find the record with the specified blockHash value
    block_data = getblock_data.find_one({"blockHash": blockHash})

    if block_data:
        # Remove the '_id' attribute
        del block_data["_id"]
        return jsonify(block_data)
    else:
        return jsonify({"error": "Block not found"})


@app.route("/api/get_block_ledger_data", methods=["GET", "POST"])
def get_block_ledger_data():
    block_hashes = []

    blockchain_info_response = requests.post(
        url="https://bitcoin-mainnet-archive.allthatnode.com/w1bRv6CRRWpCodlKp2IfOgNwTPY0F2U4",
        headers={"Content-Type": "text/plain"},
        json={"method": "getblockchaininfo", "params": []},
    )

    print(blockchain_info_response)

    blockchain_info = json.loads(blockchain_info_response.text)
    block_height = blockchain_info["result"]["blocks"]

    text_response = blockchain_info_response.text
    print(block_height)

    # Get block hash of the latest block
    for i in range(block_height, block_height - 5, -1):
        # Get block hash for current block height
        block_hash_response = requests.post(
            url="https://bitcoin-mainnet-archive.allthatnode.com/w1bRv6CRRWpCodlKp2IfOgNwTPY0F2U4",
            headers={"Content-Type": "text/plain"},
            json={"method": "getblockstats", "params": [i]},
        )
        block_hash = json.loads(block_hash_response.text)["result"]["blockhash"]
        block_reward = (
            json.loads(block_hash_response.text)["result"]["subsidy"] / 100000000
            + json.loads(block_hash_response.text)["result"]["totalfee"] / 100000000
        )
        block_height = json.loads(block_hash_response.text)["result"]["height"]
        block_subsidy = (
            json.loads(block_hash_response.text)["result"]["subsidy"] / 100000000
        )
        block_fee = (
            json.loads(block_hash_response.text)["result"]["totalfee"] / 100000000
        )
        # Store block hash and block height in an object
        block_hashes.append(
            {
                "blockReward": block_reward,
                "blockHash": block_hash,
                "blockHeight": block_height,
                "blockSubsidy": block_subsidy,
                "blockFee": block_fee,
            }
        )

    for block_hash in block_hashes:
        block_response = requests.post(
            url="https://bitcoin-mainnet-archive.allthatnode.com/w1bRv6CRRWpCodlKp2IfOgNwTPY0F2U4",
            headers={"Content-Type": "text/plain"},
            json={"method": "getblock", "params": [block_hash["blockHash"]]},
        )
        block_data = json.loads(block_response.text)["result"]
        print(block_data)

        timestamp = datetime.fromtimestamp(block_data["time"])

        # Format the datetime object as required
        formatted_time = timestamp.strftime("%b %d, %Y %H:%M:%S")

        if block_data:
            block_details = {
                "blockHash": block_data["hash"],
                "preBlockHash": block_data["previousblockhash"],
                "merkleRoot": block_data["merkleroot"],
                "time": formatted_time,
                "transactions": block_data["nTx"],
                "blockSize": block_data["size"],
                "confirmation": block_data["confirmations"],
            }

            # Add block details to the corresponding object in the block_hashes array
            for block in block_hashes:
                if block["blockHash"] == block_hash["blockHash"]:
                    block.update(block_details)
                    break

    # getblock_data.insert_one(block_hashes)
    getblock_data.insert_many(block_hashes)
    # Modify each document in the list
    modified_blocks = []
    for block in block_hashes:
        # Remove the 'id' attribute
        del block["_id"]

        # Append the modified document to the new list
        modified_blocks.append(block)
    return jsonify(modified_blocks)


@app.route("/api/top_transactions/<blockHash>", methods=["GET"])
def get_top_transactions(blockHash):
    try:
        response = requests.get(f"https://blockstream.info/api/block/{blockHash}/txs")
        if response.status_code == 200:
            transactions = response.json()[:15]  # Get the top 15 transactions
            transformed_transactions = []
            for idx, tx in enumerate(transactions, start=1):
                transformed_tx = {
                    "id": idx,
                    "txhash": tx["txid"],
                    "inaddr": len(tx["vin"]),
                    "outaddr": len(tx["vout"]),
                    "txsize": tx["size"],
                    "txfee": tx["fee"] / 100000000,  # Convert satoshis to BTC
                }
                transformed_transactions.append(transformed_tx)

            # # Insert unique transactions into MongoDB collection
            # for tx in transformed_transactions:
            #     getbptxntable.update_one({"txhash": tx["txhash"]}, {"$set": tx}, upsert=True)

            # # Fetch all unique transactions from the collection
            # unique_transactions = list(getbptxntable.find({}, {"_id": 0}))

            return jsonify(transformed_transactions)
        else:
            return jsonify([])  # Return empty list if request fails
    except Exception as e:
        print("Error:", e)
        return jsonify([])  # Return empty list if an error occurs


@app.route("/getblockcount", methods=["GET", "POST"])
def getblockcount():
    print(
        "Calling method getblockcount - Gives Total number of blocks", file=sys.stderr
    )
    responseGetBlockCount = requests.post(
        url="https://bitcoin-mainnet-archive.allthatnode.com/w1bRv6CRRWpCodlKp2IfOgNwTPY0F2U4",
        headers={"Content-Type": "text//plain"},
        params={},
        json={"method": "getblockcount"},
    )
    """db.GetBlockCount.insert_one({
          "BlockCountResponse":responseGetBlockCount.text
    })"""

    text_response = responseGetBlockCount.text
    print(text_response, file=sys.stderr)

    json_response = json.loads(text_response)
    getblockcount_data.insert_one(json_response)

    return responseGetBlockCount.text


@app.route("/getbestblockhash", methods=["GET", "POST"])
def getbestblockhash():
    print(
        "Calling method getbestblockhash - Gives block hash of the best block",
        file=sys.stderr,
    )
    responseGetBestBlockHash = requests.post(
        url="https://bitcoin-mainnet-archive.allthatnode.com/w1bRv6CRRWpCodlKp2IfOgNwTPY0F2U4",
        headers={"Content-Type": "text//plain"},
        params={},
        json={"method": "getbestblockhash"},
    )

    text_response = responseGetBestBlockHash.text
    print(text_response, file=sys.stderr)
    blockHash = re.search(":(.+?),", text_response).group(1)
    print("Best Block Hash is - ", file=sys.stderr)
    print(blockHash, file=sys.stderr)

    json_response = json.loads(text_response)
    getbestblockhash_data.insert_one(json_response)

    return responseGetBestBlockHash.text


@app.route("/getblockchaininfo", methods=["GET", "POST"])
def getblockchaininfo():
    print(
        "Calling method getblockchaininfo - Gives information about entire block chain",
        file=sys.stderr,
    )
    responseGetBlockChainInfo = requests.post(
        url="https://bitcoin-mainnet-archive.allthatnode.com/w1bRv6CRRWpCodlKp2IfOgNwTPY0F2U4",
        headers={"Content-Type": "text//plain"},
        params={},
        json={"method": "getblockchaininfo"},
    )

    text_response = responseGetBlockChainInfo.text
    print(text_response, file=sys.stderr)

    json_response = json.loads(text_response)

    getblockchaininfo_data.insert_one(json_response)

    print("adding data done")
    return responseGetBlockChainInfo.text


@app.route("/getblock", methods=["GET", "POST"])
def getblock(blockHash=None):
    print("Calling method getblock from previously received hash", file=sys.stderr)
    responseGetBlock = requests.post(
        url="https://bitcoin-mainnet-archive.allthatnode.com/w1bRv6CRRWpCodlKp2IfOgNwTPY0F2U4",
        headers={"Content-Type": "text//plain"},
        params={},
        json={"method": "getblock", "params": [blockHash[1:-1]]},
    )
    text_response = responseGetBlock.text
    print(text_response, file=sys.stderr)
    json_response = json.loads(text_response)

    getblock_data.insert_one(json_response)

    return responseGetBlock.text


@app.route("/api/address/<address_hash>", methods=["GET"])
def get_address_data(address_hash):
    address_data = requests.get(
        url=f"https://api.blockcypher.com/v1/btc/main/addrs/{address_hash}/full?limit=50"
    )

    if address_data.status_code != 200:
        return (address_data.text, 400)

    return address_data.text


@app.route("/api/getrawtransaction", methods=["GET", "POST"])
def getrawtransaction():
    verbose = True
    data = request.json
    print("------------------------------")
    print(data["txHash"])
    print("Calling method getrawtransaction", file=sys.stderr)
    responseGetTx = requests.post(
        url="https://bitcoin-mainnet-archive.allthatnode.com/w1bRv6CRRWpCodlKp2IfOgNwTPY0F2U4",
        headers={"Content-Type": "application//json"},
        params={},
        json={"method": "getrawtransaction", "params": [data["txHash"], verbose]},
    )
    text_response = responseGetTx.text
    print(text_response, file=sys.stderr)
    json_response = json.loads(text_response)

    "getrawtransaction.insert_one(json_response)"
    print(responseGetTx.text)
    return json_response


# cache = {}


@app.route("/api/gettxdata/<tx_hash>", methods=["GET"])
def gettxdata(tx_hash):
    print(tx_hash)

    # if tx_hash in cache:
    #     print("Using cached result")
    #     return cache[tx_hash]

    tx_data = requests.get(url=f"https://api.blockcypher.com/v1/btc/main/txs/{tx_hash}")
    result = tx_data.text
    # cache[tx_hash] = result
    print(result)
    return result


if __name__ == "__main__":
    app.run(debug=True)