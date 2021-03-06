

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
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
            success: successFunc,
            error: errorFunc
        });
    },
    getPolygon: function (groupId, successFunc, errorFunc) {
        $.ajax({
            type: 'get',
            url: '/api/DrawAMap/' + groupId,//发送请求  
            data: { groupId: groupId },
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: successFunc,
            error: errorFunc
        });
    },
    delPolygon: function (id, successFunc, errorFunc) {
        $.ajax({
            type: 'delete',
            url: '/api/DrawAMap/' + id,//发送请求  
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
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

var contextmenu = new AMap.ContextMenu();
var pos = [];
// 添加右键菜单内容项
contextmenu.addItem("删除", function () {
    //map.zoomIn();
    mapControl.deletePolygon();
}, 0);
//contextmenu.addItem("缩小", function () {
//    map.zoomOut();
//}, 1);
//contextmenu.addItem("添加点标记", function () {
//    var marker = new AMap.Marker({
//        map: map,
//        position: pos
//    });
//}, 2);
//// 监听鼠标右击事件
//map.on("rightclick", function (e) {
//    contextmenu.open(map, e.lnglat);
//    pos = e.lnglat;
//});

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
    pathArr: [],
    parentId: 0,
    groupId: 0,
    saveForm: $("#save")
};


var mapControl = {
    CbxOnSelect: function (groupId) {
        editor.groupId = groupId;
        $.dataService.getPolygon(groupId, function (data) {
            //选择时初始化;
            map.clearMap();
            mapControl.init();
            for (var index = 0, endIndex = data.length - 1; index <= endIndex; index++) {
                var area = JSON.parse(data[index].areaLngLat);
                console.log(area);
                var pyArr = [];
                for (var arrIndex = 0, endArrIndex = area.length - 1; arrIndex <= endArrIndex; arrIndex++) {
                    pyArr.push(new AMap.LngLat(area[arrIndex].lng, area[arrIndex].lat));
                }
                var polygon = mapControl.createPolygon(pyArr, data[index].areaId);
                editor.currentPolygonEditor = mapControl.createEditor(polygon);

            }


            console.log("success");
            console.log(data)
        }, function (data) {
            console.log("err");
            console.log(data);
        });
    }, showChildren: function () {
        $.dataService.getPolygon("area/" + editor.groupId + "/area", function (data) {
            //选择时初始化;

            for (var index = 0, endIndex = data.length - 1; index <= endIndex; index++) {
                var area = JSON.parse(data[index].areaLngLat);
                console.log(area);
                var pyArr = [];
                for (var arrIndex = 0, endArrIndex = area.length - 1; arrIndex <= endArrIndex; arrIndex++) {
                    pyArr.push(new AMap.LngLat(area[arrIndex].lng, area[arrIndex].lat));
                }
                var polygon = mapControl.createNoArrPolygon(pyArr);


            }


            console.log("success");
            console.log(data)
        }, function (data) {
            console.log("err");
            console.log(data);
        });

    }, selectItem: function (node) {
        var $cbtree = $('#cbtree').combotree('tree');	// get the tree object
        var n = $cbtree.tree('getSelected');		// get selected node
        var parent = $cbtree.tree('getParent', node.target);
        if (parent)
            editor.parentId = parent.id;

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
    }, openSaveWindow: function () {
        if (editor.groupId)
            //在这里面输入任何合法的js语句
            editor.layOpen = layer.open({
                type: 1 //Page层类型
                , area: ['500px', '200px']
                , title: '保存绘图'
                , shade: 0.6 //遮罩透明度
                , maxmin: true //允许全屏最小化
                , anim: 1 //0-6的动画形式，-1不开启
                , content: editor.saveForm
                , end: function () {
                    editor.saveForm.hide();
                }
            });
        else
            layer.alert('你还未选择所属层级', {
                icon: 5,
                title: "提示"
            });
    },
    savePolygon() {

        var p = parent, that = this;

        var $cbtree = $('#cbtree').combotree('tree');	// get the tree object
        var n = $cbtree.tree('getSelected');		// get selected node
        var groupId = $("#cbtree").combotree("getValue")
        if (groupId) {

            var param = [];

            for (var index = 0, endIndex = editor.polygonArr.length - 1; index <= endIndex; index++) {
                var lngLat = [], polygons = editor.polygonArr[index].getPath(), areaName = $("#area_name").val();;
                for (var polygonIndex = 0, endPolygonIndex = polygons.length - 1; polygonIndex <= endPolygonIndex; polygonIndex++) {
                    lngLat.push({ lng: polygons[polygonIndex].lng, lat: polygons[polygonIndex].lat });
                }

                param.push({ AreaId: polygons.pyId, AreaLngLat: JSON.stringify(lngLat), groupId: groupId, parentGroupId: editor.parentId, AreaName: areaName });
            }
            //var lnglat = JSON.stringify(this.editor.resPolygon), areaName = $("#area_name").val();
            //var data = JSON.stringify({ AreaId: GUID.newGuid(), AreaName: areaName, AreaLngLat: lnglat, groupId: groupId });
            //var dataParams = { polygon: JSON.stringify(param) };
            var dataParams = JSON.stringify(param);
            console.log(dataParams);
            $.dataService.postPolygon(dataParams, function (data) {
                console.log(data);
                layer.alert('保存成功', {
                    icon: 1,
                    title: "提示"
                });
                parent.layer.close(editor.layOpen);
            }, function (data) {
                if (data.status === 200) {
                    console.log(data);
                    layer.alert('保存成功', {
                        icon: 1,
                        title: "提示"
                    });
                    parent.layer.close(editor.layOpen);
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
    deletePolygon: function () {
        if (editor.currentPolygon) {
            layer.confirm('你是否要删除当前对象', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                var polygonIndex = editor.currentPolygon.index, pyId = editor.currentPolygon.pyId;
                $.dataService.delPolygon(pyId, function (data) {
                    layui.msg("删除成功");
                    editor.polygonArr.splice(polygonIndex, 1);
                    var curEditor = editor.polygonEditorArr[polygonIndex];
                    curEditor.close();
                    editor.polygonEditorArr.splice(polygonIndex, 1);
                    //map.remove(editor.polygonEditorArr[index]);
                    map.remove(editor.currentPolygon);
                    layer.close(index);
                    editor.currentPolygon = null;
                }, function (data) {

                    if (data.status === 200) {
                      
                        editor.polygonArr.splice(polygonIndex, 1);
                        var curEditor = editor.polygonEditorArr[polygonIndex];
                        curEditor.close();
                        editor.polygonEditorArr.splice(polygonIndex, 1);
                        //map.remove(editor.polygonEditorArr[index]);
                        map.remove(editor.currentPolygon);
                        layer.close(index);
                        editor.currentPolygon = null;
                        console.log(data);
                        layer.alert('删除成功', {
                            icon: 1,
                            title: "提示"
                        });
                        
                    }
                    else {
                        // console.log(err);
                        layer.alert('删除失败', {
                            icon: 5,
                            title: "提示"
                        });
                    }
                   
                });
                //editor.polygonEditorArr[index].close();

            }, function () {
                //layer.msg('也可以这样', {
                //    time: 20000, //20s后自动关闭
                //    btn: ['明白了', '知道了']
                //});
            });

        } else {
            layer.alert('未选中删除对象', {
                icon: 5,
                title: "提示"
            });
        }

    }
    ,
    //上面用到的几个函数
    //创建一个多边形对象
    createPolygon: function (arr, id) {
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
        polygon.pyId = id;
        AMap.event.addListener(polygon, 'rightclick', function (e) {
            contextmenu.open(map, e.lnglat);
            editor.currentPolygonEditor.close();
            editor.currentPolygonEditor = editor.polygonEditorArr[this.index];
            editor.currentPolygonEditor.open();
            editor.currentPolygon = this;
        });
        editor.polygonArr.push(polygon);
        return polygon;
    }, createNoArrPolygon: function (arr) {
        var polygon = new AMap.Polygon({
            map: map,
            path: arr,
            strokeColor: "#0000ff",
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: "#f5deb3",
            fillOpacity: 0.35
        });
    },
    mapOnClick: function (e) {
        // document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
        editor.beginMarks.push(mapControl.addMarker(e.lnglat));
        console.log(e.lnglat);
        editor.beginPoints.push(e.lnglat);
        editor.beginNum++;
        if (editor.beginNum == 3) {
            //editor.currentIndex++;
            console.log(editor.beginPoints);
            AMap.event.removeListener(editor.clickListener);
            var polygon = mapControl.createPolygon(editor.beginPoints, GUID.newGuid());
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