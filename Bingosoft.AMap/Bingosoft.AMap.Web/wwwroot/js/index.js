

var mapEvent = (function () {
    var mapEditor = {};





    var GUID = {
        newGuid: function () {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    guid += "-";
            }
            return guid;
        }
    }



    function AMaps() {
        this.map = new AMap.Map('container', {

            resizeEnable: true,
            center: [104.064, 30.6594], //地图中心点
            zoom: 10, //地图显示的缩放级别

        });
        var that = this;
        this.map.plugin(["AMap.MapType"], function () {
            var type = new AMap.MapType({
                defaultType: 1, //使用2D地图
                showTraffic: true,
                showRoad: false
            });
            that.map.addControl(type);
        });

        this.editor = {
            beginNum: 0,
            clickListener: null,
            beginPoints: [],
            beginMarks: [],
            polygonEditor: null,
            resPolygon: [],
            endNum: 3,
            isOpen: false,
            layOpen: null,
            currentPolygon: null,
            currentIndex: -1,
            polygonEditorArr: [],
            polygonArr: [],
            pathArr: []
        };
    }
    AMaps.prototype = {
        that: this,
        closeLayui: function () {
            //layui.close(this.editor.layOpen);
            // layui.closeAll();
            var lnglat = JSON.stringify(this.editor.resPolygon), areaName = $("#area_name").val();
            var data = JSON.stringify({ AreaId: GUID.newGuid(), AreaName: areaName, AreaLngLat: lnglat });
            var p = parent, that = this;

            $.dataService.postPolygon(data, function (data) {
                console.log(data);
                layer.alert('保存成功', {
                    icon: 1,
                    title: "提示"
                });
                p.layer.close(that.editor.layOpen);
            }, function (data) {
                if (data.status === 200) {
                    console.log(data);
                    layer.alert('保存成功', {
                        icon: 1,
                        title: "提示"
                    });
                    p.layer.close(that.editor.layOpen);
                }
                else {
                    // console.log(err);
                    layer.alert('存盘失败', {
                        icon: 5,
                        title: "提示"
                    });
                }
            });

            console.log(this.editor.resPolygon);
            this.editor.resPolygon.length = 0;

        },
        saveEditor: function () {
            if (!this.editor.polygonEditor) {
                layer.alert('你还未绘制区域哟', {
                    icon: 5,
                    title: "提示"
                });
                return;
            }
            //this.editor.polygonEditorArr[this.editor.currentIndex].close();
            this.editor.polygonEditor.close();
            this.map.remove(this.editor.polygonEditor);
            this.editor.beginNum = 0;
            this.editor.beginPoints.length = 0;
            var that = this;
            this.editor.clickListener = AMap.event.addListener(this.map, "click", function (e) {
                that.mapOnClick(e, that)
            });
            //var $cbtree = $('#cbtree').combotree('tree');	// get the tree object
            //var n = $cbtree.tree('getSelected');		// get selected node
            //var groupId = $("#cbtree").combotree("getValue")
            //if (groupId)
            //    //在这里面输入任何合法的js语句
            //    this.editor.layOpen = layer.open({
            //        type: 1 //Page层类型
            //        , area: ['500px', '300px']
            //        , title: '保存绘图'
            //        , shade: 0.6 //遮罩透明度
            //        , maxmin: true //允许全屏最小化
            //        , anim: 1 //0-6的动画形式，-1不开启
            //        , content: $("#save")
            //    });
            //else
            //    layer.alert('你还未选择所属层级', {
            //        icon: 5,
            //        title: "提示"
            //    });
        },
        openEditor: function () {
            if (!this.editor.isOpen) {
                //   this.editor.polygonEditor.open();
                this.editor.polygonEditorArr[this.editor.currentIndex].open();
            }
            else
                console.log('已打开');
        },
        closeEditor: function () {
            //if (this.editor.isOpen)
            //  this.editor.polygonEditor.open();
            this.editor.polygonEditorArr[this.editor.currentIndex].open();
        },
        restEditor: function () {

            this.map.remove(this.editor.beginMarks);
            this.map.remove(this.editor.polygon);
            this.editor.polygonEditor.close();
            this.map.remove(this.editor.polygonEditor);

            this.editor = {
                beginNum: 0,
                clickListener: null,
                beginPoints: [],
                beginMarks: [],
                polygonEditor: null,
                resPolygon: [],
                endNum: 3,
                isOpen: false,
                layOpen: null
            };
            var that = this;
            this.editor.clickListener = AMap.event.addListener(this.map, "click", function (e) {
                that.mapOnClick(e, that)
            });
        },
        initEditor: function (endNum) {
            var that = this;
            this.editor.clickListener = AMap.event.addListener(this.map, "click", function (e) {
                that.mapOnClick(e, that)
            });
            this.editor.endNum = endNum || 3;
        },
        mapOnClick: function (e, that) {

            that.editor.beginMarks.push(that.addMarker(e.lnglat));
            that.editor.beginPoints.push(e.lnglat);
            that.editor.beginNum++;
            if (that.editor.beginNum == that.editor.endNum) {
                AMap.event.removeListener(that.editor.clickListener);
                that.editor.currentIndex++;
                //that.editor.polygon = that.createPolygon(that.editor.beginPoints);
                //that.createEditor(that.editor.polygon);
                //that.editor.polygon = that.createPolygon(that.editor.beginPoints);
                that.createEditor(that.createPolygon(that.editor.beginPoints));
                that.map.remove(that.editor.beginMarks);
                that.editor.isOpen = true;
                // clearMarks();
            }
        },
        // 实例化点标记
        addMarker: function (lnglat) {

            var marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: lnglat
            });
            marker.setMap(this.map);
            return marker;
        },
        createPolygon: function (arr) {
            var polygon = new AMap.Polygon({
                map: this.map,
                path: arr,
                strokeColor: "#0000ff",
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: "#f5deb3",
                fillOpacity: 0.35
            });
            polygon.currentIndex = this.editor.currentIndex;
            console.log(polygon);
            var that = this;
            AMap.event.addListener(polygon, 'rightclick', function () {
                // ContextMenu.bind('.AMap.Polygon', menuJson);

                //that.editor.polygonEditor && that.editor.polygonEditor.close();
                //that.editor.polygonEditorArr[this.currentIndex].open();

                that.editor.polygonEditor && that.editor.polygonEditor.close();
                var polygon = that.editor.polygonArr[this.currentIndex];

                //that.editor.polygonEditor = that.editor.polygonEditorArr[this.currentIndex];
                //that.editor.polygonEditor.open();
                var arr = that.editor.pathArr[this.currentIndex];
                console.log(polygon);
                var path = polygon.getPath();
                console.log(path);
                //for (var index = 0, endIndex = path.length - 1; index <= endIndex; index++) {
                //    arr.push(path[index]);
                //}

                // that.map.remove(polygon);
                // that.createEditor(that.createPolygon(arr));
                //that.editor.polygonEditor.open();
                layer.msg(this.currentIndex + "个");
            });
            this.editor.polygonArr.push(polygon);
            return polygon;
        },
        createEditor: function (polygon) {
            this.editor.polygonEditor = new AMap.PolyEditor(this.map, polygon);
            //var polygonEditor = new AMap.PolyEditor(this.map, polygon);
            this.editor.isOpen = true;
            var that = this;
            //AMap.event.addListener(this.editor.polygonEditor, 'end', function (res) {
            //    that.polygonEnd(res, that)
            //});
            AMap.event.addListener(this.editor.polygonEditor, 'end', function (res) {
                that.polygonEnd(res, that)
            });

            this.editor.polygonEditor.CLASS_NAME = this.editor.polygonEditor.CLASS_NAME + " " + polygon.currentIndex;
            this.editor.polygonEditorArr.push(deepcopy(this.editor.polygonEditor));
            //polygonEditor.open();
            this.editor.polygonEditor.open();
            //this.editor.polygonEditorArr[this.editor.currentIndex].open();
            // return polygonEditor;
        },
        polygonEnd: function (res, that) {
            //that.editor.resPolygon.push();
            var polygons = res.target.getPath();
            if (polygons && polygons.length >= 1)
                that.editor.pathArr[res.target.currentIndex] = deepcopy(polygons);
            for (var index = 0, endIndex = polygons.length - 1; index <= endIndex; index++) {
                that.editor.resPolygon.push({ lng: polygons[index].lng, lat: polygons[index].lat });
            }
            console.log(res.target.getPath());
        }

    }

    var maps = new AMaps();
    return {
        openEditor: function () {
            maps.openEditor();
        },
        closeEditor: function () {
            maps.closeEditor();
        },
        restEditor: function () {
            maps.restEditor();
        },
        initEditor: function () {
            maps.initEditor();
        },
        saveEditor: function () {
            maps.saveEditor();
        },
        closeLayui: function () {
            maps.closeLayui();
        }

    }

    // return new AMaps();

})();


var GUID = {
    newGuid: function () {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }
}

$.dataService = {
    postPolygon: function (datas, successFunc, errorFunc) {
        $.ajax({
            type: 'POST',
            url: '/api/DrawAMap',//发送请求  
            data: datas,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: successFunc,
            error: errorFunc
        });
    },
    getPolygon: function (groupId, successFunc, errorFunc) {
        $.ajax({
            type: 'get',
            url: '/api/DrawAMap',//发送请求  
            data: { groupId: groupId },
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: successFunc,
            error: errorFunc
        });
    }
}

map = new AMap.Map('container', {

    resizeEnable: true,
    center: [104.064, 30.6594], //地图中心点
    zoom: 10, //地图显示的缩放级别

});

map.plugin(["AMap.MapType"], function () {
    var type = new AMap.MapType({
        defaultType: 1, //使用2D地图
        showTraffic: true,
        showRoad: false
    });
    map.addControl(type);
});

var editor = {
    beginNum: 0,
    clickListener: null,
    beginPoints: [],
    beginMarks: [],
    currentPolygonEditor: null,
    resPolygon: [],
    endNum: 3,
    isOpen: false,
    layOpen: null,
    currentPolygon: null,
    currentIndex: -1,
    polygonEditorArr: [],
    polygonArr: [],
    pathArr: []
};


var mapControl = {
    CbxOnSelect: function (groupId) {
        $.dataService.getPolygon(groupId, function () {

        }, function () {

        });
    }
    ,
    init: function () {
        editor.beginPoints = [];
        editor.beginMarks = [];
        editor.beginNum = 0;
        editor.polygonEditor = '';
        editor.clickListener = AMap.event.addListener(map, "click", mapControl.mapOnClick);

        //var str = '[{"J":39.91789947393269,"G":116.36744477221691,"lng":116.367445,"lat":39.917899},{"J":39.91184292800211,"G":116.40658356616223,"lng":116.406584,"lat":39.911843},{"J":39.88616249265181,"G":116.37963272998047,"lng":116.379633,"lat":39.886162}]';
        //var arr = mapControl.json2arr(str);
        //mapControl.createPolygon(arr);
    },
    savePolygon() {

        var p = parent, that = this;

        var $cbtree = $('#cbtree').combotree('tree');	// get the tree object
        var n = $cbtree.tree('getSelected');		// get selected node
        var groupId = $("#cbtree").combotree("getValue")
        if (groupId) {

            var param = [];
            for (var index = 0, endIndex = editor.polygonArr.length - 1; index <= endIndex; index++) {
                param.push({ AreaId: GUID.newGuid(), AreaLngLat: editor.polygonArr[index].getPath(), groupId: groupId });
            }
            //var lnglat = JSON.stringify(this.editor.resPolygon), areaName = $("#area_name").val();
            //var data = JSON.stringify({ AreaId: GUID.newGuid(), AreaName: areaName, AreaLngLat: lnglat, groupId: groupId });
            //var dataParams = { polygon: JSON.stringify(param) };
            var dataParams =  JSON.stringify(param) ;
            console.log(dataParams);
            $.dataService.postPolygon(dataParams, function (data) {
                console.log(data);
                layer.alert('保存成功', {
                    icon: 1,
                    title: "提示"
                });
                p.layer.close(that.editor.layOpen);
            }, function (data) {
                if (data.status === 200) {
                    console.log(data);
                    layer.alert('保存成功', {
                        icon: 1,
                        title: "提示"
                    });
                    p.layer.close(that.editor.layOpen);
                }
                else {
                    // console.log(err);
                    layer.alert('存盘失败', {
                        icon: 5,
                        title: "提示"
                    });
                }
            });

            ////在这里面输入任何合法的js语句
            //this.editor.layOpen = layer.open({
            //    type: 1 //Page层类型
            //    , area: ['500px', '300px']
            //    , title: '保存绘图'
            //    , shade: 0.6 //遮罩透明度
            //    , maxmin: true //允许全屏最小化
            //    , anim: 1 //0-6的动画形式，-1不开启
            //    , content: $("#save")
            //});
        }

        else
            layer.alert('你还未选择所属层级', {
                icon: 5,
                title: "提示"
            });



        console.log(this.editor.resPolygon);
        this.editor.resPolygon.length = 0;
    }
    ,
    // 实例化点标记
    addMarker: function (lnglat) {

        var marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: lnglat
        });
        marker.setMap(map);
        return marker;
    },
    //上面用到的几个函数
    //创建一个多边形对象
    createPolygon: function (arr) {
        var polygon = new AMap.Polygon({
            map: map,
            path: arr,
            strokeColor: "#0000ff",
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: "#f5deb3",
            fillOpacity: 0.35
        });
        polygon.index = editor.polygonEditorArr.length;
        AMap.event.addListener(polygon, 'rightclick', function () {
            editor.currentPolygonEditor.close();
            editor.currentPolygonEditor = editor.polygonEditorArr[this.index];
            editor.currentPolygonEditor.open();
        });
        editor.polygonArr.push(polygon);
        return polygon;
    },
    mapOnClick: function (e) {
        // document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
        editor.beginMarks.push(mapControl.addMarker(e.lnglat));
        editor.beginPoints.push(e.lnglat);
        editor.beginNum++;
        if (editor.beginNum == 3) {
            //editor.currentIndex++;
            AMap.event.removeListener(editor.clickListener);
            var polygon = mapControl.createPolygon(editor.beginPoints);
            editor.currentPolygonEditor = mapControl.createEditor(polygon);
            mapControl.clearMarks();
        }
    },
    //创建一个多边形对象的编辑类对象
    createEditor: function (polygon) {
        var polygonEditor = new AMap.PolyEditor(map, polygon);
        polygonEditor.open();
        AMap.event.addListener(polygonEditor, 'end', mapControl.polygonEnd);
        editor.polygonEditorArr.push(polygonEditor);
        editor.currentPolygonEditor = polygonEditor;
        return polygonEditor;
    }
    ,
    //编辑结束事件
    polygonEnd: function (res) {
        editor.resPolygon.push(res.target);
        mapControl.init();
    },
    //清除前面的3个点标记
    clearMarks: function () {
        map.remove(editor.beginMarks);
    },

    closeEditPolygon: function () {
        editor.currentPolygonEditor.close();
    },
    json2arr: function (json) {
        var arr = JSON.parse(json);
        var res = [];
        for (var i = 0; i < arr.length; i++) {
            var line = [];
            line.push(arr[i].lng);
            line.push(arr[i].lat);
            res.push(line);
        };
        return res;
    }
};