{
  "_$id": "1pxxm7kwce",
  "_$type": "Scene",
  "width": 600,
  "height": 460,
  "_$child": [
    {
      "_$id": "9cqoppgc6y",
      "_$type": "Image",
      "name": "bg",
      "skin": "resources/ui/panel_black.png",
      "alpha": 0.5,
      "left": 0,
      "right": 0,
      "top": 0,
      "bottom": 0
    },
    {
      "_$id": "kvb4hhn6t9",
      "_$type": "Label",
      "name": "title",
      "text": "游戏暂停",
      "fontSize": 48,
      "color": "#ffffff",
      "bold": true,
      "centerX": 0,
      "y": 70
    },
    {
      "_$id": "q7pb1qk1fk",
      "_$type": "Button",
      "name": "resumeBtn",
      "label": "继续游戏",
      "centerX": 0,
      "y": 180,
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
      "_$id": "ykcol91upq",
      "_$type": "Button",
      "name": "resultBtn",
      "label": "结束演示（结算）",
      "centerX": 0,
      "y": 270,
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
      "_$id": "kwtr5bcycr",
      "_$type": "Button",
      "name": "exitBtn",
      "label": "回主页",
      "centerX": 0,
      "y": 360,
      "skin": "resources/ui/btn/btn_bg.png",
      "labelColors": "#ffffff",
      "labelSize": 28,
      "labelBold": true,
      "sizeGrid": "20,20,20,20",
      "width": 240,
      "height": 70,
      "stateNum": 1
    }
  ],
  "_$ver": 1,
  "name": "PauseWnd",
  "_$comp": [
    {
      "_$type": "5b4f12c2-6f57-42c6-b0ce-a7ba2860b013",
      "scriptPath": "../../../../src/script/PauseWnd.ts"
    }
  ]
}