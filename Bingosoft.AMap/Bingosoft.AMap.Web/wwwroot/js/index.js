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
            polygonArr:[]
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
            this.editor.polygonEditorArr[this.editor.currentIndex].close();
            this.editor.beginNum = 0;
            this.editor.beginPoints.length = 0;
            var that = this;
            this.editor.clickListener = AMap.event.addListener(this.map, "click", function (e) {
                that.mapOnClick(e, that)
            });
            var $cbtree = $('#cbtree').combotree('tree');	// get the tree object
            var n = $cbtree.tree('getSelected');		// get selected node
            var groupId = $("#cbtree").combotree("getValue")
            if (groupId)
                //在这里面输入任何合法的js语句
                this.editor.layOpen = layer.open({
                    type: 1 //Page层类型
                    , area: ['500px', '300px']
                    , title: '保存绘图'
                    , shade: 0.6 //遮罩透明度
                    , maxmin: true //允许全屏最小化
                    , anim: 1 //0-6的动画形式，-1不开启
                    , content: $("#save")
                });
            else
                layer.alert('你还未选择所属层级', {
                    icon: 5,
                    title: "提示"
                });
        },
        openEditor: function () {
            if (!this.editor.isOpen)
                {
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
                that.editor.polygon = that.createPolygon(that.editor.beginPoints);
                that.createEditor(that.editor.polygon);
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
                
                that.editor.polygonEditor && that.editor.polygonEditor.close();
                that.editor.polygonEditorArr[this.currentIndex].open();
                that.editor.polygonEditor = that.editor.polygonEditorArr[this.currentIndex];
                //that.editor.polygonEditor.open();
                layer.msg(this.currentIndex);
            });
            this.editor.polygonArr.push(polygon);
            return polygon;
        },
        createEditor: function (polygon) {
            this.editor.polygonEditor = new AMap.PolyEditor(this.map, polygon);
           
            this.editor.isOpen = true;
            var that = this;
            AMap.event.addListener(this.editor.polygonEditor, 'end', function (res) {
                that.polygonEnd(res, that)
            });
            this.editor.polygonEditorArr.push(this.editor.polygonEditor);
            this.editor.polygonEditor.open();
            // return polygonEditor;
        },
        polygonEnd: function (res, that) {
            //that.editor.resPolygon.push();
            var polygons = res.target.getPath()
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