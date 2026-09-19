{
  "_$id": "dhk7zkt3qf",
  "_$type": "Scene",
  "width": 1280,
  "height": 720,
  "_$child": [
    {
      "_$id": "u64o1soefc",
      "_$type": "Image",
      "name": "bg",
      "skin": "resources/ui/bg.png",
      "left": 0,
      "right": 0,
      "top": 0,
      "bottom": 0
    },
    {
      "_$id": "71ram6ntej",
      "_$type": "Label",
      "name": "title",
      "text": "Mini-game Scaffolding",
      "fontSize": 48,
      "color": "#ffffff",
      "bold": true,
      "stroke": 4,
      "strokeColor": "#1b4c86",
      "centerX": 0,
      "y": 90
    },
    {
      "_$id": "mvd1xwtqyr",
      "_$type": "Button",
      "name": "startBtn",
      "skin": "resources/ui/btn/play.png",
      "centerX": 0,
      "centerY": -40,
      "stateNum": 1
    },
    {
      "_$id": "py7wc4fqu6",
      "_$type": "Button",
      "name": "ysBtn",
      "skin": "resources/ui/btn/ic1.png",
      "left": 32,
      "top": 100,
      "stateNum": 1
    },
    {
      "_$id": "0433etioae",
      "_$type": "Button",
      "name": "tableBtn",
      "skin": "resources/ui/btn/ic2.png",
      "left": 32,
      "top": 244,
      "visible": false,
      "stateNum": 1
    },
    {
      "_$id": "qen89kefxm",
      "_$type": "Button",
      "name": "moreBtn",
      "skin": "resources/ui/btn/ic0.png",
      "left": 32,
      "top": 244,
      "visible": false,
      "stateNum": 1
    },
    {
      "_$id": "hjfmnt5f73",
      "_$type": "Label",
      "name": "coinLabel",
      "text": "金币: 0",
      "fontSize": 32,
      "color": "#ffec8b",
      "bold": true,
      "stroke": 3,
      "strokeColor": "#1b4c86",
      "centerX": 0,
      "bottom": 300
    },
    {
      "_$id": "nn3hobxsq9",
      "_$type": "Label",
      "name": "powerLabel",
      "text": "体力: 0",
      "fontSize": 32,
      "color": "#ffec8b",
      "bold": true,
      "stroke": 3,
      "strokeColor": "#1b4c86",
      "centerX": 0,
      "bottom": 250
    },
    {
      "_$id": "1cnlci9zmv",
      "_$type": "Button",
      "name": "addCoinBtn",
      "label": "金币 +100",
      "centerX": 0,
      "bottom": 160,
      "skin": "resources/ui/btn/btn_bg.png",
      "labelColors": "#ffffff",
      "labelSize": 28,
      "labelBold": true,
      "sizeGrid": "20,20,20,20",
      "width": 240,
      "height": 70,
      "stateNum": 1
    },
    {
      "_$id": "hrzw6twedv",
      "_$type": "Button",
      "name": "usePowerBtn",
      "label": "消耗体力",
      "centerX": 0,
      "bottom": 70,
      "skin": "resources/ui/btn/btn_bg.png",
      "labelColors": "#ffffff",
      "labelSize": 28,
      "labelBold": true,
      "sizeGrid": "20,20,20,20",
      "width": 240,
      "height": 70,
      "stateNum": 1
    },
    {
      "_$id": "lzenybd1ie",
      "_$type": "Button",
      "name": "clearBtn",
      "label": "清空存档",
      "right": 30,
      "top": 30,
      "skin": "resources/ui/btn/btn_bg.png",
      "labelColors": "#ffffff",
      "labelSize": 28,
      "labelBold": true,
      "sizeGrid": "20,20,20,20",
      "width": 160,
      "height": 56,
      "stateNum": 1
    }
  ],
  "_$ver": 1,
  "name": "HomeWnd",
  "_$comp": [
    {
      "_$type": "cb83b5fc-6a06-4b96-b9ab-6cf9ab0dda2c",
      "scriptPath": "../../../../src/script/HomeWnd.ts"
    }
  ]
}