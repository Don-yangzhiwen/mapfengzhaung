var option = {
  element: 'container', //  容器的id名
  point: { //  中心地理坐标点
    lng: '116.333926', //  经度
    lat: '39.997245' //  纬度
  },
  zoom: 15, //  地图缩放级别
  view: { // 是否开启3D地图
    // viewMode: '3D',
    pitch: '75', // 地图的初始俯仰角度,有效范围为0度－83度
    controlBar: false // 是否有3D导航标志,默认true
  },
  // islogo: true, //  是否隐藏logo,默认true
  language: 'zh_cn', //  显示英文或者中英文底图,默认 'zh_cn'(中文)('en', 'zh_en', 'zh_cn')
  control: { //  自定义控件
    // toolBar: true, // 平移缩放控件
    // scale: true, // 比例尺控件
    // overView: true, // 鹰眼控件
    // mapType: true, // 地图类型控件
    // geolocation: true, // 定位控件
  },
  tagging: {
    marker: true, // 创建标注,默认false
    // setAnimation: true,// 给标注跳转的动画,默认false
    icon: 'http://webapi.amap.com/images/car.png', //  自定义的标注图标
    offset: {
      left: -26,
      top: -13
    },
    dragging: true, // 是否可以拖拽,默认false
    // 是否有文本标注
    label: {
      // text: '1234', // 标注内容
      offset: { //修改label相对于maker的位置
        left: 30,
        top: 15
      },
      // setStyle: 'color: red;font-size:18px;' // 设置样式,跟js一样
    },
  },
  polyline: {
    //  获取的经纬度数据
    data: [
      [116.333926, 39.997245],
      [116.233122, 39.991176],
      [116.132271, 39.992501],
      [116.132258, 38.994600]
    ],
    // moveAlong: true, // 轨迹回放
    // editing: true, //  开启线、面编辑功能,默认false
    label: { // 标注功能
      text: ['123', '456', '789', '1'], // 标注内容
      offset: { //设置文本偏移量
        // left: -15,
        // top: -35
      },
      textAlign: 'right', //  'left' 'right', 'center',文本的位置,默认center
      verticalAlign: 'middle', //  middle 、bottom 文本与地点对齐位置,默认middle
      angle: 10, //  文本的旋转度,默认0
      setStyle: { //  文本的样式，以对象的键值对写
        color: '#666',
        // fontSize: '14px',
        borderColor: '#0094FF',
        // padding: '5px'
      }
    },
    //  点击标注获取覆盖物的信息
    getInfo: function (data) {
      // console.log(data);
    }
  },
  menu: true //  是否打开邮件菜单
};

var gaodeMap = new GaodeMap(option);

function GaodeMap(option) {
  var map = new AMap.Map(option.element, {
    //  基本地图展示
    resizeEnable: true,
    zoom: option.zoom,
    center: [option.point.lng, option.point.lat],
    //  3D地图
    viewMode: (option.view && option.view.viewMode === '3D') ? '3D' : '',
    pitch: (option.view && option.view.pitch) ? option.view.pitch : '',
    zooms: [3, 20],
    expandZoomRange: true,
    buildingAnimation: true, //楼块出现是否带动画
  });
  //  添加3D导航
  var a = new AMap.ControlBar({
    showZoomBar: false,
    showControlButton: true,
    position: {
      right: '10px',
      top: '10px'
    }
  });
  (option.view && option.view.controlBar !== false) ? map.addControl(a): '';
  //  是否隐藏logo
  if (option.islogo !== false) {
    document.getElementsByClassName('amap-logo')[0].style = 'top:-100px';
    document.getElementsByClassName('amap-copyright')[0].style = 'top:-100px';
  };
  //  显示中英文或者中文地图
  map.setLang((option.language) ? option.language : 'zh_cn');
  // 显示相关控件
  if (option.control) {
    var control = option.control;
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.OverView', 'AMap.MapType'],
      function () {
        (control.toolBar) ? map.addControl(new AMap.ToolBar()): '';
        (control.geolocation) ? map.addControl(new AMap.Geolocation()): '';
        (control.overView) ? map.addControl(new AMap.OverView()): '';
        (control.scale) ? map.addControl(new AMap.Scale()): '';
        (control.mapType) ? map.addControl(new AMap.MapType()): '';
      });
  }
  //  调节文本标签的样式
  window.onload = function () {
    if (option.tagging && option.tagging.label && option.tagging.label.text && option.tagging.label.setStyle) {
      document.getElementsByClassName('amap-marker-label')[0].style = option.tagging.label.setStyle;
    };
  }
  //  添加中心点标注
  if (option.tagging) {
    var tagging = option.tagging;
    var marker = new AMap.Marker({
      position: [option.point.lng, option.point.lat],
      icon: (tagging.icon) ? tagging.icon : '',
      offset: new AMap.Pixel((tagging.offset && tagging.offset.left) ? tagging.offset.left : '0', (tagging.offset && tagging.offset.top) ? tagging.offset.top : '0'),
      // 设置点的拖拽效果
      draggable: (tagging.dragging) ? tagging.dragging : false,
      cursor: (tagging.dragging) ? 'move' : '',
    });
    (tagging.marker) ? marker.setMap(map): '';
    //  设置点的弹跳效果
    (tagging.setAnimation) ? marker.setAnimation('AMAP_ANIMATION_BOUNCE'): '';
    // 设置label标签

    marker.setLabel({ //label默认蓝框白底左上角显示，样式className为：amap-marker-label
      offset: new AMap.Pixel((tagging.label && tagging.label.offset && tagging.label.offset.left) ? tagging.label.offset.left : '0', (tagging.label && tagging.label.offset && tagging.label.offset.top) ? tagging.label.offset.top : '0'), //修改label相对于maker的位置
      content: (tagging.label && tagging.label.text) ? tagging.label.text : '',
    });
  };

  if (option.polyline) {
    var oPolyline = option.polyline;
    //  添加折线 
    var lineArr = oPolyline.data;
    var arr = [];
    for (var i = 0; i < lineArr.length; i++) {
      var text = new AMap.Text({
        text: (oPolyline.label && oPolyline.label.text) ? oPolyline.label.text[i] : '',
        textAlign: (oPolyline.label && oPolyline.label.textAlign) ? oPolyline.label.textAlign : 'center', // 'left' 'right', 'center',
        verticalAlign: (oPolyline.label && oPolyline.label.verticalAlign) ? oPolyline.label.verticalAlign : 'center', //middle 、bottom
        draggable: true,
        cursor: 'pointer',
        angle: (oPolyline.label && oPolyline.label.angle) ? oPolyline.label.angle : 0, //  文本的旋转度,默认0

        offset: (oPolyline.label && oPolyline.label.offset) ? new AMap.Pixel((oPolyline.label.offset.left) ? oPolyline.label.offset.left : 0, (oPolyline.label.offset.top) ? oPolyline.label.offset.top : 0) : new AMap.Pixel(0, 0), //相对于基点的偏移位置]
        //  文本的样式
        style: (oPolyline.label && oPolyline.label.setStyle) ? oPolyline.label.setStyle : '',
        position: [lineArr[i][0], lineArr[i][1]]
      });
      text.setMap(map);


      AMap.service('AMap.Geocoder', function () { //回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder({
          city: "010" //城市，默认：“全国”
        });
        //逆地理编码
        var lnglatXY = [lineArr[i][0], lineArr[i][1]]; //地图上所标点的坐标
        geocoder.getAddress(lnglatXY, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            //获得了有效的地址信息:
            //即，result.regeocode.formattedAddress
            arr.push(result);
            if (arr.length === lineArr.length) {
              oPolyline.getInfo(arr);
            }
          } else {
            //获取地址失败
            oPolyline.getInfo('获取地址失败');
          }
        });
        //TODO: 使用geocoder 对象完成相关功能
      })


    };

    var polyline = new AMap.Polyline({
      path: lineArr, //设置线覆盖物路径
      strokeColor: "#3366FF", //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 5, //线宽
      strokeStyle: "solid", //线样式
      strokeDasharray: [10, 5] //补充线样式
    });
    var passedPolyline = new AMap.Polyline({
      map: map,
      strokeColor: "#F00", //线颜色
      strokeWeight: 3, //线宽
    });
    marker.on('moving', function (e) {
      passedPolyline.setPath(e.passedPath);
    })
    polyline.setMap(map);
    map.setFitView();
    (oPolyline.moveAlong) ? marker.moveAlong(lineArr, 500): '';
    editor = new AMap.PolyEditor(map, polyline);
    (oPolyline.editing) ? editor.open(): '';
  };

  (option.menu) ? menu = new ContextMenu(map): '';

  function ContextMenu(map) {
    var me = this;
    this.mouseTool = new AMap.MouseTool(map); //地图中添加鼠标工具MouseTool插件
    this.contextMenuPositon = null;
    var content = [];
    content.push("<div>");
    content.push("    <ul class='context_menu'>");
    content.push("        <li onclick='menu.zoomMenu(0)'>缩小</li>");
    content.push("        <li class='split_line' onclick='menu.zoomMenu(1)'>放大</li>");
    content.push("        <li class='split_line' onclick='menu.distanceMeasureMenu()'>距离量测</li>");
    content.push("        <li onclick='menu.addMarkerMenu()'>添加标记</li>");
    content.push("    </ul>");
    content.push("</div>");
    this.contextMenu = new AMap.ContextMenu({
      isCustom: true,
      content: content.join('')
    }); //通过content自定义右键菜单内容
    //地图绑定鼠标右击事件——弹出右键菜单
    map.on('rightclick', function (e) {
      me.contextMenu.open(map, e.lnglat);
      me.contextMenuPositon = e.lnglat; //右键菜单位置
    });
  };

  ContextMenu.prototype.zoomMenu = function zoomMenu(tag) { //右键菜单缩放地图
    if (tag === 0) {
      map.zoomOut();
    }
    if (tag === 1) {
      map.zoomIn();
    }
    this.contextMenu.close();
  }
  ContextMenu.prototype.distanceMeasureMenu = function () { //右键菜单距离量测
    this.mouseTool.rule();
    this.contextMenu.close();
  }
  ContextMenu.prototype.addMarkerMenu = function () { //右键菜单添加Marker标记
    this.mouseTool.close();
    var marker = new AMap.Marker({
      map: map,
      position: this.contextMenuPositon //基点位置
    });
    this.contextMenu.close();
  }


};