const layers = {
  '2a3eb5e4fd7ca38eebd660d4b9879fd3e235cd240772bccdfadfa6c1529b4711': {
    '568ff5eb286f51b8a3e8de4e53aa8daed44594a246deebbde119ea2eb27acd6b': {
      '9e031569905bf7098e9e3b14d5c8e2ed05f6e8dc1acaaad6a221cd6603e01d3b': {
        '0b4aa17bff8fc189efb37609ac5ea9fca0df4c834a6fbac74b24c8119c40fef2': {
          '044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d': null,
          c89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6: null
        },
        '27c2feed9df4c4903bfc9f1bda886662bebc8ba175ccdb3d1da20ce3a32441ba': {
          ad7c5bef027816a800da1736444fb58a807ef4c9603b7848673f7e3a68eb14a5: null,
          '2a80e1ef1d7842f27f2e6be0972bb708b9a135c38860dbe73c27c3486c34f4de': null
        }
      },
      '519d76fbbd63a3ac72cdfee0c0e650d76e933ef34227d72ef272a397ee3ce5ba': {
        f72583988683f14adebd6eed8914c8b5a29217104a476f4b87d6e3716def3116: {
          '13600b294191fc92924bb3ce4b969c1e7e2bab8f4c93c3fc6d0a51733df3c060': null,
          ceebf77a833b30520287ddd9478ff51abbdffa30aa90a8d655dba0e8a79ce0c1: null
        },
        ecda27ba4c1455eea6585eefd811915fe9de3a6f7dc8f347be2a851794339f38: {
          e455bf8ea6e7463a1046a0b52804526e119b4bf5136279614e0b1e8e296a4e2d: null,
          '52f1a9b320cab38e5da8a8f97989383aab0a49165fc91c737310e4f7e9821021': null
        }
      }
    },
    '91a4447bed354cc655e39f47ac6668f26b8682db96d52a7f7b0f7d7682ba5a86': {
      '91a4447bed354cc655e39f47ac6668f26b8682db96d52a7f7b0f7d7682ba5a86': {
        '91a4447bed354cc655e39f47ac6668f26b8682db96d52a7f7b0f7d7682ba5a86': {
          e4b1702d9298fee62dfeccc57d322a463ad55ca201256d01f62b45b2e1c21c10: null,
          d2f8f61201b2b11a78d6e866abc9c3db2ae8631fa656bfe5cb53668255367afb: null
        }
      }
    }
  }
}

let treeData = {}
// const color = d3.scaleOrdinal(d3.schemeCategory10)

function getKey (k) {
  return k.slice(0, 4) + '...' + k.slice(k.length - 4, k.length)
}

const maxLayers = 4

function check (key, layers, j) {
  const obj = {
    text: {
      name: getKey(key),
    },
    //fill: color(j),
    "HTMLclass": j === 0 ? "root-node" : 'parent-node'
  }
  j++
  if (layers[key]) {
    obj.children = []
    let i = 0
    for (const k in layers[key]) {
      obj.children.push({
        text: {
          name: getKey(k),
        },
        //fill: color(),
        "HTMLclass": j === maxLayers ? 'leaf-node' : "parent-node"
      })
      if (layers[key][k]) {
        obj.children[i] = check(k, layers[key], j)
      }
      i++
    }
  }
  return obj
}

const j = 0
for (const key in layers) {
  obj = check(key, layers, j)
  treeData = obj
}

function initConstructTree(){
  const nodeTreeStructure = treeData
  var chart_config = {
    	chart: {
    		container: "#merkle-tree",
        connectors: {
          "type":"step",
          "style": {
            "stroke-width": 2
          }
        }
    	},
    	nodeStructure: nodeTreeStructure
  };
  console.log('chart_config', chart_config)
  new Treant( chart_config );
}

function getChunksFromData(data, chunkSize) {
  var data = data.split('');
  return _.chunk(data, Math.floor(data.length / chunkSize) + 1).map(
    function(splitData){
      return splitData.join('')
    }
  )
}

initConstructTree()
