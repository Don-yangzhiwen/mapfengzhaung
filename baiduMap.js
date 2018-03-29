function BaiduMap(option) {
  var map = new BMap.Map(option.element);
  var point = new BMap.Point(option.point.lng, option.point.lat);
  map.centerAndZoom(point, option.zoom);
  var control = option.control;
  //  定义控件
  if (control) {
    //  平移缩放控件
    map.addControl((control.nav) ? new BMap.NavigationControl({
      anchor: (control.navAnchor) ? control.navAnchor : '',
      type: (control.navType) ? control.navType : ''
    }) : '');
    //  缩略地图
    map.addControl((control.ove) ? new BMap.OverviewMapControl({
      anchor: (control.oveAnchor) ? control.oveAnchor : ''
    }) : '');
    //  比例尺 
    map.addControl((control.sca) ? new BMap.ScaleControl({
      anchor: (control.scaAnchor) ? control.scaAnchor : ''
    }) : '');
    //  地图类型
    map.addControl((control.map) ? new BMap.MapTypeControl({
      anchor: (control.mapAnchor) ? control.mapAnchor : ''
    }) : '');
    map.setCurrentCity("深圳"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
    //  定位控件
    map.addControl((control.geo) ? new BMap.GeolocationControl({
      anchor: (control.geoAnchor) ? control.geoAnchor : ''
    }) : '');
  }
  (option.enZoom === false) ? '' : map.enableScrollWheelZoom(); //启动鼠标滚轮缩放地图
  if (option.tagging) {
    var tagging = option.tagging;
    // 创建标注
    var myIcon = new BMap.Icon((tagging.icon) ? tagging.icon : '', new BMap.Size((tagging.iconSize) ? tagging.iconSize.width : '', (tagging.iconSize) ? tagging.iconSize.height : ''));
    var marker = new BMap.Marker(point, {
      icon: (tagging.iconSize) ? myIcon : ''
    });
    map.addOverlay((tagging.marker) ? marker : ''); // 将标注添加到地图中
    marker.setAnimation((tagging.setAnimation) ? BMAP_ANIMATION_BOUNCE : ''); //跳动的动画
    (tagging.dragging) ? marker.enableDragging(): marker.disableDragging(); // 可拖拽
    var label = new BMap.Label((tagging.label && tagging.label.text) ? tagging.label.text : '', {
      offset: (tagging.label && tagging.label.offset) ? new BMap.Size((tagging.label.offset.left) ? tagging.label.offset.left : 0, (tagging.label.offset.top) ? tagging.label.offset.top : 0) : ''
    });
    if (tagging.label && tagging.label.setStyle) {
      var style = tagging.label.setStyle;
      label.setStyle({
        color: style.color,
        fontSize: style.fontSize,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth,
        padding: style.padding,
        margin: style.margin
      });
    };
    marker.setLabel(label);
    if (tagging.getInfo) {
      var p = marker.getPosition();
      tagging.getInfo(p);
    }
  }
  // 添加折线
  var oPolyline = option.polyline;
  if (oPolyline.data) {
    var oArr = [];
    // 添加折线
    var arr = oPolyline.data;
    var array = [];
    //  自适应视图
    map.setViewport(arr);
    // map.setViewport([new BMap.Point(116.395, 39.910)]);
    for (var i = 0; i < arr.length; i++) {
      array.push(new BMap.Point(arr[i].lng, arr[i].lat));
      var opts = {
        position: new BMap.Point(arr[i].lng, arr[i].lat), // 指定文本标注所在的地理位置
        offset: (oPolyline.label && oPolyline.label.offset) ? new BMap.Size((oPolyline.label.offset.left) ? oPolyline.label.offset.left : 0, (oPolyline.label.offset.top) ? oPolyline.label.offset.top : 0) : '', //设置文本偏移量
      }
      if (oPolyline.label && oPolyline.label.text && oPolyline.label.text[i] !== undefined) {
        var a = oPolyline.label.text[i];
        var labels = new BMap.Label(a, opts); // 创建文本标注对象
      };

      if (oPolyline.label && oPolyline.label.setStyle) {
        var style = oPolyline.label.setStyle;
        labels.setStyle({
          color: style.color,
          fontSize: style.fontSize,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth,
          padding: style.padding,
          margin: style.margin
        });
      }

      map.addOverlay(labels);
      var points = new BMap.Point(arr[i].lng, arr[i].lat);
      if (oPolyline.morePoint) {
        //  添加多个标注点
        addMarker(points);
        // 编写自定义函数,创建标注
        function addMarker(points) {
          var marker = new BMap.Marker(points);
          map.addOverlay(marker);
        }
      };
      //  获取标注的地理位置
      var geoc = new BMap.Geocoder();
      geoc.getLocation(points, function (rs) {
        oArr.push(rs);
        if (oPolyline.getInfo && oArr.length === arr.length) {
          oPolyline.getInfo(oArr);
        }
      });
    };
    var polyline = new BMap.Polyline(array, {
      strokeColor: (oPolyline.strokeColor) ? oPolyline.strokeColor : 'blue',
      strokeWeight: (oPolyline.strokeWeight) ? oPolyline.strokeWeight : 2,
      strokeOpacity: (oPolyline.strokeOpacity) ? oPolyline.strokeOpacity : 0.5
    });
    map.addOverlay(polyline);
    (oPolyline.editing) ? polyline.enableEditing(): polyline.disableEditing(); //  开启线、面编辑功能
  };

}