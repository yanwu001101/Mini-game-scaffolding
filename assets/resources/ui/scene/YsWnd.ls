{
  "_$id": "jaabbfmaig",
  "_$type": "Scene",
  "width": 511,
  "height": 527,
  "_$child": [
    {
      "_$id": "0ulawxnwb3",
      "_$type": "Image",
      "name": "bg",
      "skin": "resources/ui/yinsi/yinsi_1.png",
      "sizeGrid": "117,29,45,32",
      "width": 511,
      "height": 527
    },
    {
      "_$id": "ookkd64yin",
      "_$type": "Label",
      "name": "title",
      "text": "隐私政策",
      "fontSize": 40,
      "color": "#ffffff",
      "bold": true,
      "width": 511,
      "align": "center",
      "y": 22
    },
    {
      "_$id": "e73zg6tv33",
      "_$type": "Box",
      "name": "content",
      "x": 16,
      "y": 104,
      "width": 480,
      "height": 308,
      "mouseEnabled": true,
      "scrollRect": {
        "_$type": "Rectangle",
        "width": 480,
        "height": 308
      },
      "_$child": [
        {
          "_$id": "pmvyq676rt",
          "_$type": "Label",
          "name": "contentLabel",
          "text": "用户隐私政策\n\n我们非常注重保护用户个人信息及隐私，将按照法律法规要求和业界成熟的安全标准，采取相应的安全保护措施保护您的个人信息。\n\n本演示为脚手架示例文案，实际项目请替换为符合渠道审核要求的完整隐私政策，并在此说明信息的收集内容、用途、存储与删除方式。\n\n1. 信息收集：仅在为您提供服务所必需的范围内收集信息；\n2. 信息用途：用于实现游戏功能、保障账号安全与优化体验；\n3. 信息存储：存储期限为实现目的所必需的最短时间；\n4. 联系我们：如需访问、更正或删除个人信息，可通过官方渠道联系我们。",
          "fontSize": 18,
          "color": "#454545",
          "leading": 10,
          "width": 480,
          "wordWrap": true
        }
      ]
    },
    {
      "_$id": "dtojzwc2zz",
      "_$type": "Button",
      "name": "okBtn",
      "skin": "resources/ui/btn/yes.png",
      "label": "同意",
      "labelColors": "#ffffff",
      "labelSize": 30,
      "labelBold": true,
      "width": 176,
      "height": 63,
      "x": 243,
      "y": 419,
      "stateNum": 1
    },
    {
      "_$id": "59t7tm7qqp",
      "_$type": "Button",
      "name": "noBtn",
      "skin": "resources/ui/btn/no.png",
      "label": "不同意",
      "labelColors": "#ffffff",
      "labelSize": 30,
      "labelBold": true,
      "width": 176,
      "height": 63,
      "x": 33,
      "y": 419,
      "stateNum": 1
    }
  ],
  "_$ver": 1,
  "name": "YsWnd",
  "_$comp": [
    {
      "_$type": "b28e91fa-a2fa-47c4-b7e2-35050b467c94",
      "scriptPath": "../../../../src/script/YsWnd.ts"
    }
  ]
}