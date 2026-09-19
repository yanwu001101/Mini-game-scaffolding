{
  "_$id": "5s6jcpx05m",
  "_$type": "Scene",
  "width": 1280,
  "height": 720,
  "_$child": [
    {
      "_$id": "h2j2intf0j",
      "_$type": "Image",
      "name": "bg",
      "skin": "resources/ui/bg.png",
      "left": 0,
      "right": 0,
      "top": 0,
      "bottom": 0
    },
    {
      "_$id": "94qbw48ryr",
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
      "_$id": "e85es4x7ub",
      "_$type": "ProgressBar",
      "name": "bar",
      "skin": "resources/ui/progress/loading_jindu.png",
      "sizeGrid": "0,10,0,8",
      "width": 1280,
      "height": 15,
      "bottom": 22,
      "value": 0
    }
  ],
  "_$ver": 1,
  "name": "GameLoadingWnd",
  "_$comp": [
    {
      "_$type": "dd7106ab-5258-4b6e-84e4-87b9e0bb3e00",
      "scriptPath": "../../../../src/script/GameLoadingWnd.ts"
    }
  ]
}