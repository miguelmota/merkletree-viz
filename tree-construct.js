//const sha1 = require('./node_modules/sha1/sha1.js');
//const _    = require('./node_modules/underscore/underscore.js');

function constructTree(listOfNodes) {
  if(listOfNodes.length === 1) {
    listOfNodes[0].isRoot = true;
    return listOfNodes;
  }
  listOfNodes = _.chunk(listOfNodes, 2);
  var allParentNodes = [];
  for (var i in listOfNodes) {
    var currentHash = null;
    var node = null;
    if(listOfNodes[i].length < 2) {
      currentHash = listOfNodes[i][0].hash;
      node = new Node(currentHash, listOfNodes[i][0]);
    } else {
      currentHash = getParentNodeHash(listOfNodes[i][0].hash, listOfNodes[i][1].hash);
      node = new Node(currentHash, listOfNodes[i][0], listOfNodes[i][1]);
    }
    allParentNodes.push(node);
  }
  return constructTree(allParentNodes);
}

function getParentNodeHash(hash1, hash2) {
    return sha1(hash1 + hash2);
}

function convertToNodeList(dataChunkList) {
  var nodeList = [];
  for (var i in dataChunkList) {
    nodeList.push(new Node(sha1(dataChunkList[i])));
  }
  return nodeList;
}

function Node (hash, leftNode, rightNode) {
    this.hash = hash;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.isRoot = false;

    this.toString = function() {
      if(this.leftNode || this.rightNode) {
        var returnObj = {
          text: {
            name: this.hash.substr(0, 6)
          },
          HTMLclass: this.isRoot ? "root-node" : "parent-node",
          children: []
        };

        if (this.leftNode) returnObj.children.push(this.leftNode.toString());
        if (this.rightNode) returnObj.children.push(this.rightNode.toString());
        return returnObj;
      }
      return {
        text: {
          name: this.hash.substr(0, 6)
        },
        HTMLclass:"leaf-node"
      };
    }
}

///////////////////Test/////////////////////////////////////////////////////////
// var testData = ['a','b','c','d','e','f','g','h'];
// var nodeList = convertToNodeList(testData);
// console.log(JSON.stringify(constructTree(nodeList)[0].toString()));
