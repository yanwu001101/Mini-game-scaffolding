{
  "_$id": "4a2nlqq46r",
  "_$type": "Scene",
  "width": 1280,
  "height": 720,
  "_$child": [
    {
      "_$id": "dgs87k9xga",
      "_$type": "Image",
      "name": "bg",
      "skin": "resources/ui/bg.png",
      "left": 0,
      "right": 0,
      "top": 0,
      "bottom": 0
    },
    {
      "_$id": "410v0gxezl",
      "_$type": "Label",
      "name": "tf",
      "text": "资源加载中...",
      "fontSize": 30,
      "color": "#ffffff",
      "bold": true,
      "centerX": 0,
      "bottom": 130
    },
    {
      "_$id": "i4fedmu3q9",
      "_$type": "ProgressBar",
      "name": "bar",
      "skin": "resources/ui/progress/loading_jindu.png",
      "sizeGrid": "0,10,0,8",
      "width": 1280,
      "height": 15,
      "bottom": 22,
      "value": 0
    },
    {
      "_$id": "c234idhkxx",
      "_$type": "Button",
      "name": "startBtn",
      "skin": "resources/ui/btn/play.png",
      "centerX": 0,
      "y": 506,
      "visible": false,
      "stateNum": 1
    }
  ],
  "_$ver": 1,
  "name": "LoadingWnd",
  "_$comp": [
    {
      "_$type": "6f2a1c93-8b47-4e5d-9a20-3c7d15e8f4b6",
      "scriptPath": "../../../../src/script/LoadingWnd.ts"
    }
  ]
}