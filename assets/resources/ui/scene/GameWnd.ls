{
  "_$id": "kqdhi2nqs1",
  "_$type": "Scene",
  "width": 1280,
  "height": 720,
  "_$child": [
    {
      "_$id": "kv920dr0lg",
      "_$type": "Image",
      "name": "plane",
      "skin": "resources/ui/game/plane.png",
      "x": 640,
      "y": 360,
      "pivotX": 217,
      "pivotY": 131.5,
      "scaleX": 0.45,
      "scaleY": 0.45
    },
    {
      "_$id": "b1zvnemawo",
      "_$type": "Image",
      "name": "fanwei",
      "skin": "resources/ui/game/fanwei.png",
      "centerX": 0,
      "centerY": 0
    },
    {
      "_$id": "x7midemo9u",
      "_$type": "Box",
      "name": "joyBox",
      "left": 40,
      "bottom": 30,
      "width": 250,
      "height": 250,
      "mouseEnabled": true,
      "_$child": [
        {
          "_$id": "kgebsal5af",
          "_$type": "Image",
          "name": "joyBase",
          "skin": "resources/ui/game/joystick.png",
          "x": 34.5,
          "y": 34.5
        },
        {
          "_$id": "dmmelal8fe",
          "_$type": "Image",
          "name": "joyThumb",
          "skin": "resources/ui/game/joystick_thumb.png",
          "x": 105.5,
          "y": 105.5
        }
      ]
    },
    {
      "_$id": "srih42pddp",
      "_$type": "Button",
      "name": "pauseBtn",
      "skin": "resources/ui/btn/fanhui.png",
      "left": 25,
      "top": 25,
      "stateNum": 1
    }
  ],
  "_$ver": 1,
  "name": "GameWnd",
  "_$comp": [
    {
      "_$type": "8ecee231-9531-4561-b710-64b8bd1e004b",
      "scriptPath": "../../../../src/script/GameWnd.ts"
    }
  ]
}